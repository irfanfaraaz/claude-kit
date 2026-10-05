/*!
 * Scrollkit — dependency-free scroll-driven motion.
 * Part of the Cinescroll skill. ~7KB unminified, no build step, no license friction.
 *
 * Every binding is driven by scroll *position*, so everything scrubs backwards correctly.
 * All reads/writes are batched into one rAF loop.
 * prefers-reduced-motion: reduce collapses every binding to its final state.
 *
 * API
 * ---
 * Scrollkit.frameSequence({ el, manifest, scrub, pin, preload, fallbackBelow })
 * Scrollkit.counter({ el, from, to, scrub, format, range })
 * Scrollkit.drawPath({ el, scrub, range })
 * Scrollkit.bloom({ els, scrub, stagger, range })
 * Scrollkit.pinTrack({ pin, track, gutter })
 * Scrollkit.stages({ pin, stages, scrub })
 * Scrollkit.typewrite({ el, scrub, range })
 * Scrollkit.rail({ el, items, onUpdate })
 * Scrollkit.progress(el)            -> 0..1 for any element
 * Scrollkit.refresh()               -> recompute after layout changes
 *
 * `scrub` accepts a selector or element: the element whose scroll progress drives the binding.
 * `range` is [start, end] within that progress, default [0, 1].
 */
