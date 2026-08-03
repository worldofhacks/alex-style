/* Fern & Stone — progressive enhancement only.
   Without JS (or with reduced motion) the page is fully readable and navigable. */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Smooth scroll — Lenis 1.3.25 (vendored, MIT). Official drop-in config. */
  if (!reducedMotion && typeof window.Lenis === 'function') {
    new window.Lenis({
      autoRaf: true,
      autoToggle: true,
      anchors: true,
      allowNestedScroll: true
    });
  }

  /* Scroll reveals — gate Animista entrance keyframes behind an
     IntersectionObserver so nothing flashes or hides without JS. */
  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js-anim');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      /* 90ms stagger within each reveal group (per design brief) */
      var group = el.getAttribute('data-reveal-group');
      if (group !== null) {
        var siblings = document.querySelectorAll('[data-reveal-group="' + group + '"]');
        var index = Array.prototype.indexOf.call(siblings, el);
        el.style.setProperty('--reveal-delay', (index * 90) + 'ms');
      }
      observer.observe(el);
    });
  }

  /* Footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
