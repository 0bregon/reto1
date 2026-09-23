/* =========================================================
   app.js — Infraestructura compartida entre todas las páginas
   ========================================================= */
window.CP = window.CP || {};

/* ---------- Almacenamiento local con respaldo en memoria ---------- */
CP.store = (function () {
  const CLAVE = "copagoPA:v1";
  let memoria = {};
  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return memoria; }
  }
  function guardar(datos) {
    memoria = datos;
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) { /* modo privado */ }
  }
  return {
    get: (k) => leer()[k],
    set: (k, v) => { const d = leer(); d[k] = v; guardar(d); },
    borrar: () => { memoria = {}; try { localStorage.removeItem(CLAVE); } catch (e) {} }
  };
})();

/* Perfil del paciente: { origen, nombre?, cedula?, aseguradora, plan, dedUsado, topeUsado, provincia } */
CP.perfil = {
  obtener: () => CP.store.get("perfil") || null,
  guardar: (p) => CP.store.set("perfil", p),
  descripcion(p) {
    if (!p) return null;
    if (!p.aseguradora) return { titulo: "Sin seguro privado", detalle: "Se muestran precios de lista" };
    const sel = CP.motor.obtenerPlan(p.aseguradora, p.plan);
    if (!sel) return null;
    return { titulo: sel.plan.nombre, detalle: sel.aseguradora.nombre, sel };
  }
};

