/* =========================================================
   datos.js — Capa de datos SIMULADOS (contexto Panamá)
   Hospitales y aseguradoras son FICTICIOS. Ubicaciones reales.
   Moneda: Balboa (B/.) = US$ 1.00
   ========================================================= */
window.CP = window.CP || {};

CP.provincias = [
  { id: "panama",       nombre: "Panamá",          lat: 8.98, lon: -79.52 },
  { id: "panama-oeste", nombre: "Panamá Oeste",    lat: 8.88, lon: -79.78 },
  { id: "colon",        nombre: "Colón",           lat: 9.36, lon: -79.90 },
  { id: "cocle",        nombre: "Coclé",           lat: 8.52, lon: -80.36 },
  { id: "herrera",      nombre: "Herrera",         lat: 7.96, lon: -80.43 },
  { id: "los-santos",   nombre: "Los Santos",      lat: 7.93, lon: -80.42 },
  { id: "veraguas",     nombre: "Veraguas",        lat: 8.10, lon: -80.97 },
  { id: "chiriqui",     nombre: "Chiriquí",        lat: 8.43, lon: -82.43 },
  { id: "bocas",        nombre: "Bocas del Toro",  lat: 9.34, lon: -82.24 },
  { id: "darien",       nombre: "Darién",          lat: 8.40, lon: -77.90 }
];

/* Especialidades: precio base de consulta (lista, B/.) y estudios frecuentes */
CP.especialidades = [
  { id: "medicina-general", nombre: "Medicina general",          precio: 40,  estudios: ["hemograma", "orina"] },
  { id: "neurologia",       nombre: "Neurología",                precio: 90,  estudios: ["tac-craneo", "hemograma"] },
  { id: "cardiologia",      nombre: "Cardiología",               precio: 85,  estudios: ["ekg", "ecocardiograma", "perfil-lipidico"] },
  { id: "gastroenterologia",nombre: "Gastroenterología",         precio: 80,  estudios: ["us-abdominal", "hemograma"] },
  { id: "neumologia",       nombre: "Neumología",                precio: 80,  estudios: ["rx-torax", "espirometria"] },
  { id: "dermatologia",     nombre: "Dermatología",              precio: 70,  estudios: [] },
  { id: "ortopedia",        nombre: "Ortopedia y traumatología", precio: 75,  estudios: ["rx-simple"] },
  { id: "ginecologia",      nombre: "Ginecología",               precio: 70,  estudios: ["us-pelvico", "papanicolau"] },
  { id: "pediatria",        nombre: "Pediatría",                 precio: 55,  estudios: ["hemograma"] },
  { id: "otorrino",         nombre: "Otorrinolaringología",      precio: 70,  estudios: ["audiometria"] },
  { id: "oftalmologia",     nombre: "Oftalmología",              precio: 65,  estudios: [] },
  { id: "urologia",         nombre: "Urología",                  precio: 75,  estudios: ["orina", "us-renal"] },
  { id: "endocrinologia",   nombre: "Endocrinología",            precio: 80,  estudios: ["perfil-metabolico", "tiroides"] },
  { id: "salud-mental",     nombre: "Psiquiatría y salud mental",precio: 95,  estudios: [] },
  { id: "urgencias",        nombre: "Urgencias",                 precio: 120, estudios: ["hemograma", "rx-simple"] }
];

CP.estudios = {
  "hemograma":         { nombre: "Hemograma completo",        precio: 12 },
  "orina":             { nombre: "Urinálisis",                precio: 8 },
  "perfil-lipidico":   { nombre: "Perfil lipídico",           precio: 25 },
  "perfil-metabolico": { nombre: "Perfil metabólico",         precio: 35 },
  "tiroides":          { nombre: "Perfil tiroideo (TSH, T4)", precio: 40 },
  "ekg":               { nombre: "Electrocardiograma",        precio: 40 },
  "ecocardiograma":    { nombre: "Ecocardiograma",            precio: 180 },
  "tac-craneo":        { nombre: "TAC de cráneo",             precio: 280 },
  "rx-torax":          { nombre: "Radiografía de tórax",      precio: 45 },
  "rx-simple":         { nombre: "Radiografía simple",        precio: 40 },
  "espirometria":      { nombre: "Espirometría",              precio: 70 },
  "us-abdominal":      { nombre: "Ultrasonido abdominal",     precio: 85 },
  "us-pelvico":        { nombre: "Ultrasonido pélvico",       precio: 80 },
  "us-renal":          { nombre: "Ultrasonido renal",         precio: 80 },
  "papanicolau":       { nombre: "Papanicolaou",              precio: 30 },
  "audiometria":       { nombre: "Audiometría",               precio: 60 }
};

