(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  /* nav */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });

  /* active link on scroll */
  var secs = ['about', 'experience', 'projects', 'skills', 'contact'].map(function (id) { return document.getElementById(id); });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.querySelectorAll('a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { if (s) so.observe(s); });
  }

  /* typed roles */
  var roles = ['AI/ML Python Developer', 'Voice AI Engineer', 'RAG & LLM Builder', 'Agentic Systems Developer'];
  var el = document.getElementById('typed');
  if (reduce) { el.textContent = roles[0]; }
  else {
    var ri = 0, ci = 0, del = false;
    (function tick() {
      var word = roles[ri];
      el.textContent = word.slice(0, ci);
      var wait = del ? 35 : 80;
      if (!del && ci === word.length) { del = true; wait = 1500; }
      else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 350; }
      else { ci += del ? -1 : 1; }
      setTimeout(tick, wait);
    })();
  }

  /* reveal + count up */
  function countUp(node) {
    var to = +node.dataset.to;
    if (reduce) { node.textContent = to; return; }
    var start = null, dur = 1400;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      node.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        en.target.querySelectorAll('.count').forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    items.forEach(function (n, i) { n.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(n); });
  } else {
    items.forEach(function (n) { n.classList.add('in'); n.querySelectorAll('.count').forEach(countUp); });
  }

  /* card spotlight */
  document.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* neural network background */
  var cv = document.getElementById('neural');
  if (!cv || reduce) { if (cv) cv.style.display = 'none'; return; }
  var ctx = cv.getContext('2d'), W, H, pts = [], mouse = { x: -999, y: -999 };
  function size() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.width = innerWidth * d; H = cv.height = innerHeight * d;
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
    ctx.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.min(Math.floor(innerWidth * innerHeight / 18000), 90);
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
  }
  size(); addEventListener('resize', size);
  addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  (function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
      ctx.fillStyle = 'rgba(255,179,64,.8)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.283); ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
        if (d < 14000) {
          ctx.strokeStyle = 'rgba(255,140,60,' + (0.22 * (1 - d / 14000)) + ')';
          ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      var mx = p.x - mouse.x, my = p.y - mouse.y, md = mx * mx + my * my;
      if (md < 20000) {
        ctx.strokeStyle = 'rgba(255,179,64,' + (0.4 * (1 - md / 20000)) + ')';
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
})();