/* ---------- Formato ---------- */
CP.dinero = (n) => "B/. " + Number(n || 0).toLocaleString("es-PA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
CP.pct = (n) => Math.round(n * 100) + " %";
CP.esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
CP.nombreProvincia = (id) => (CP.provincias.find(p => p.id === id) || {}).nombre || "";
CP.nombreEspecialidad = (id) => (CP.especialidades.find(e => e.id === id) || {}).nombre || "";

CP.etiquetaNivel = {
  "preferente": { texto: "Red preferente", clase: "nivel--preferente" },
  "estandar":   { texto: "Red estándar",   clase: "nivel--estandar" },
  "fuera":      { texto: "Fuera de red",   clase: "nivel--fuera" },
  "sin-seguro": { texto: "Precio de lista",clase: "nivel--lista" }
};

/* ---------- Logos SVG originales (generados) ---------- */
CP.logo = function (h, tam = 56) {
  const { forma, c1, c2, sigla } = h.logo;
  const figuras = {
    cruz:    `<rect width="64" height="64" rx="14" fill="${c1}"/><path d="M26 12h12v14h14v12H38v14H26V38H12V26h14z" fill="${c2}"/>`,
    escudo:  `<path d="M32 4l24 8v18c0 16-10 26-24 30C18 56 8 46 8 30V12z" fill="${c1}"/><path d="M29 20h6v9h9v6h-9v9h-6v-9h-9v-6h9z" fill="${c2}"/>`,
    hoja:    `<circle cx="32" cy="32" r="30" fill="${c2}"/><path d="M16 46C16 26 30 14 50 14c0 20-12 34-32 34z" fill="${c1}"/><path d="M18 46L42 22" stroke="${c2}" stroke-width="3"/>`,
    circulo: `<circle cx="32" cy="32" r="30" fill="${c1}"/><circle cx="32" cy="32" r="21" fill="none" stroke="${c2}" stroke-width="3"/>`,
    ola:     `<rect width="64" height="64" rx="32" fill="${c1}"/><path d="M6 38c8-6 14-6 22 0s14 6 22 0 10-4 10-4v14c0 6-6 12-12 12H18C12 60 6 54 6 48z" fill="${c2}"/>`,
    montana: `<rect width="64" height="64" rx="10" fill="${c2}"/><path d="M4 54L24 20l10 16 8-10 18 28z" fill="${c1}"/><circle cx="46" cy="16" r="6" fill="${c1}" opacity=".55"/>`
  };
  const conTexto = forma === "circulo" || forma === "ola" ? `<text x="32" y="${forma === "ola" ? 30 : 38}" text-anchor="middle" font-family="Bricolage Grotesque, system-ui, sans-serif" font-weight="800" font-size="${forma === "ola" ? 17 : 18}" fill="${c2}">${sigla}</text>` : "";
  return `<svg class="logo-hosp" width="${tam}" height="${tam}" viewBox="0 0 64 64" role="img" aria-label="Logo de ${CP.esc(h.nombre)}">${figuras[forma] || figuras.circulo}${conTexto}</svg>`;
};

/* ---------- Ticket de desglose (componente compartido) ---------- */
CP.ticketHTML = function (est) {
  const filas = est.lineas.map(l => {
    const partes = [];
    if (l.tarifa !== l.lista && est.nivel !== "fuera") partes.push(`Tarifa negociada ${CP.dinero(l.tarifa)}`);
    if (est.nivel === "fuera" && l.excedente) partes.push(`Excedente no reconocido ${CP.dinero(l.excedente)}`);
    if (l.copago) partes.push(`Copago fijo ${CP.dinero(l.copago)}`);
    if (l.deducible) partes.push(`Deducible ${CP.dinero(l.deducible)}`);
    if (l.coaseguro) partes.push(`Coaseguro ${CP.dinero(l.coaseguro)}`);
    if (l.topeAlcanzado) partes.push("Tope anual alcanzado");
    return `<li class="ticket__fila">
      <div class="ticket__concepto"><span>${CP.esc(l.concepto)}</span><span class="ticket__lista">${CP.dinero(l.lista)}</span></div>
      ${partes.length ? `<p class="ticket__detalle">${partes.join("<br>")}</p>` : ""}
      <div class="ticket__pagas"><span>Tú pagas</span><strong>${CP.dinero(l.paciente)}</strong></div>
    </li>`;
  }).join("");
  return `<div class="ticket" role="group" aria-label="Desglose del estimado en ${CP.esc(est.hospital.nombre)}">
    <ul class="ticket__filas">${filas}</ul>
    <dl class="ticket__totales">
      <div><dt>Precio de lista</dt><dd>${CP.dinero(est.totalLista)}</dd></div>
      <div><dt>Cubre tu aseguradora</dt><dd>${CP.dinero(est.totalAseguradora)}</dd></div>
      <div class="ticket__total"><dt>Total estimado para ti</dt><dd>${CP.dinero(est.totalPaciente)}</dd></div>
    </dl>
  </div>`;
};

/* ---------- Cabecera, navegación y pie compartidos ---------- */
CP.montarLayout = function (paginaActiva) {
  const enlaces = [
    ["index.html", "Inicio", "inicio"],
    ["asistente.html", "Asistente", "asistente"],
    ["comparador.html", "Comparar costos", "comparador"],
    ["hospitales.html", "Hospitales", "hospitales"],
    ["mi-plan.html", "Mi plan", "mi-plan"]
  ];
  const perfil = CP.perfil.obtener();
  const desc = CP.perfil.descripcion(perfil);

  const cab = document.getElementById("cabecera");
  if (cab) {
    cab.innerHTML = `
      <a class="saltar" href="#principal">Saltar al contenido</a>
      <div class="barra-urgencia" role="note">¿Es una emergencia? Llama al <a href="tel:911">911</a> o acude a urgencias. Esta herramienta no sustituye una evaluación médica.</div>
      <div class="cabecera__interior">
        <a class="marca" href="index.html" aria-label="CopagoPA, inicio">
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="9" fill="var(--canal)"/><path d="M14 7h6v7h7v6h-7v7h-6v-7H7v-6h7z" fill="var(--guayacan)"/></svg>
          <span>Copago<b>PA</b></span>
        </a>
        <nav aria-label="Principal" class="nav">
          <ul>${enlaces.map(([href, txt, id]) => `<li><a href="${href}" ${id === paginaActiva ? 'aria-current="page"' : ""}>${txt}</a></li>`).join("")}</ul>
        </nav>
        <a class="chip-plan" href="mi-plan.html">${desc ? `<span class="chip-plan__punto" aria-hidden="true"></span>${CP.esc(desc.titulo)}` : "Identificar mi plan"}</a>
      </div>`;
  }
  const pie = document.getElementById("pie");
  if (pie) {
    pie.innerHTML = `
      <div class="pie__interior">
        <p><strong>Los montos son estimaciones, no cotizaciones garantizadas.</strong> El costo final depende de la evaluación médica, de las condiciones de tu póliza y de la autorización de tu aseguradora.</p>
        <p>Hospitales, aseguradoras, planes y tarifas de esta demostración son ficticios. B/. 1.00 = US$ 1.00.</p>
        <p>Tus datos se guardan solo en este dispositivo, conforme al espíritu de la Ley 81 de 2019 de protección de datos personales.</p>
      </div>`;
  }
};

/* Rellena un <select> con opciones */
CP.llenarSelect = function (sel, items, valor, vacio) {
  sel.innerHTML = (vacio ? `<option value="">${vacio}</option>` : "") +
    items.map(i => `<option value="${i.id}" ${i.id === valor ? "selected" : ""}>${CP.esc(i.nombre)}</option>`).join("");
};
