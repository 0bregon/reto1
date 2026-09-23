/* =========================================================
   motor.js — Dominio puro (sin DOM). Cálculo 100% determinístico.
   Orden de cálculo por ítem:
   1) Precio lista = base × factor hospital
   2) En red: tarifa negociada (descuento por nivel)
   3) Consulta con copago fijo  → paciente paga copago
      Resto                     → deducible restante, luego coaseguro
   4) Tope anual de desembolso limita lo que paga el paciente (en red)
   5) Fuera de red: la aseguradora reconoce un % de la tarifa;
      el excedente lo paga el paciente y no cuenta para el tope.
   ========================================================= */
window.CP = window.CP || {};

CP.motor = (function () {
  const r2 = (n) => Math.round(n * 100) / 100;

  function normalizar(texto) {
    return (texto || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9ñ\s]/g, " ")
      .replace(/\s+/g, " ").trim();
  }

  /* ---------- Tool 1: Clasificador de síntomas ---------- */
  function clasificar(texto) {
    const t = normalizar(texto);
    const alertas = CP.alertas.filter(a => a.patron.some(p => t.includes(p)));
    const puntajes = Object.entries(CP.sintomas).map(([esp, claves]) => {
      const coincidencias = claves.filter(([k]) => t.includes(k));
      return { especialidad: esp, puntaje: coincidencias.reduce((s, [, w]) => s + w, 0), coincidencias: coincidencias.map(c => c[0]) };
    }).filter(p => p.puntaje > 0).sort((a, b) => b.puntaje - a.puntaje);

    const total = puntajes.reduce((s, p) => s + p.puntaje, 0) || 1;
    puntajes.forEach(p => { p.confianza = Math.round((p.puntaje / total) * 100); });

    // "mi hijo" + síntoma → pediatría gana como puerta de entrada
    const esPediatrico = puntajes.find(p => p.especialidad === "pediatria");
    if (esPediatrico && puntajes[0].especialidad !== "pediatria") {
      puntajes.splice(puntajes.indexOf(esPediatrico), 1);
      puntajes.unshift(esPediatrico);
    }
    return { alertas, sugerencias: puntajes.slice(0, 3), principal: puntajes[0] || null };
  }

  /* ---------- Tool 2: Plan del paciente ---------- */
  function obtenerPlan(aseguradoraId, planId) {
    const a = CP.aseguradoras.find(x => x.id === aseguradoraId);
    if (!a) return null;
    const p = a.planes.find(x => x.id === planId);
    return p ? { aseguradora: a, plan: p } : null;
  }

  function nivelRed(aseguradora, hospitalId) {
    if (!aseguradora) return "sin-seguro";
    return aseguradora.red[hospitalId] || "fuera";
  }

  /* ---------- Motor de cálculo ---------- */
  // estado: { dedUsado, topeUsado } — se muta para acumular entre ítems del mismo episodio
  function aplicarDeducibleCoaseguro(monto, plan, coas, estado) {
    const dedRestante = Math.max(0, plan.deducible - estado.dedUsado);
    const ded = Math.min(monto, dedRestante);
    const coaseguro = (monto - ded) * coas;
    estado.dedUsado += ded;
    return { ded, coaseguro };
  }

  function calcularItem(concepto, precioBase, esConsulta, hospital, ctx, estado) {
    const lista = r2(precioBase * hospital.factor);
    const linea = { concepto, lista, tarifa: lista, deducible: 0, coaseguro: 0, copago: 0, excedente: 0, paciente: 0, aseguradora: 0 };
    const nivel = ctx.nivel;

    if (nivel === "sin-seguro" || (nivel === "fuera" && !ctx.plan.fueraRed.cubre)) {
      linea.paciente = lista;
      return linea;
    }

    let pacienteCuentaTope = 0;

    if (nivel === "fuera") {
      const reconocido = r2(lista * ctx.plan.fueraRed.reconoce);
      linea.tarifa = reconocido;
      linea.excedente = r2(lista - reconocido);
      const { ded, coaseguro } = aplicarDeducibleCoaseguro(reconocido, ctx.plan, ctx.plan.fueraRed.coaseguro, estado);
      linea.deducible = r2(ded); linea.coaseguro = r2(coaseguro);
      pacienteCuentaTope = ded + coaseguro;
    } else {
      const tarifa = r2(lista * (1 - CP.descuentoRed[nivel]));
      linea.tarifa = tarifa;
      if (esConsulta && ctx.plan.consulta.tipo === "copago") {
        linea.copago = Math.min(ctx.plan.consulta[nivel], tarifa);
        pacienteCuentaTope = linea.copago;
      } else {
        const { ded, coaseguro } = aplicarDeducibleCoaseguro(tarifa, ctx.plan, ctx.plan.coaseguro[nivel], estado);
        linea.deducible = r2(ded); linea.coaseguro = r2(coaseguro);
        pacienteCuentaTope = ded + coaseguro;
      }
    }

    // Tope anual de desembolso
    const topeRestante = Math.max(0, ctx.plan.tope - estado.topeUsado);
    if (pacienteCuentaTope > topeRestante) {
      const factor = topeRestante / pacienteCuentaTope;
      linea.deducible = r2(linea.deducible * factor);
      linea.coaseguro = r2(linea.coaseguro * factor);
      linea.copago = r2(linea.copago * factor);
      linea.topeAlcanzado = true;
      pacienteCuentaTope = topeRestante;
    }
    estado.topeUsado += pacienteCuentaTope;

    linea.paciente = r2(pacienteCuentaTope + linea.excedente);
    linea.aseguradora = r2(Math.max(0, lista - linea.paciente - (lista - linea.tarifa - linea.excedente)));
    return linea;
  }

  /* Estima el episodio completo en un hospital */
  function estimar({ hospital, especialidadId, estudiosIds = [], perfil }) {
    const esp = CP.especialidades.find(e => e.id === especialidadId);
    const sel = perfil && perfil.aseguradora ? obtenerPlan(perfil.aseguradora, perfil.plan) : null;
    const nivel = sel ? nivelRed(sel.aseguradora, hospital.id) : "sin-seguro";
    const ctx = { nivel, plan: sel ? sel.plan : null };
    const estado = { dedUsado: perfil ? (perfil.dedUsado || 0) : 0, topeUsado: perfil ? (perfil.topeUsado || 0) : 0 };

    const lineas = [calcularItem("Consulta de " + esp.nombre.toLowerCase(), esp.precio, true, hospital, ctx, estado)];
    estudiosIds.forEach(id => {
      const e = CP.estudios[id];
      if (e) lineas.push(calcularItem(e.nombre, e.precio, false, hospital, ctx, estado));
    });

    const suma = (k) => r2(lineas.reduce((s, l) => s + l[k], 0));
    return {
      hospital, nivel, lineas,
      totalLista: suma("lista"), totalPaciente: suma("paciente"), totalAseguradora: suma("aseguradora"),
      ahorro: r2(suma("lista") - suma("paciente")),
      topeAlcanzado: lineas.some(l => l.topeAlcanzado),
      dedRestanteDespues: ctx.plan ? Math.max(0, ctx.plan.deducible - estado.dedUsado) : null
    };
  }

  /* ---------- Tool 3: Red de hospitales + ranking ---------- */
  function distanciaKm(lat1, lon1, lat2, lon2) {
    const R = 6371, rad = (d) => d * Math.PI / 180;
    const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function rankear({ especialidadId, estudiosIds, perfil, provinciaId, orden = "precio" }) {
    const prov = CP.provincias.find(p => p.id === provinciaId) || CP.provincias[0];
    const resultados = CP.hospitales
      .filter(h => h.especialidades.includes(especialidadId))
      .map(h => {
        const est = estimar({ hospital: h, especialidadId, estudiosIds, perfil });
        est.distancia = distanciaKm(prov.lat, prov.lon, h.lat, h.lon);
        return est;
      });

    resultados.sort((a, b) => orden === "distancia"
      ? a.distancia - b.distancia || a.totalPaciente - b.totalPaciente
      : a.totalPaciente - b.totalPaciente || a.distancia - b.distancia);

    if (resultados.length) {
      const masBarato = Math.min(...resultados.map(r => r.totalPaciente));
      const masCerca = Math.min(...resultados.map(r => r.distancia));
      resultados.forEach(r => {
        r.etiquetas = [];
        if (r.totalPaciente === masBarato) r.etiquetas.push("Menor costo para ti");
        if (r.distancia === masCerca) r.etiquetas.push("Más cerca");
      });
    }
    return resultados;
  }

  return { normalizar, clasificar, obtenerPlan, nivelRed, estimar, rankear, distanciaKm };
})();
