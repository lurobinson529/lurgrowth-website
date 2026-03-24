/**
 * Main site functionality: navigation, mobile menu, scroll behavior
 */

(function () {
  document.addEventListener('DOMContentLoaded', function () {

    // Navigation scroll effect
    var nav = document.querySelector('.nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');

    function handleNavScroll() {
      if (window.pageYOffset > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
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

      // Close menu when link is clicked
      var links = navLinks.querySelectorAll('a');
      links.forEach(function (link) {
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
    var navPageLinks = document.querySelectorAll('.nav__link');
    navPageLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
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