/* Hospitales FICTICIOS con ubicación real.
   factor: multiplicador sobre precio base. logo: especificación del SVG original. */
CP.hospitales = [
  { id: "h01", nombre: "Hospital Istmo Central", tipo: "Hospital", provincia: "panama",
    direccion: "Vía España, Bella Vista, Ciudad de Panamá", lat: 8.985, lon: -79.520,
    telefono: "+507 200-1100", horario: "Consultas 7:00–19:00, urgencias 24 h", factor: 1.35, valoracion: 4.7,
    logo: { forma: "cruz", c1: "#0E3A5B", c2: "#7FD1C7", sigla: "IC" },
    especialidades: ["medicina-general","neurologia","cardiologia","gastroenterologia","neumologia","dermatologia","ortopedia","ginecologia","pediatria","otorrino","oftalmologia","urologia","endocrinologia","salud-mental","urgencias"] },
  { id: "h02", nombre: "Clínica Bahía Costa", tipo: "Clínica", provincia: "panama",
    direccion: "Costa del Este, Juan Díaz, Ciudad de Panamá", lat: 9.010, lon: -79.470,
    telefono: "+507 200-2200", horario: "Lunes a sábado 7:00–20:00", factor: 1.25, valoracion: 4.6,
    logo: { forma: "ola", c1: "#0F7C73", c2: "#E6F4F1", sigla: "BC" },
    especialidades: ["medicina-general","cardiologia","dermatologia","ginecologia","pediatria","oftalmologia","endocrinologia","salud-mental"] },
  { id: "h03", nombre: "Policlínica Cerro Ancón", tipo: "Policlínica", provincia: "panama",
    direccion: "Calle Gorgas, Ancón, Ciudad de Panamá", lat: 8.960, lon: -79.545,
    telefono: "+507 200-3300", horario: "Lunes a viernes 6:30–18:00", factor: 0.95, valoracion: 4.3,
    logo: { forma: "montana", c1: "#2E5E3A", c2: "#F2B705", sigla: "CA" },
    especialidades: ["medicina-general","neurologia","gastroenterologia","neumologia","ortopedia","pediatria","otorrino","urologia"] },
  { id: "h04", nombre: "Hospital Occidente Salud", tipo: "Hospital", provincia: "panama-oeste",
    direccion: "Calle Santa Cruz, La Chorrera, Panamá Oeste", lat: 8.880, lon: -79.783,
    telefono: "+507 200-4400", horario: "Consultas 7:00–19:00, urgencias 24 h", factor: 1.00, valoracion: 4.4,
    logo: { forma: "escudo", c1: "#7A1F3D", c2: "#F7D6DF", sigla: "OS" },
    especialidades: ["medicina-general","neurologia","cardiologia","gastroenterologia","ortopedia","ginecologia","pediatria","urologia","urgencias"] },
  { id: "h05", nombre: "Clínica Arraiján Familiar", tipo: "Clínica", provincia: "panama-oeste",
    direccion: "Vista Alegre, Arraiján, Panamá Oeste", lat: 8.930, lon: -79.660,
    telefono: "+507 200-5500", horario: "Lunes a sábado 7:00–17:00", factor: 0.85, valoracion: 4.1,
    logo: { forma: "hoja", c1: "#3D7A2A", c2: "#E3F1D8", sigla: "AF" },
    especialidades: ["medicina-general","dermatologia","ginecologia","pediatria","endocrinologia"] },
  { id: "h06", nombre: "Clínica Portobelo Atlántico", tipo: "Clínica", provincia: "colon",
    direccion: "Avenida Bolívar, Colón", lat: 9.357, lon: -79.899,
    telefono: "+507 200-6600", horario: "Consultas 7:00–18:00, urgencias 24 h", factor: 0.95, valoracion: 4.2,
    logo: { forma: "ola", c1: "#1F4E8C", c2: "#DCE8F7", sigla: "PA" },
    especialidades: ["medicina-general","cardiologia","neumologia","ortopedia","pediatria","otorrino","urgencias"] },
  { id: "h07", nombre: "Hospital Valle de Coclé", tipo: "Hospital", provincia: "cocle",
    direccion: "Vía Interamericana, Penonomé, Coclé", lat: 8.518, lon: -80.357,
    telefono: "+507 200-7700", horario: "Consultas 7:00–18:00, urgencias 24 h", factor: 0.90, valoracion: 4.2,
    logo: { forma: "montana", c1: "#5B3A8E", c2: "#EAE1F6", sigla: "VC" },
    especialidades: ["medicina-general","neurologia","gastroenterologia","ginecologia","pediatria","oftalmologia","urgencias"] },
  { id: "h08", nombre: "Centro Médico Península de Azuero", tipo: "Centro médico", provincia: "herrera",
    direccion: "Paseo Enrique Geenzier, Chitré, Herrera", lat: 7.961, lon: -80.429,
    telefono: "+507 200-8800", horario: "Lunes a sábado 7:00–19:00", factor: 0.90, valoracion: 4.5,
    logo: { forma: "circulo", c1: "#B34A12", c2: "#FBE5D6", sigla: "PZ" },
    especialidades: ["medicina-general","cardiologia","dermatologia","ortopedia","ginecologia","pediatria","urologia","endocrinologia","urgencias"] },
  { id: "h09", nombre: "Hospital Veraguas Integral", tipo: "Hospital", provincia: "veraguas",
    direccion: "Avenida Central, Santiago de Veraguas", lat: 8.100, lon: -80.983,
    telefono: "+507 200-9900", horario: "Consultas 7:00–18:00, urgencias 24 h", factor: 0.88, valoracion: 4.0,
    logo: { forma: "escudo", c1: "#0F5F6E", c2: "#D8EEF1", sigla: "VI" },
    especialidades: ["medicina-general","neurologia","cardiologia","neumologia","ortopedia","pediatria","urgencias"] },
  { id: "h10", nombre: "Hospital Barú del Oeste", tipo: "Hospital", provincia: "chiriqui",
    direccion: "Avenida Obaldía, David, Chiriquí", lat: 8.427, lon: -82.431,
    telefono: "+507 201-1010", horario: "Consultas 7:00–19:00, urgencias 24 h", factor: 1.05, valoracion: 4.6,
    logo: { forma: "montana", c1: "#1B4332", c2: "#95D5B2", sigla: "BO" },
    especialidades: ["medicina-general","neurologia","cardiologia","gastroenterologia","neumologia","dermatologia","ortopedia","ginecologia","pediatria","otorrino","oftalmologia","urologia","endocrinologia","salud-mental","urgencias"] },
  { id: "h11", nombre: "Clínica Boquete Altura", tipo: "Clínica", provincia: "chiriqui",
    direccion: "Bajo Boquete, Boquete, Chiriquí", lat: 8.780, lon: -82.441,
    telefono: "+507 201-1111", horario: "Lunes a viernes 8:00–17:00", factor: 0.95, valoracion: 4.4,
    logo: { forma: "hoja", c1: "#6B4226", c2: "#F1E3D3", sigla: "BA" },
    especialidades: ["medicina-general","cardiologia","dermatologia","oftalmologia","salud-mental"] },
  { id: "h12", nombre: "Policlínica Isla Colón", tipo: "Policlínica", provincia: "bocas",
    direccion: "Calle 3, Bocas del Toro", lat: 9.340, lon: -82.242,
    telefono: "+507 201-1212", horario: "Lunes a sábado 7:00–16:00", factor: 1.10, valoracion: 3.9,
    logo: { forma: "circulo", c1: "#00708A", c2: "#D2F0F6", sigla: "IC" },
    especialidades: ["medicina-general","pediatria","ginecologia","urgencias"] }
];

