# DataFest · sitio web

Sitio institucional de [datafest.ar](https://www.datafest.ar): la comunidad, sus valores, los temas, los eventos y las formas de participar.

Usa el mismo stack que la landing del primer encuentro: HTML, CSS y JavaScript, sin frameworks ni proceso de build. Cualquier hosting estático lo sirve tal cual.

## Estructura

El sitio está pensado para generar conversaciones con empresas sin vender desde el contenido: los casos enseñan, el autodiagnóstico ayuda a ubicarse y todos los formularios llegan al mismo equipo, que después reparte los contactos.

```
/
├── index.html                    Inicio: casos, frases de "tu desafío", qué es DataFest, informe y newsletter
├── ideas/                        Hub de casos, temas e informe
│   ├── ceagro/                   Una página por caso: problema → datos → decisión → impacto
│   ├── triunfo-seguros/            y al final "¿Tu empresa tiene este problema?"
│   ├── diagnostico-maipu/
│   ├── retail-gondola/
│   ├── ia-agentica/              Charla especial
│   ├── temas/                    Los 6 pilares, con sus casos y temas por industria
│   └── informe/                  Informe 2026 (en preparación) + "anotate para recibirlo"
├── eventos/                      Encuentros: próximo, calendario, qué se presentó, formatos y galería
│   └── septiembre-2026/          ← acá va la landing del 30/09 (hoy hay un archivo provisorio)
├── tu-desafio/                   Autodiagnóstico de 7 preguntas + "Hablá con un especialista"
├── comunidad/                    Sumarse, proponer un caso, sponsors y sedes (media kit)
├── nosotros/                     Propósito, historia, valores, cómo contamos un caso y fichas de organizadores
├── preguntas/                    Preguntas frecuentes y contacto
├── temas/, participa/            Redirigen a ideas/temas/ y comunidad/ (direcciones viejas)
├── 404.html
└── assets/
    ├── css/styles.css            Todos los estilos (tokens de color y tipografía arriba de todo)
    ├── js/eventos.js             Datos editables: eventos, redes y endpoint de formularios
    ├── js/main.js                Comportamiento compartido, formularios y autodiagnóstico
    ├── fonts/                    Soap y Space Grotesk
    └── img/                      Fotos, logos, speakers y formas de la identidad
```

El encabezado y el pie se repiten en cada página. Las páginas se generaron con un script, así que un cambio en el menú hay que replicarlo en todos los `index.html`.

## Formularios: a dónde llegan y qué mandan

Todos los formularios mandan un `POST` en JSON a `formEndpoint` (en `assets/js/eventos.js`). Además de los campos visibles, cada envío incluye:

| campo | qué es |
|---|---|
| `tipo` | qué formulario se completó (tabla de abajo) |
| `prioridad` | `alta`, `media` o `baja`. Si la persona elige "Este trimestre" en ¿Para cuándo lo necesitás?, pasa a `alta` |
| `pagina` | desde qué página se envió (por ejemplo `/ideas/ceagro/`) |
| `empresa_origen` | si la persona llegó con un link `?origen=nombre`, ese nombre (se recuerda durante la visita) |
| `fecha` | fecha y hora del envío |
| `caso`, `tema` | en las páginas de caso: qué caso estaba leyendo |
| `diagnostico` | en Tu desafío: resultado del autodiagnóstico, si lo hizo |

| tipo | dónde está | prioridad |
|---|---|---|
| `especialista` | Tu desafío | alta |
| `consulta-caso` | al final de cada caso | media |
| `informe` | Ideas → Informe | media |
| `sponsor` | Comunidad (media kit) | media |
| `proponer-caso` | Comunidad | media |
| `novedades` | Comunidad | baja |
| `newsletter` | pie de todas las páginas | baja |
| `contacto` | Preguntas | baja |

**Links por empresa:** cada organizadora puede compartir el sitio con su propio link, por ejemplo `https://www.datafest.ar/?origen=witdata`. Así el equipo común sabe quién trajo cada contacto, sin que el sitio muestre nada distinto.

## Verlo en local

En VS Code, con la extensión **Live Server**: clic derecho en `index.html` → *Open with Live Server*. Así funcionan las rutas limpias (`/nosotros/`).

Si abrís los archivos con doble clic, el sitio también funciona: `main.js` ajusta los links para que apunten a `index.html`.

## Sumar o actualizar un evento

Todo se edita en `assets/js/eventos.js`, sin tocar el HTML:

| campo | ejemplo | nota |
|---|---|---|
| estado | `"proximo"` o `"realizado"` | color del talón y sello |
| fecha | `"2026-12-10"` o `"2026-12"` | si no hay día, se muestra el mes |
| titulo, bajada | | texto de la entrada |
| etiqueta | `"Cierre de año"` | texto corto en la línea de tiempo |
| datos | `["Presencial", "CABA"]` | etiquetas de la entrada |
| url | `"eventos/diciembre-2026/"` o `null` | `null` muestra "Avisame" y lleva a Comunidad |
| imagen | `"assets/img/eventos/..."` | foto o forma de la identidad |

El primer evento `"proximo"` aparece destacado en Inicio y en Encuentros. `lineaDeTiempo` define qué meses muestra el calendario.

Cada evento con landing propia vive en su carpeta: `eventos/<nombre>/index.html`.

## Mover la landing actual

1. Copiá el `index.html` y la carpeta `imgs/` que hoy están en la raíz de datafest.ar dentro de `eventos/septiembre-2026/`, reemplazando el archivo provisorio.
2. En esa landing, cambiá el `href` del logo (`brand-mark`) por `../../` para volver al sitio.
3. Opcional: si querés que `datafest.ar/evento1` funcione, configurá una redirección 301 a `/eventos/septiembre-2026/` en el hosting.

## Pendientes antes de publicar

- **Formularios**: completar `formEndpoint` en `eventos.js` con una URL que reciba un POST en JSON (por ejemplo, el webhook de n8n). Mientras esté vacío, los formularios avisan que no se enviaron.
- **LinkedIn**: confirmar la URL (hoy `linkedin.com/company/datafest-ar/`). Aparece en `eventos.js` y en el HTML de cada página.
- **Política de privacidad**: los formularios piden consentimiento; conviene sumar una página y enlazarla desde el pie.
- **Datos a validar**: el 86 % de la encuesta (28 respuestas), la frase sobre networking de la galería, los valores (borrador del documento de identidad) y las fechas de la historia en Nosotros.
- **Logos de CATIF y SAIA**: hoy se muestran como texto. Están en `imgs/` de la landing; copiarlos a `assets/img/logos/`.
- **Cierre de año**: actualizar fecha y sede en `eventos.js` cuando se confirmen.
- **Casos**: los textos salen de la agenda del 30/09. Conviene que cada speaker los revise y, si hay, sumar resultados concretos y el video de la charla.
- **Fotos de Marianela Gaia y Edith Luján**: hoy se muestran sus iniciales. Guardarlas en `assets/img/speakers/`.
- **Informe 2026**: cuando esté listo, reemplazar el formulario de `ideas/informe/` por la descarga (o mandarlo a quienes se anotaron).
- **Fichas de organizadores**: validar la especialidad y el caso que acompañó cada empresa (Nosotros).
