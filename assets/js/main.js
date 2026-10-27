/* ==========================================================================
   DataFest · comportamiento compartido
   Cada bloque se activa solo si la página tiene el elemento que necesita.
   La raíz del sitio se lee de <body data-root="../">, para armar rutas.
   ========================================================================== */
(function () {
  var d = document, $ = function (id) { return d.getElementById(id); };
  var CFG = window.DATAFEST || { eventos: [] };
  var ROOT = d.body.getAttribute('data-root') || '';
  var MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function url(p) { return /^(https?:|#|mailto:)/.test(p) ? p : ROOT + p; }

  /* Abierto con doble clic (file://): las carpetas no abren su index.html solas */
  if (location.protocol === 'file:') {
    d.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!/^(https?:|#|mailto:)/.test(h) && /\/(#.*)?$/.test(h)) a.setAttribute('href', h.replace(/\/(#.*)?$/, '/index.html$1'));
    });
  }

  /* ---------- navegación ---------- */
  var nav = $('nav'), burger = $('burger'), drawer = $('drawer');
  if (burger) {
    var setMenu = function (o) { drawer.classList.toggle('open', o); burger.classList.toggle('open', o); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); };
    burger.addEventListener('click', function () { setMenu(!drawer.classList.contains('open')); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  }
  var onScroll = function () { if (nav) nav.classList.toggle('scrolled', scrollY > 8); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- eventos ---------- */
  var evs = (CFG.eventos || []).slice();
  function parts(f) { var p = (f || '').split('-'); return { y: +p[0], m: +p[1], d: p[2] ? +p[2] : null }; }
  function stub(e) { var p = parts(e.fecha); return p.d ? { big: p.d, small: MES[p.m - 1] + ' ' + p.y } : { big: MES[p.m - 1], small: String(p.y) }; }
  var next = evs.filter(function (e) { return e.estado === 'proximo'; }).sort(function (a, b) { return a.fecha > b.fecha ? 1 : -1; })[0];
  var last = evs.filter(function (e) { return e.estado === 'realizado'; }).sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; })[0];
  var PARTICIPA = url('comunidad/#novedades');

  // Inicio: tarjeta "próximo encuentro"
  if ($('next-mini')) {
    if (next) {
      var s = stub(next);
      $('nm-big').textContent = s.big; $('nm-small').textContent = s.small;
      $('nm-title').textContent = next.titulo; $('nm-text').textContent = next.bajada;
      $('next-mini').href = next.url ? url(next.url) : PARTICIPA;
      $('nm-cta').textContent = next.url ? 'Ver e inscribirme' : 'Avisame cuando abra';
    } else {
      $('nm-big').textContent = '+'; $('nm-small').textContent = 'pronto';
      $('nm-title').textContent = 'Se viene el próximo';
      $('nm-text').textContent = 'Estamos armando el próximo encuentro. Sumate y te avisamos primero.';
    }
  }
  // Inicio: último encuentro
  if ($('last-card') && last) {
    $('last-card').href = last.url ? url(last.url) : url('eventos/');
    $('lc-date').textContent = last.titulo;
  }

  // Eventos: destacado
  if ($('feature')) {
    if (!next) { $('feature').hidden = true; }
    else {
      var fs = stub(next);
      $('ft-big').textContent = fs.big; $('ft-small').textContent = fs.small;
      $('ft-title').textContent = next.titulo; $('ft-text').textContent = next.bajada;
      $('ft-img').src = url(next.imagen || 'assets/img/formas/miscelaneas-datafest-02.svg');
      $('ft-chips').innerHTML = (next.datos || []).map(function (x) { return '<span class="chip">' + esc(x) + '</span>'; }).join('');
      var fc = $('ft-cta');
      fc.href = next.url ? url(next.url) : PARTICIPA;
      fc.textContent = next.url ? 'Ver el evento e inscribirme' : 'Avisame cuando abra la inscripción';
    }
  }

  // Eventos: línea de tiempo
  var tl = $('tl');
  if (tl) {
    var L = CFG.lineaDeTiempo || { desde: '2026-09', hasta: '2027-06' };
    var a = parts(L.desde), z = parts(L.hasta), now = new Date(), cols = [];
    for (var y = a.y, m = a.m; cols.length < 36; m++) {
      if (m > 12) { m = 1; y++; }
      if (y > z.y || (y === z.y && m > z.m)) break;
      cols.push({ y: y, m: m });
    }
    tl.innerHTML = cols.map(function (c, i) {
      var here = evs.filter(function (e) { var p = parts(e.fecha); return p.y === c.y && p.m === c.m; });
      var dots = here.map(function (e) { return '<span class="tl-dot ' + esc(e.estado) + '"><b>' + esc(e.etiqueta || e.titulo) + '</b></span>'; }).join('');
      var cls = 'tl-m' + ((i === 0 || c.m === 1) ? ' yr' : '') + (here.length ? ' on' : '');
      var isNow = c.y === now.getFullYear() && c.m === now.getMonth() + 1;
      var mark = isNow ? '<span class="tl-now" style="left:' + Math.round(now.getDate() / 31 * 100) + '%"><span>Hoy</span></span>' : '';
      return '<div role="listitem" class="' + cls + '" data-y="' + c.y + '">' + dots + mark + MES[c.m - 1] + '</div>';
    }).join('');
  }

  // Eventos: entradas con filtro
  var tk = $('tickets');
  function renderTickets(f) {
    var list = evs.filter(function (e) { return f === 'todos' || e.estado === f; }).sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
    var html = list.map(function (e) {
      var s = stub(e), done = e.estado === 'realizado', tag = e.url ? 'a' : 'article', href = e.url ? ' href="' + esc(url(e.url)) + '"' : '';
      var cta = e.url ? '<span class="btn btn-peach btn-sm">Ver el evento →</span>' : '<a class="btn btn-peach btn-sm" href="' + PARTICIPA + '">Avisame →</a>';
      var ctaM = e.url ? '<span class="arrow cta-m">Ver el evento <span aria-hidden="true">→</span></span>' : '<a class="arrow cta-m" href="' + PARTICIPA + '">Avisame cuando abra <span aria-hidden="true">→</span></a>';
      return '<' + tag + ' class="ticket ' + esc(e.estado) + '"' + href + '>' +
        '<div class="t-stub"><b>' + esc(s.big) + '</b><span>' + esc(s.small) + '</span><em>' + (done ? 'Realizado' : 'Próximamente') + '</em></div>' +
        '<span class="notch t" aria-hidden="true"></span><span class="notch b" aria-hidden="true"></span>' +
        '<div class="t-body"><h3>' + esc(e.titulo) + '</h3><p>' + esc(e.bajada) + '</p><div class="t-meta">' +
        (e.datos || []).map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' + ctaM + '</div>' +
        '<div class="t-side"><img src="' + esc(url(e.imagen || 'assets/img/formas/miscelaneas-datafest-02.svg')) + '" alt="" loading="lazy">' + cta + '</div>' +
        (done ? '<span class="stamp" aria-hidden="true">Realizado</span>' : '') + '</' + tag + '>';
    }).join('');
    if (!list.length) html = '<div class="ev-empty">' + (f === 'proximo' ? 'Todavía no hay próximos encuentros confirmados. Sumate a la comunidad y te avisamos.' : 'No hay eventos en esta categoría.') + '</div>';
    tk.innerHTML = html;
  }
  if (tk) {
    renderTickets('todos');
    d.querySelectorAll('.filters button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        d.querySelectorAll('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true'); renderTickets(btn.dataset.f);
      });
    });
  }

  /* ---------- valores (acordeón) ---------- */
  var vals = $('vals');
  if (vals) {
    var wide = matchMedia('(hover:hover) and (min-width:861px)');
    var openVal = function (btn) { vals.querySelectorAll('.val').forEach(function (x) { x.classList.toggle('on', x === btn); x.setAttribute('aria-expanded', x === btn ? 'true' : 'false'); }); };
    vals.addEventListener('click', function (e) { var t = e.target.closest('.val'); if (t) openVal(t); });
    vals.addEventListener('mouseover', function (e) { var t = e.target.closest('.val'); if (t && wide.matches && !t.classList.contains('on')) openVal(t); });
    vals.addEventListener('focusin', function (e) { var t = e.target.closest('.val'); if (t) openVal(t); });
  }

  /* ---------- formatos: un punto por persona ---------- */
  d.querySelectorAll('.dots').forEach(function (el) {
    var n = +el.dataset.n, open = el.classList.contains('open'), h = '';
    for (var i = 0; i < n; i++) h += '<i' + (open ? ' style="opacity:' + (1 - 0.85 * (i / n)).toFixed(2) + '"' : '') + '></i>';
    el.innerHTML = h; el.setAttribute('aria-hidden', 'true');
  });

  /* ---------- formularios ----------
     Todos los formularios mandan un POST en JSON a CFG.formEndpoint, con:
       tipo         data-kind del formulario (newsletter, novedades, informe, consulta-caso,
                    especialista, proponer-caso, sponsor, contacto)
       prioridad    alta | media | baja (ver PRIORIDAD; "Este trimestre" sube a alta)
       pagina       ruta desde donde se envió
       empresa_origen  valor de ?origen= con el que llegó la persona (si vino de un link de una empresa)
       fecha        fecha y hora del envío
     más los campos visibles del formulario. */
  var PRIORIDAD = { especialista: 'alta', 'consulta-caso': 'media', informe: 'media', sponsor: 'media', 'proponer-caso': 'media', novedades: 'baja', newsletter: 'baja', contacto: 'baja' };
  var qs = new URLSearchParams(location.search), ORIGEN = qs.get('origen') || '';
  try { if (ORIGEN) sessionStorage.setItem('df_origen', ORIGEN); else ORIGEN = sessionStorage.getItem('df_origen') || ''; } catch (e) { }

  function validate(f) {
    var ok = true;
    f.querySelectorAll('[required]').forEach(function (el) {
      if (el.closest('[hidden]')) return;
      var bad = el.type === 'checkbox' ? !el.checked : (el.type === 'email' ? !/^\S+@\S+\.\S+$/.test(el.value.trim()) : !el.value.trim());
      var w = el.type === 'checkbox' ? el.closest('.consent') : el.closest('.f'); if (w) w.classList.toggle('err', bad);
      if (bad && ok) { el.focus(); ok = false; }
    });
    return ok;
  }
  function hook(f) {
    var msg = f.querySelector('.form-msg');
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (!validate(f)) return;
      var tipo = f.dataset.kind, data = {};
      [].forEach.call(f.elements, function (el) { if (!el.name || el.closest('[hidden]')) return; data[el.name] = el.type === 'checkbox' ? el.checked : el.value; });
      data.tipo = tipo;
      data.prioridad = data.urgencia === 'Este trimestre' ? 'alta' : (PRIORIDAD[tipo] || 'baja');
      data.pagina = location.pathname;
      data.empresa_origen = ORIGEN;
      data.fecha = new Date().toISOString();
      var show = function (c, t) { msg.hidden = false; msg.className = 'form-msg ' + c; msg.textContent = t; };
      if (!CFG.formEndpoint) { show('warn', 'Este formulario todavía no está conectado, así que tus datos no se enviaron. Mientras tanto, escribinos por Instagram o LinkedIn.'); return; }
      var btn = f.querySelector('[type=submit]'); btn.disabled = true;
      fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) {
          if (!r.ok) throw 0;
          var t = (f.dataset.ok || 'Gracias. Recibimos tus datos.').replace(/\{(\w+)\}/g, function (_, k) { return k === 'nombre' ? String(data.nombre || '').split(' ')[0] : (data[k] || ''); });
          show('ok', t); f.reset();
        })
        .catch(function () { show('warn', 'No pudimos enviar el formulario. Revisá tu conexión y volvé a intentarlo.'); })
        .then(function () { btn.disabled = false; });
    });
    f.addEventListener('input', function (e) { var w = e.target.closest('.f,.consent'); if (w) w.classList.remove('err'); });
  }
  d.querySelectorAll('form[data-kind]').forEach(hook);

  // Comunidad: un formulario, tres formas de participar
  var join = $('joinForm');
  if (join) {
    var ROLES = {
      novedades: ['Sumate a la comunidad', 'Te escribimos con casos nuevos y cuando abra la inscripción del próximo encuentro.', 'Quiero sumarme', 'Contanos más'],
      'proponer-caso': ['Contanos tu caso', 'Problema, datos, decisión e impacto: con un resumen alcanza para empezar.', 'Enviar mi caso', 'Resumen del caso *'],
      sponsor: ['Acompañá a DataFest', 'Te enviamos el media kit y las alternativas disponibles.', 'Pedir el media kit', '¿Qué te gustaría lograr? *']
    };
    var setRole = function (r) {
      if (!ROLES[r]) r = 'novedades';
      d.querySelectorAll('.role').forEach(function (x) { x.setAttribute('aria-checked', x.dataset.role === r ? 'true' : 'false'); });
      var t = ROLES[r]; $('jf-title').textContent = t[0]; $('jf-text').textContent = t[1]; $('jf-btn').textContent = t[2]; $('j10l').textContent = t[3];
      join.dataset.kind = r;
      join.querySelectorAll('[data-for]').forEach(function (f) { f.hidden = f.dataset.for.split(' ').indexOf(r) < 0; f.classList.remove('err'); });
      join.querySelectorAll('[data-req]').forEach(function (el) { el.required = el.dataset.req.split(' ').indexOf(r) >= 0; });
      join.querySelector('.form-msg').hidden = true;
    };
    d.querySelectorAll('.role').forEach(function (x) { x.addEventListener('click', function () { setRole(x.dataset.role); }); });
    d.querySelectorAll('[data-pick]').forEach(function (x) {
      x.addEventListener('click', function (e) { e.preventDefault(); setRole(x.dataset.pick); $('formulario').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
    });
    var fromHash = function () { var h = location.hash.replace('#', ''); if (ROLES[h]) setRole(h); };
    setRole('novedades'); fromHash(); addEventListener('hashchange', fromHash);
  }

  /* ---------- Tu desafío: autodiagnóstico ---------- */
  var PILAR = {
    datos: { n: 'Datos y decisiones', c: 'oliva', caso: 'diagnostico-maipu', t: 'La IA no arregla un modelo de datos roto: lo amplifica', por: 'Antes de cualquier tablero o IA, conviene acordar qué significa cada dato y tenerlo en un solo lugar.' },
    analitica: { n: 'Analítica moderna', c: 'aqua', caso: 'triunfo-seguros', t: 'El camino de 70 millones de registros al celular de cada colaborador', por: 'El salto está en que la información llegue sola a quien decide, sin pedir reportes.' },
    automatizacion: { n: 'Automatización', c: 'durazno', caso: 'ceagro', t: 'No hace falta ser “tecnológico” para controlar tu campo en tiempo real', por: 'Las horas que se van en armar planillas son el primer lugar donde se gana tiempo.' },
    ia: { n: 'IA aplicada', c: 'verde', caso: 'retail-gondola', t: 'De una foto de celular a una decisión en segundos', por: 'Con una base ordenada, la IA puede resolver tareas concretas y medibles.' },
    transformacion: { n: 'Transformación', c: 'ciruela', caso: 'triunfo-seguros', t: 'El camino de 70 millones de registros al celular de cada colaborador', por: 'Las herramientas rinden cuando la gente las adopta y los proyectos se priorizan por impacto.' }
  };
  var QUIZ = [
    { p: 'datos', q: '¿Dónde viven hoy los datos con los que decidís?', o: ['En planillas sueltas: cada área tiene las suyas', 'En un sistema de gestión y algunas planillas', 'Integrados en un solo lugar'] },
    { p: 'datos', q: 'Si dos áreas hablan de “ventas” o “margen”, ¿llegan al mismo número?', o: ['Casi nunca, cada una calcula a su manera', 'A veces, depende de quién arme el reporte', 'Sí, las definiciones están acordadas'] },
    { p: 'analitica', q: '¿Cómo llega la información a quien tiene que decidir?', o: ['Alguien arma un reporte cuando se lo piden', 'Hay tableros, pero los actualiza un equipo', 'Tableros automáticos, también desde el celular'] },
    { p: 'automatizacion', q: '¿Cuánto tiempo se va por semana en tareas manuales repetitivas?', o: ['Mucho: varias horas de varias personas', 'Algo, en procesos puntuales', 'Poco: lo repetitivo ya está automatizado'] },
    { p: 'ia', q: '¿Usan inteligencia artificial en algún proceso?', o: ['Todavía no', 'Hicimos pruebas puntuales', 'Sí, en procesos reales y con impacto medido'] },
    { p: 'transformacion', q: 'Cuando llega una herramienta nueva, ¿la gente la adopta?', o: ['Cuesta mucho, se vuelve al Excel', 'Depende del área', 'Sí, hay acompañamiento y se usa'] },
    { p: 'transformacion', q: '¿Cómo deciden qué proyecto de datos hacer primero?', o: ['Según la urgencia del día', 'Con algunos criterios, no siempre claros', 'Por objetivos de negocio y retorno esperado'] }
  ];
  var NIVEL = [
    [4, 'Primeros pasos', 'Los datos todavía dependen de planillas y de personas. Es el punto de partida de muchas empresas de la comunidad, y ordenar lo básico suele tener impacto rápido.'],
    [9, 'En camino', 'Ya hay una base. El salto está en conectar lo que tienen y lograr que la información llegue sola a quien decide.'],
    [14, 'Avanzado', 'Datos ordenados y en uso. El próximo paso es escalar: IA aplicada, autoservicio y retorno medido en cada proyecto.']
  ];
  var FORMAS = [4, 7, 8, 5, 3, 6, 1];
  var quiz = $('quiz');
  if (quiz) {
    var ans = [], cur = 0;
    var forma = function (n) { return url('assets/img/formas/miscelaneas-datafest-0' + n + '.svg'); };
    var renderQ = function () {
      var it = QUIZ[cur];
      quiz.innerHTML = '<div class="qz">' +
        '<div class="qz-main"><div class="qz-top"><span>Pregunta ' + (cur + 1) + ' de ' + QUIZ.length + '</span><span class="qz-pill">' + esc(PILAR[it.p].n) + '</span></div>' +
        '<div class="qz-bar" aria-hidden="true"><i style="width:' + Math.round(cur / QUIZ.length * 100) + '%"></i></div>' +
        '<h2 class="qz-q" tabindex="-1">' + esc(it.q) + '</h2>' +
        '<div class="qz-opts" role="group" aria-label="Respuestas">' + it.o.map(function (o, i) {
          return '<button type="button" class="qz-opt" data-v="' + i + '"' + (ans[cur] === i ? ' aria-pressed="true"' : '') + '><b>' + 'ABC'[i] + '</b><span>' + esc(o) + '</span></button>';
        }).join('') + '</div>' +
        (cur ? '<button type="button" class="qz-back">← Anterior</button>' : '') + '</div>' +
        '<div class="qz-art" style="--c:var(--' + PILAR[it.p].c + ')" aria-hidden="true"><img src="' + forma(FORMAS[cur]) + '" alt=""></div></div>';
      quiz.querySelectorAll('.qz-opt').forEach(function (b) {
        b.addEventListener('click', function () { ans[cur] = +b.dataset.v; cur++; cur < QUIZ.length ? renderQ() : renderR(); focusTop(); });
      });
      var back = quiz.querySelector('.qz-back'); if (back) back.addEventListener('click', function () { cur--; renderQ(); focusTop(); });
    };
    var focusTop = function () { var h = quiz.querySelector('h2'); if (h) h.focus({ preventScroll: true }); if (quiz.getBoundingClientRect().top < 0) quiz.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
    var renderR = function () {
      var tot = 0, sc = {}, mx = {};
      QUIZ.forEach(function (q, i) { tot += ans[i]; sc[q.p] = (sc[q.p] || 0) + ans[i]; mx[q.p] = (mx[q.p] || 0) + 2; });
      var niv = NIVEL.filter(function (n) { return tot <= n[0]; })[0];
      var keys = Object.keys(PILAR), weak = keys.slice().sort(function (a, b) { return sc[a] / mx[a] - sc[b] / mx[b]; })[0], W = PILAR[weak];
      quiz.innerHTML = '<div class="qz res">' +
        '<div class="qz-main"><small class="qz-k">Tu resultado</small><h2 tabindex="-1">' + niv[1] + '</h2><p class="qz-p">' + niv[2] + '</p>' +
        '<div class="bars">' + keys.map(function (k) {
          var p = Math.round(sc[k] / mx[k] * 100);
          return '<div class="bar' + (k === weak ? ' weak' : '') + '"><span>' + esc(PILAR[k].n) + '</span><div><i style="width:' + Math.max(p, 4) + '%;background:var(--' + PILAR[k].c + ')"></i></div><b>' + p + '%</b></div>';
        }).join('') + '</div>' +
        '<div class="row" style="margin-top:28px"><a class="btn btn-peach" href="#especialista">Hablar con un especialista</a><button type="button" class="btn btn-ghost qz-again">Volver a empezar</button></div></div>' +
        '<div class="qz-rec"><small>Empezá por acá</small><h3>' + esc(W.n) + '</h3><p>' + esc(W.por) + '</p>' +
        '<a class="qz-case" href="' + url('ideas/' + W.caso + '/') + '"><small>Caso que te puede servir</small><b>' + esc(W.t) + '</b><span class="arrow">Leer el caso <span aria-hidden="true">→</span></span></a>' +
        '<a class="arrow" href="' + url('ideas/temas/#' + weak) + '">Ver el tema completo <span aria-hidden="true">→</span></a></div></div>';
      quiz.querySelector('.qz-again').addEventListener('click', function () { ans = []; cur = 0; renderQ(); focusTop(); });
      var fe = $('fEsp');
      if (fe) {
        fe.elements.diagnostico.value = niv[1] + ' (' + tot + '/14) · por mejorar: ' + W.n + ' · ' + keys.map(function (k) { return PILAR[k].n + ' ' + sc[k] + '/' + mx[k]; }).join(', ');
        fe.elements.desafio.value = weak;
      }
    };
    renderQ();
    // ?tema= viene de Inicio, de un caso o de un tema
    var tema = qs.get('tema'), fe2 = $('fEsp');
    if (tema && PILAR[tema] && fe2) {
      fe2.elements.desafio.value = tema;
      var tp = $('temaPick'); tp.hidden = false;
      tp.innerHTML = '<small>Llegaste por</small><b>' + esc(PILAR[tema].n) + '</b><a class="arrow" href="' + url('ideas/' + PILAR[tema].caso + '/') + '">Ver un caso sobre esto <span aria-hidden="true">→</span></a>';
    }
  }

  /* ---------- aparición (solo lo que arranca fuera de pantalla) ---------- */
  function countUp(el) {
    var to = +el.dataset.to, suf = el.dataset.suf || '', t0 = null;
    function fr(ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(fr); }
    requestAnimationFrame(fr);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (!en.isIntersecting) return; en.target.classList.remove('pre'); en.target.querySelectorAll('[data-to]').forEach(countUp); io.unobserve(en.target); });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    d.querySelectorAll('.reveal').forEach(function (el) { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('pre'); io.observe(el); } });
  }
})();