/* Aseguradoras y planes FICTICIOS.
   red: { hospitalId: "preferente" | "estandar" } — si no aparece = fuera de red.
   consulta.tipo "copago": monto fijo por nivel; "coaseguro": pasa por deducible y coaseguro. */
CP.descuentoRed = { preferente: 0.25, estandar: 0.15 };

CP.aseguradoras = [
  { id: "istmo", nombre: "Aseguradora Istmo",
    red: { h01: "preferente", h03: "preferente", h04: "estandar", h06: "estandar", h08: "estandar", h10: "preferente", h07: "estandar" },
    planes: [
      { id: "istmo-plus", nombre: "Istmo Plus", deducible: 250, tope: 2000,
        consulta: { tipo: "copago", preferente: 25, estandar: 35 },
        coaseguro: { preferente: 0.10, estandar: 0.20 },
        fueraRed: { cubre: true, reconoce: 0.70, coaseguro: 0.40 } },
      { id: "istmo-esencial", nombre: "Istmo Esencial", deducible: 500, tope: 3000,
        consulta: { tipo: "coaseguro" },
        coaseguro: { preferente: 0.20, estandar: 0.30 },
        fueraRed: { cubre: false } }
    ] },
  { id: "canal", nombre: "Canal Seguros",
    red: { h01: "estandar", h02: "preferente", h04: "preferente", h05: "preferente", h06: "preferente", h09: "estandar", h10: "estandar", h11: "preferente" },
    planes: [
      { id: "canal-familiar", nombre: "Canal Familiar", deducible: 300, tope: 2500,
        consulta: { tipo: "copago", preferente: 30, estandar: 45 },
        coaseguro: { preferente: 0.20, estandar: 0.25 },
        fueraRed: { cubre: true, reconoce: 0.60, coaseguro: 0.50 } },
      { id: "canal-oro", nombre: "Canal Oro", deducible: 100, tope: 1500,
        consulta: { tipo: "copago", preferente: 15, estandar: 20 },
        coaseguro: { preferente: 0.10, estandar: 0.10 },
        fueraRed: { cubre: true, reconoce: 0.80, coaseguro: 0.30 } }
    ] },
  { id: "pacifico", nombre: "Pacífico Salud Seguros",
    red: { h03: "preferente", h04: "preferente", h05: "preferente", h07: "preferente", h08: "preferente", h09: "preferente", h12: "estandar", h01: "estandar" },
    planes: [
      { id: "pacifico-basico", nombre: "Pacífico Básico", deducible: 1000, tope: 5000,
        consulta: { tipo: "coaseguro" },
        coaseguro: { preferente: 0.30, estandar: 0.40 },
        fueraRed: { cubre: false } }
    ] },
  { id: "guayacan", nombre: "Seguros Guayacán",
    red: { h02: "estandar", h03: "preferente", h05: "estandar", h06: "estandar", h07: "preferente", h08: "preferente", h10: "preferente", h11: "estandar", h12: "preferente" },
    planes: [
      { id: "guayacan-joven", nombre: "Guayacán Joven", deducible: 750, tope: 4000,
        consulta: { tipo: "copago", preferente: 40, estandar: 40 },
        coaseguro: { preferente: 0.25, estandar: 0.30 },
        fueraRed: { cubre: true, reconoce: 0.50, coaseguro: 0.50 } }
    ] }
];

