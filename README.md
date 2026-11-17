# DataFest · sitio web

Sitio institucional de [datafest.ar](https://www.datafest.ar): la comunidad, sus valores, los temas, los eventos y las formas de participar.

Usa el mismo stack que la landing del primer encuentro: HTML, CSS y JavaScript, sin frameworks ni proceso de build. Cualquier hosting estático lo sirve tal cual.

## Estructura

El sitio cuenta qué es DataFest, muestra sus eventos y casos, y abre tres puertas al negocio: hablar con un especialista, contar un caso y ser sponsor. Todos los formularios llegan al mismo equipo, que después reparte los contactos.

**Menú:** Eventos (desplegable) · Qué es DataFest · Casos · Organizadores · Sponsors + botón Participá.

```
/
├── index.html                       Inicio: próximo evento, qué es, casos, organizadores, participar y sponsors
├── eventos/                         Todos los eventos: próximo, calendario, qué se presentó el 30/09 y fotos
│   ├── webinar-diciembre-2026/      Landing del webinar del 3/12 (la que hoy está en la raíz de datafest.ar)
│   └── septiembre-2026/             Landing del primer encuentro del 30/09
├── que-es/                          La idea, para quién es, cómo es un evento, temas, valores e historia
├── casos/                           Casos del 30/09 y adelanto de los casos del webinar
│   └── ceagro/, aseguradora/, diagnostico-maipu/, retail-gondola/, ia-agentica/
├── organizadores/                   Las cuatro empresas y "Hablá con un especialista"
├── sponsors/                        Audiencia, formas de participar por evento y pedido de propuesta
├── participa/                       Venir a un evento, contar un caso o ser sponsor
├── preguntas/                       Preguntas frecuentes y contacto
├── 404.html
└── assets/
    ├── css/styles.css               Todos los estilos (tokens de color y tipografía arriba de todo)
    ├── js/eventos.js                Datos editables: eventos (arman el menú Eventos), redes y endpoint
    ├── js/main.js                   Comportamiento compartido y formularios
    ├── fonts/                       Soap y Space Grotesk
    └── img/                         Fotos, logos, speakers y formas de la identidad
```

El menú **Eventos** se arma solo desde `eventos.js`: primero los próximos, después los realizados. Para sumar un evento al menú, agregalo a esa lista (ver abajo).

Las landings de cada evento son archivos independientes: se editan a mano, como hasta ahora. El logo de cada landing lleva al inicio del sitio.

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
| `evento` | en Sponsors: para qué evento pide la propuesta |

| tipo | dónde está | prioridad |
|---|---|---|
| `especialista` | Organizadores | alta |
| `consulta-caso` | al final de cada caso | media |
| `sponsor` | Sponsors (incluye el evento elegido) | media |
| `proponer-caso` | Participá | media |
| `novedades` | Participá | baja |
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
| url | `"eventos/diciembre-2026/"` o `null` | `null` muestra "Avisame" y lleva a Participá |
| imagen | `"assets/img/eventos/..."` | foto o forma de la identidad |

El primer evento `"proximo"` aparece destacado en Inicio y en Eventos, y todos aparecen en el menú Eventos. `lineaDeTiempo` define qué meses muestra el calendario.

Cada evento con landing propia vive en su carpeta: `eventos/<nombre>/index.html`.

## Publicar el sitio en lugar de la landing

1. Las dos landings ya están dentro de `eventos/`. Si cambiaste algo en la del webinar después del 2/11, reemplazá `eventos/webinar-diciembre-2026/index.html` por tu versión y cambiá el `href` del logo (`brand-mark`) por `../../`.
2. La foto del speaker del webinar va en `assets/img/speakers/juanpablo.jpg` (mientras no esté, se ven sus iniciales).
3. Opcional: redirección 301 de `/septiembre-2026/` a `/eventos/septiembre-2026/` en el hosting, por si alguien tiene el link viejo.

## Pendientes antes de publicar

- **Formularios**: completar `formEndpoint` en `eventos.js` con una URL que reciba un POST en JSON (por ejemplo, el webhook de n8n). Mientras esté vacío, los formularios avisan que no se enviaron.
- **LinkedIn**: confirmar la URL (hoy `linkedin.com/company/datafest-ar/`).
- **Política de privacidad**: los formularios piden consentimiento; conviene sumar una página y enlazarla desde el pie.
- **Casos**: los textos salen de la agenda publicada del 30/09. Confirmar con cada speaker, sobre todo el apellido de Facundo (Liñeiras o Liñeira) y si se puede nombrar a la aseguradora.
- **Fichas de organizadores**: validar la especialidad y el caso de cada empresa.
- **Sponsors**: validar con los organizadores las tres formas de participar (Presentado por, sponsor del encuentro, sede).
- **Historia**: confirmar las fechas de febrero y julio de 2026 en Qué es DataFest.
- **Logos de CATIF y SAIA**: hoy se muestran como texto; copiarlos a `assets/img/logos/`.