(function (global) {
  'use strict';

  var reduced = global.matchMedia &&
    global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bindings = [];
  var ticking = false;
  var vh = global.innerHeight;

  function $(sel) {
    return typeof sel === 'string' ? document.querySelector(sel) : sel;
  }
  function $$(sel) {
    return typeof sel === 'string'
      ? Array.prototype.slice.call(document.querySelectorAll(sel))
      : sel;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function remap(p, r) {
    if (!r) return p;
    return clamp((p - r[0]) / (r[1] - r[0]), 0, 1);
  }

  /**
   * Progress of an element through the viewport.
   * 0 when its top hits the viewport top; 1 when its bottom hits the viewport bottom.
   * For a tall (300vh) section this gives a long, usable scrub range.
   */
  function progress(el) {
    el = $(el);
    if (!el) return 0;
    var r = el.getBoundingClientRect();
    var travel = r.height - vh;
    if (travel <= 0) {
      // Short section: use entry-through-exit instead.
      return clamp((vh - r.top) / (vh + r.height), 0, 1);
    }
    return clamp(-r.top / travel, 0, 1);
  }

  function register(fn, finalFn) {
    if (reduced) { if (finalFn) finalFn(); return; }
    bindings.push(fn);
    fn();
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    global.requestAnimationFrame(function () {
      for (var i = 0; i < bindings.length; i++) bindings[i]();
      ticking = false;
    });
  }

  global.addEventListener('scroll', onScroll, { passive: true });
  global.addEventListener('resize', function () {
    vh = global.innerHeight;
    onScroll();
  }, { passive: true });

  // ---------------------------------------------------------------- frames

  function frameSequence(opts) {
    var canvas = $(opts.el);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var driver = opts.scrub ? $(opts.scrub) : canvas.parentElement;
    var minWidth = opts.fallbackBelow || 0;

    if (global.innerWidth < minWidth) {
      if (opts.poster) canvas.style.background = 'url(' + opts.poster + ') center/cover';
      return;
    }

    fetch(opts.manifest)
      .then(function (r) { return r.json(); })
      .then(function (m) {
        var imgs = new Array(m.frames.length);
        var loaded = 0;
        var current = -1;

        canvas.width = m.width;
        canvas.height = m.height;

        function draw(i) {
          if (i === current) return;
          var img = imgs[i];
          if (!img || !img.complete) return;
          current = i;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        m.frames.forEach(function (src, i) {
          var img = new Image();
          img.decoding = 'async';
          img.onload = function () {
            loaded++;
            if (i === 0) draw(0);
            if (opts.onProgress) opts.onProgress(loaded / m.frames.length);
            if (loaded === m.frames.length && opts.onReady) opts.onReady();
          };
          img.src = src;
          imgs[i] = img;
        });

        register(function () {
          var p = remap(progress(driver), opts.range);
          draw(Math.min(m.frames.length - 1, Math.round(p * (m.frames.length - 1))));
        }, function () {
          // reduced motion: hold on a representative frame
          var i = Math.floor(m.frames.length * 0.5);
          if (imgs[i]) { imgs[i].onload = function () { draw(i); }; draw(i); }
        });
      })
      .catch(function (e) { console.warn('[scrollkit] manifest failed', e); });
  }

  // --------------------------------------------------------------- counter

  var FORMATS = {
    comma: function (n) { return Math.round(n).toLocaleString(); },
    plain: function (n) { return String(Math.round(n)); },
    compact: function (n) {
      return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M'
        : n >= 1e3 ? (n / 1e3).toFixed(1) + 'k'
        : String(Math.round(n));
    }
  };

  function counter(opts) {
    var el = $(opts.el);
    if (!el) return;
    var driver = $(opts.scrub) || el;
    var fmt = FORMATS[opts.format] || FORMATS.comma;
    var from = opts.from || 0;
    var to = opts.to;

    register(function () {
      var p = remap(progress(driver), opts.range);
      el.textContent = fmt(from + (to - from) * p);
    }, function () { el.textContent = fmt(to); });
  }

  // -------------------------------------------------------------- drawPath

  function drawPath(opts) {
    var paths = $$(opts.el);
    if (!paths.length) return;
    var driver = $(opts.scrub) || paths[0].ownerSVGElement;

    paths.forEach(function (path) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });

    register(function () {
      var p = remap(progress(driver), opts.range);
      paths.forEach(function (path) {
        var len = path.getTotalLength();
        path.style.strokeDashoffset = len * (1 - p);
      });
    }, function () {
      paths.forEach(function (path) { path.style.strokeDashoffset = 0; });
    });
  }

  // ----------------------------------------------------------------- bloom

  function bloom(opts) {
    var els = $$(opts.els);
    if (!els.length) return;
    var driver = $(opts.scrub);
    var stagger = opts.stagger == null ? 0.5 : opts.stagger;

    els.forEach(function (el) {
      el.style.transformOrigin = 'center';
      el.style.transformBox = 'fill-box';
    });

    register(function () {
      var p = remap(progress(driver), opts.range);
      var n = els.length;
      els.forEach(function (el, i) {
        var start = (i / n) * stagger;
        var local = clamp((p - start) / (1 - stagger || 1), 0, 1);
        el.style.opacity = local;
        el.style.transform = 'scale(' + (0.2 + local * 0.8) + ')';
      });
    }, function () {
      els.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'scale(1)'; });
    });
  }

  // -------------------------------------------------------------- pinTrack

  function pinTrack(opts) {
    var section = $(opts.pin);
    var track = $(opts.track);
    if (!section || !track) return;

    // Mobile: native swipe instead of a pin.
    if (global.innerWidth < (opts.mobileBelow || 768)) {
      track.style.overflowX = 'auto';
      track.style.scrollSnapType = 'x mandatory';
      Array.prototype.forEach.call(track.children, function (c) {
        c.style.scrollSnapAlign = 'center';
      });
      return;
    }

    var inner = track.firstElementChild || track;

    function sizeSection() {
      var distance = Math.max(0, track.scrollWidth - global.innerWidth + (opts.gutter || 0));
      section.style.height = (global.innerHeight + distance) + 'px';
      return distance;
    }

    var distance = sizeSection();
    track.style.position = 'sticky';
    track.style.top = '0';
    track.style.willChange = 'transform';

    register(function () {
      var p = progress(section);
      inner.style.transform = 'translate3d(' + (-distance * p) + 'px,0,0)';
      if (opts.onProgress) opts.onProgress(p);
    }, function () {
      section.style.height = 'auto';
      track.style.position = 'static';
      track.style.overflowX = 'auto';
    });

    global.addEventListener('resize', function () { distance = sizeSection(); }, { passive: true });
  }

  // ---------------------------------------------------------------- stages

  function stages(opts) {
    var section = $(opts.pin);
    var els = $$(opts.stages);
    if (!section || !els.length) return;

    els.forEach(function (el) {
      el.style.transition = 'opacity .35s ease';
      el.style.willChange = 'opacity';
    });

    register(function () {
      var p = progress(section);
      var idx = Math.min(els.length - 1, Math.floor(p * els.length));
      els.forEach(function (el, i) {
        el.style.opacity = i === idx ? 1 : 0;
        el.style.pointerEvents = i === idx ? 'auto' : 'none';
      });
    }, function () {
      els.forEach(function (el) { el.style.opacity = 1; el.style.position = 'static'; });
    });
  }

  // ------------------------------------------------------------- typewrite

  function typewrite(opts) {
    var el = $(opts.el);
    if (!el) return;
    var driver = $(opts.scrub) || el;
    var text = el.dataset.text || el.textContent;
    el.dataset.text = text;

    register(function () {
      var p = remap(progress(driver), opts.range);
      el.textContent = text.slice(0, Math.round(text.length * p));
    }, function () { el.textContent = text; });
  }

  // ------------------------------------------------------------------ rail

  function rail(opts) {
    var items = $$(opts.items);
    if (!items.length) return;
    var seen = new Set();

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) seen.add(e.target);
      });
      if (opts.onUpdate) opts.onUpdate(seen.size, items.length);
    }, { rootMargin: '0px 0px -35% 0px' });

    items.forEach(function (i) { io.observe(i); });
    if (opts.onUpdate) opts.onUpdate(0, items.length);
  }

  // --------------------------------------------------------------- exports

  global.Scrollkit = {
    frameSequence: frameSequence,
    counter: counter,
    drawPath: drawPath,
    bloom: bloom,
    pinTrack: pinTrack,
    stages: stages,
    typewrite: typewrite,
    rail: rail,
    progress: progress,
    refresh: onScroll,
    reducedMotion: reduced
  };
})(window);