/* Pacientes DEMO (cédulas con prefijo provincial: 8 Panamá, 4 Chiriquí, 3 Colón, 6 Herrera, 9 Veraguas) */
CP.pacientesDemo = [
  { cedula: "8-845-1203", nombre: "Ana Lucía Pérez",     poliza: "IST-204518", aseguradora: "istmo",    plan: "istmo-plus",      provincia: "panama",       dedUsado: 120, topeUsado: 310 },
  { cedula: "4-712-908",  nombre: "Carlos Samudio",      poliza: "CAN-771230", aseguradora: "canal",    plan: "canal-familiar",  provincia: "chiriqui",     dedUsado: 0,   topeUsado: 0 },
  { cedula: "8-932-2210", nombre: "María José Castillo", poliza: "PAC-100982", aseguradora: "pacifico", plan: "pacifico-basico", provincia: "panama-oeste", dedUsado: 650, topeUsado: 820 },
  { cedula: "6-705-1441", nombre: "Luis Batista",        poliza: "GUA-330015", aseguradora: "guayacan", plan: "guayacan-joven",  provincia: "herrera",      dedUsado: 750, topeUsado: 1180 },
  { cedula: "3-118-456",  nombre: "Rosa Mendoza",        poliza: "CAN-908114", aseguradora: "canal",    plan: "canal-oro",       provincia: "colon",        dedUsado: 100, topeUsado: 1420 }
];

