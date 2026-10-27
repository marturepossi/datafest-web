# DataFest · sitio web

Sitio institucional de [datafest.ar](https://www.datafest.ar): la comunidad, sus valores, los temas, los eventos y las formas de participar.

Usa el mismo stack que la landing del primer encuentro: HTML, CSS y JavaScript, sin frameworks ni proceso de build. Cualquier hosting estático lo sirve tal cual.

## Estructura

```
/
├── index.html                  Inicio
├── nosotros/index.html         Qué es, historia, valores, cómo contamos un caso, para quién, organizadores
├── eventos/index.html          Próximo encuentro, calendario, formatos y galería
│   └── septiembre-2026/        ← acá va la landing del 30/09 (hoy hay un archivo provisorio)
├── temas/index.html            Los 6 pilares con preguntas y casos, y temas por industria
├── participa/index.html        Asistir, contar un caso, sponsor o sede, y formulario
├── preguntas/index.html        Preguntas frecuentes y contacto
├── 404.html
└── assets/
    ├── css/styles.css          Todos los estilos (tokens de color y tipografía arriba de todo)
    ├── js/eventos.js           Datos editables: eventos, redes y endpoint de formularios
    ├── js/main.js              Comportamiento compartido
    ├── fonts/                  Soap y Space Grotesk
    └── img/                    Fotos, logos y formas de la identidad
```

El encabezado y el pie se repiten en cada página. Si cambiás un link del menú, actualizalo en los seis `index.html` y en `404.html`.

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
| url | `"eventos/diciembre-2026/"` o `null` | `null` muestra "Avisame" y lleva a Participá |
| imagen | `"assets/img/eventos/..."` | foto o forma de la identidad |

El primer evento `"proximo"` aparece destacado en Inicio y en Eventos. `lineaDeTiempo` define qué meses muestra el calendario.

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
