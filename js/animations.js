/**
 * Scroll-driven reveal animations and 3D section transitions
 */

(function () {
  // Intersection Observer for reveal animations
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all reveal elements
  function initRevealAnimations() {
    var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger');
    elements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Hero entrance animation
  function animateHero() {
    var tag = document.querySelector('.hero__tag');
    var title = document.querySelector('.hero__title');
    var desc = document.querySelector('.hero__description');
    var actions = document.querySelector('.hero__actions');

    if (!tag) return;

    var delay = 300;
    var elements = [tag, title, desc, actions];

    elements.forEach(function (el, i) {
      setTimeout(function () {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay + i * 200);
    });
  }

  // Parallax depth on scroll for sections
  function initParallaxSections() {
    var sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', function () {
      var scrollTop = window.pageYOffset;

      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        var sectionTop = rect.top + scrollTop;
        var offset = (scrollTop - sectionTop + window.innerHeight) / (window.innerHeight + rect.height);

        if (offset > 0 && offset < 1) {
          // Subtle parallax on background
          var translateY = (offset - 0.5) * 20;
          section.style.backgroundPositionY = translateY + 'px';
        }
      });
    }, { passive: true });
  }

  // 3D tilt effect on service cards
  function initCardTilt() {
    var cards = document.querySelectorAll('.service-card');

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = (y - centerY) / centerY * -3;
        var rotateY = (x - centerX) / centerX * 3;

        card.style.transform = 'translateY(-8px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  // Smooth counter animation for any numbers
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length === 0) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = parseInt(entry.target.getAttribute('data-count'));
          var current = 0;
          var increment = target / 60;
          var timer = setInterval(function () {
            current += increment;
            if (current >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
            } else {
              entry.target.textContent = Math.floor(current);
            }
          }, 16);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  // Initialize all animations on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initRevealAnimations();
    animateHero();
    initParallaxSections();
    initCardTilt();
    initCounters();
  });
})();