/* Clasificador: palabras clave (sin tildes) y peso */
CP.sintomas = {
  "neurologia":        [["dolor de cabeza",3],["cefalea",3],["migrana",4],["mareo",2],["vertigo",2],["hormigueo",2],["entumecimiento",2],["temblor",3],["convulsion",3],["memoria",2]],
  "cardiologia":       [["palpitacion",3],["presion alta",3],["hipertension",3],["taquicardia",3],["dolor en el pecho",2],["pecho",1],["arritmia",3],["pies hinchados",2]],
  "gastroenterologia": [["dolor de estomago",3],["estomago",2],["abdomen",2],["abdominal",2],["gastritis",3],["acidez",3],["reflujo",3],["diarrea",2],["estrenimiento",2],["nausea",1],["vomito",1],["colon",2]],
  "neumologia":        [["tos",3],["asma",4],["flema",2],["silbido",2],["falta de aire",2],["respirar",2],["pulmon",3],["bronquitis",3]],
  "dermatologia":      [["piel",3],["mancha",2],["acne",4],["picazon",2],["comezon",2],["sarpullido",3],["lunar",3],["caida del cabello",3],["hongo",2],["unas",1]],
  "ortopedia":         [["rodilla",3],["espalda",2],["columna",2],["hueso",3],["fractura",4],["esguince",4],["tobillo",3],["hombro",3],["articulacion",2],["lumbar",2],["torcedura",3]],
  "ginecologia":       [["menstruacion",3],["regla",2],["periodo",1],["embarazo",4],["flujo vaginal",4],["colicos menstruales",4],["ovario",3],["anticonceptivo",3],["mama",2]],
  "pediatria":         [["mi hijo",3],["mi hija",3],["bebe",4],["nino",2],["nina",2],["vacuna",2]],
  "otorrino":          [["oido",3],["garganta",3],["amigdala",3],["sinusitis",4],["nariz",2],["ronquera",2],["zumbido",3],["congestion",2]],
  "oftalmologia":      [["ojo",3],["vision",3],["vista",2],["ojos rojos",3],["lagrimeo",2],["borroso",2],["lentes",2]],
  "urologia":          [["orinar",3],["orina",2],["rinon",3],["prostata",4],["calculo",2],["ardor al orinar",4]],
  "endocrinologia":    [["diabetes",4],["azucar",3],["glucosa",3],["tiroides",4],["peso",1],["sed excesiva",3],["hormona",2]],
  "salud-mental":      [["ansiedad",4],["depresion",4],["estres",2],["insomnio",2],["no puedo dormir",2],["panico",3],["tristeza",2]],
  "medicina-general":  [["fiebre",2],["gripe",3],["resfriado",3],["cansancio",1],["malestar",2],["chequeo",3],["dolor de cuerpo",2],["dengue",2]]
};

/* Banderas rojas: requieren urgencias / 911 */
CP.alertas = [
  { patron: ["dolor en el pecho", "opresion en el pecho", "dolor de pecho fuerte"], mensaje: "El dolor u opresión en el pecho puede ser una emergencia cardiaca." },
  { patron: ["no puedo respirar", "me ahogo", "dificultad para respirar"], mensaje: "La dificultad para respirar requiere atención inmediata." },
  { patron: ["peor dolor de cabeza", "dolor de cabeza subito", "cara torcida", "no puedo mover", "paralisis", "no puedo hablar"], mensaje: "Estos síntomas pueden indicar un evento neurológico urgente." },
  { patron: ["desmayo", "me desmaye", "perdi el conocimiento", "convulsionando"], mensaje: "La pérdida del conocimiento debe evaluarse en urgencias." },
  { patron: ["sangrado abundante", "vomito con sangre", "heces negras"], mensaje: "Un sangrado abundante requiere atención inmediata." },
  { patron: ["quitarme la vida", "suicid", "hacerme dano", "no quiero vivir"], mensaje: "Lo que sientes importa y hay personas que pueden ayudarte ahora." }
];

CP.ejemplosSintomas = [
  "Tengo dolor de cabeza fuerte desde hace 3 días",
  "Tos con flema y silbido al respirar",
  "Me torcí el tobillo jugando fútbol",
  "Acidez y dolor de estómago después de comer",
  "Manchas rojas en la piel que pican"
];
