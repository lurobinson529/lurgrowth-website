/**
 * GSAP ScrollTrigger animations and Lenis smooth scroll
 * Premium scroll-driven animations for LUR Growth
 */

(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // ============================================
  // WAIT FOR DOM
  // ============================================

  document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // HERO PUZZLE: scroll-driven assembly
    // Pieces start scattered and assemble as user scrolls
    // ============================================

    var puzzleL = document.getElementById('puzzleL');
    var puzzleU = document.getElementById('puzzleU');
    var puzzleR = document.getElementById('puzzleR');
    var puzzleLeaves = document.getElementById('puzzleLeaves');

    if (puzzleL && puzzleU && puzzleR) {
      // Initial scattered state (entrance animation)
      gsap.set(puzzleL, { y: -60, x: 20, rotation: 8, opacity: 0 });
      gsap.set(puzzleU, { y: 40, x: -50, rotation: -6, opacity: 0 });
      gsap.set(puzzleR, { y: 50, x: 50, rotation: 5, opacity: 0 });
      if (puzzleLeaves) gsap.set(puzzleLeaves, { opacity: 0, scale: 0.9 });

      // Entrance: pieces fly in and assemble
      var entranceTL = gsap.timeline({ delay: 0.5 });

      entranceTL
        .to(puzzleL, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 0)
        .to(puzzleU, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 0.15)
        .to(puzzleR, { y: 0, x: 0, rotation: 0, opacity: 1, duration: 1, ease: 'power2.out' }, 0.3)
        .to(puzzleLeaves || {}, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.8);

      // Scroll-driven: pieces separate as user scrolls down hero
      var heroSection = document.getElementById('hero');
      if (heroSection) {
        gsap.to(puzzleL, {
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          },
          y: -80,
          x: 15,
          rotation: 6,
          opacity: 0.6
        });

        gsap.to(puzzleU, {
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          },
          y: 60,
          x: -40,
          rotation: -5,
          opacity: 0.6
        });

        gsap.to(puzzleR, {
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
          },
          y: 70,
          x: 45,
          rotation: 4,
          opacity: 0.6
        });

        if (puzzleLeaves) {
          gsap.to(puzzleLeaves, {
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            },
            opacity: 0,
            scale: 0.85
          });
        }
      }
    }

    // ============================================
    // HEADINGS: fade up + Y translate
    // ============================================

    var headings = document.querySelectorAll('h1, h2, h3, .section__tag, .page-header__title, .page-header__subtitle');

    headings.forEach(function (heading) {
      // Skip hero elements (they have their own entrance animation)
      if (heading.closest('.hero')) return;

      gsap.from(heading, {
        scrollTrigger: {
          trigger: heading,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.1
      });
    });

    // ============================================
    // SERVICE CARDS: stagger reveal from left
    // ============================================

    var serviceCards = document.querySelectorAll('.service-card');

    if (serviceCards.length > 0) {
      // Group cards by their parent grid
      var grids = document.querySelectorAll('.services-grid');

      grids.forEach(function (grid) {
        var cards = grid.querySelectorAll('.service-card');

        gsap.from(cards, {
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          x: -40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power2.out'
        });
      });
    }

    // ============================================
    // TESTIMONIAL CARDS: fade in with scale
    // ============================================

    var testimonialCards = document.querySelectorAll('.testimonial-card');

    if (testimonialCards.length > 0) {
      gsap.from(testimonialCards, {
        scrollTrigger: {
          trigger: testimonialCards[0].parentElement,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out'
      });
    }

    // ============================================
    // PROOF OF IMPACT: text lines reveal one at a time
    // ============================================

    var proofSections = document.querySelectorAll('.proof');

    proofSections.forEach(function (proof) {
      var proofText = proof.querySelector('.proof__text');
      if (!proofText) return;

      // Split text into sentences for line-by-line reveal
      var text = proofText.textContent;
      var sentences = text.split('. ').map(function (s, i, arr) {
        return i < arr.length - 1 ? s + '.' : s;
      });

      proofText.innerHTML = '';
      sentences.forEach(function (sentence) {
        var span = document.createElement('span');
        span.style.display = 'block';
        span.style.marginBottom = '0.3em';
        span.textContent = sentence.trim();
        proofText.appendChild(span);
      });

      var lines = proofText.querySelectorAll('span');

      gsap.from(lines, {
        scrollTrigger: {
          trigger: proof,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      });
    });

    // ============================================
    // CTA SECTIONS: fade up as a block
    // ============================================

    var ctaSections = document.querySelectorAll('.section--navy[style*="text-align: center"]');

    ctaSections.forEach(function (cta) {
      var inner = cta.querySelector('.section__inner');
      if (!inner) return;

      gsap.from(inner.children, {
        scrollTrigger: {
          trigger: cta,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });
    });

    // ============================================
    // FRAMEWORK CARDS: special branded stagger
    // ============================================

    var frameworkCards = document.querySelectorAll('.framework-card, [class*="card-l"], [class*="card-u"], [class*="card-r"]');

    if (frameworkCards.length > 0) {
      gsap.from(frameworkCards, {
        scrollTrigger: {
          trigger: frameworkCards[0].parentElement,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }

    // ============================================
    // ENGAGEMENT ITEMS: stagger in
    // ============================================

    var engagements = document.querySelectorAll('.engagement');

    if (engagements.length > 0) {
      gsap.from(engagements, {
        scrollTrigger: {
          trigger: engagements[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 25,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out'
      });
    }

    // ============================================
    // TOPIC ITEMS: stagger from bottom
    // ============================================

    var topicItems = document.querySelectorAll('.topic-item');

    if (topicItems.length > 0) {
      gsap.from(topicItems, {
        scrollTrigger: {
          trigger: topicItems[0].parentElement,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }

    // ============================================
    // ABOUT GRID: left/right slide in
    // ============================================

    var aboutGrids = document.querySelectorAll('.about-grid');

    aboutGrids.forEach(function (grid) {
      var children = grid.children;
      if (children.length < 2) return;

      gsap.from(children[0], {
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.from(children[1], {
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        x: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power2.out'
      });
    });

    // ============================================
    // BUTTONS: subtle fade up
    // ============================================

    var buttons = document.querySelectorAll('.btn');

    buttons.forEach(function (btn) {
      if (btn.closest('.hero')) return;

      gsap.from(btn, {
        scrollTrigger: {
          trigger: btn,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });

    // ============================================
    // POSITIONING STATEMENT: fade in with letter spacing
    // ============================================

    var positioning = document.querySelector('.positioning__text');

    if (positioning) {
      gsap.from(positioning, {
        scrollTrigger: {
          trigger: positioning,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
      });
    }

    // ============================================
    // ACCENT BAR: grow in from center
    // ============================================

    var accentBar = document.querySelector('.accent-bar');

    if (accentBar) {
      gsap.from(accentBar, {
        scrollTrigger: {
          trigger: accentBar,
          start: 'top 95%',
          toggleActions: 'play none none none'
        },
        scaleX: 0,
        duration: 1.2,
        ease: 'power2.out'
      });
    }

    // ============================================
    // CONTACT FORM: fade in
    // ============================================

    var contactGrid = document.querySelector('.contact-grid');

    if (contactGrid) {
      gsap.from(contactGrid.children, {
        scrollTrigger: {
          trigger: contactGrid,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }

  });
})();
