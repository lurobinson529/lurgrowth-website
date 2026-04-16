/**
 * Main site functionality: navigation, mobile menu, scroll behavior
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {

    // Enable scroll animations (progressive enhancement)
    document.documentElement.classList.add('js-animate-enabled');

    // Intersection Observer for reveal animations
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // If this revealed element contains stat counters, animate them
          var counters = entry.target.querySelectorAll('[data-count]');
          if (counters.length) {
            counters.forEach(function (el) {
              startCounter(el);
            });
          }

          revealObserver.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(function (el) {
      revealObserver.observe(el);
    });

    // ---- Stat Counter Animation ----
    function startCounter(el) {
      if (el.getAttribute('data-animated')) return;
      el.setAttribute('data-animated', 'true');
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target) || target <= 0) {
        el.textContent = el.getAttribute('data-count');
        return;
      }
      var current = 0;
      var duration = 1400;
      var steps = duration / 16;
      var increment = target / steps;
      var frame = function () {
        current += increment;
        if (current >= target) {
          el.textContent = target;
        } else {
          el.textContent = Math.floor(current);
          requestAnimationFrame(frame);
        }
      };
      requestAnimationFrame(frame);
    }

    // 3D tilt effect on service cards
    document.querySelectorAll('.service-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var rotateX = (y - rect.height / 2) / (rect.height / 2) * -3;
        var rotateY = (x - rect.width / 2) / (rect.width / 2) * 3;
        card.style.transform = 'translateY(-8px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });

    // Navigation scroll effect
    var nav = document.querySelector('.nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    var scrollTicking = false;
    function handleNavScroll() {
      if (!scrollTicking) {
        requestAnimationFrame(function () {
          if (window.pageYOffset > 60) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // Mobile menu toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // Active page highlighting
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(function (link) {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // ---- Capacity Card Bar Animation ----
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.capacity-card__fill').forEach(function (bar) {
            bar.style.width = bar.getAttribute('data-width') + '%';
          });
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    var capacityCard = document.querySelector('.capacity-card');
    if (capacityCard) barObserver.observe(capacityCard);

    // Accordion is handled by inline onclick="toggleAccordion(this)" in the HTML

    // ---- THRIVE Cards: staggered pulse start on scroll ----
    var thriveObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('thrive-animate');
          thriveObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    var thriveVisual = document.getElementById('thriveVisual');
    if (thriveVisual) thriveObserver.observe(thriveVisual);

    // Form submission handler
    var forms = document.querySelectorAll('form[data-netlify]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var formData = new FormData(form);
        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        }).then(function () {
          form.innerHTML = '<div style="text-align: center; padding: 2rem;"><h3 style="font-family: var(--font-heading); color: var(--navy); margin-bottom: 0.5rem;">Thank you.</h3><p style="color: var(--warm-gray);">We will be in touch within two business days.</p></div>';
        }).catch(function () {
          form.innerHTML = '<div style="text-align: center; padding: 2rem;"><p style="color: var(--warm-gray);">Something went wrong. Please email us directly.</p></div>';
        });
      });
    });

  });
})();
