/* ==========================================================================
   DataFest · datos del sitio
   Este es el único archivo que hay que tocar para sumar o actualizar eventos.

   Cada evento:
     estado    "proximo" | "realizado"
     fecha     "AAAA-MM-DD" o, si todavía no hay día, "AAAA-MM"
     titulo    nombre del encuentro
     etiqueta  texto corto para la línea de tiempo
     bajada    una o dos oraciones
     datos     etiquetas que se muestran en la entrada (formato, lugar, horario)
     url       ruta de la landing del evento, relativa a la raíz del sitio,
               o null si todavía no existe
     imagen    foto o forma, relativa a la raíz del sitio

   El primer evento "proximo" (por fecha) aparece destacado en Inicio y en Eventos.
   ========================================================================== */
window.DATAFEST = {
  /* URL que recibe los formularios por POST en JSON (por ejemplo, un webhook de n8n).
     Mientras esté vacía, los formularios avisan que no se enviaron. */
  formEndpoint: "",

  redes: {
    instagram: "https://www.instagram.com/datafest.ar/",
    linkedin: "https://www.linkedin.com/company/datafest-ar/" /* confirmar */
  },

  /* meses que muestra la línea de tiempo de la página Eventos */
  lineaDeTiempo: { desde: "2026-09", hasta: "2027-06" },

  eventos: [
    {
      estado: "proximo",
      fecha: "2026-12",
      titulo: "Cierre de año 2026",
      etiqueta: "Cierre de año",
      bajada: "Un encuentro chico, con mucho networking, para cerrar el año con la comunidad. Fecha y sede a confirmar.",
      datos: ["Presencial", "Cupos reducidos", "CABA"],
      url: null,
      imagen: "assets/img/formas/miscelaneas-datafest-02.svg"
    },
    {
      estado: "realizado",
      fecha: "2026-09-30",
      titulo: "DataFest 2026 · Primer encuentro",
      etiqueta: "1er encuentro",
      bajada: "Una mañana de casos reales sobre agro, seguros, salud y retail, con networking y una charla especial sobre IA agéntica.",
      datos: ["Presencial", "25 de Mayo 471, CABA", "9:00 a 15:00 h"],
      url: "eventos/septiembre-2026/",
      imagen: "assets/img/eventos/encuentro-01.jpg"
    }
  ]
};
