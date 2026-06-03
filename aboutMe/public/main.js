(function () {
  'use strict';

  // ── Language ──────────────────────────────────────────────────────────────
  var currentLang = localStorage.getItem('jcit-lang') || 'pl';

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('jcit-lang', lang);
    document.documentElement.lang = lang === 'pl' ? 'pl' : 'en';

    document.querySelectorAll('[data-pl]').forEach(function (el) {
      var text = el.dataset[lang];
      if (text === undefined) return;
      if (el.dataset.html === 'true') {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    var toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = lang === 'pl' ? 'EN' : 'PL';
  }

  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      applyLang(currentLang === 'pl' ? 'en' : 'pl');
    });
  }

  applyLang(currentLang);

  // ── Nav: scroll shadow ────────────────────────────────────────────────────
  var nav = document.getElementById('nav');

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Nav: mobile burger ────────────────────────────────────────────────────
  var burger = document.getElementById('navBurger');
  var mobileMenu = document.getElementById('navMobile');

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Contact form ──────────────────────────────────────────────────────────
  var form     = document.getElementById('contactForm');
  var feedback = document.getElementById('formFeedback');
  var submitBtn = document.getElementById('contactSubmit');

  var MESSAGES = {
    sending: { pl: 'Wysyłanie…', en: 'Sending…' },
    send:    { pl: 'Wyślij wiadomość', en: 'Send message' },
    success: {
      pl: 'Dziękuję za wiadomość! Odezwę się w ciągu 24 godzin.',
      en: 'Thanks for your message! I\'ll get back to you within 24 hours.',
    },
    error: {
      pl: 'Coś poszło nie tak. Napisz bezpośrednio na j.i.cichosz@gmail.com.',
      en: 'Something went wrong. Write directly to j.i.cichosz@gmail.com.',
    },
  };

  function showFeedback(type) {
    if (!feedback) return;
    feedback.hidden = false;
    feedback.className = 'form-feedback ' + type;
    feedback.textContent = MESSAGES[type][currentLang];
  }

  function resetBtn() {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.textContent = MESSAGES.send[currentLang];
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = (document.getElementById('fname').value    || '').trim();
      var email   = (document.getElementById('femail').value   || '').trim();
      var message = (document.getElementById('fmessage').value || '').trim();

      if (!name || !email || !message) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = MESSAGES.sending[currentLang];
      }
      if (feedback) feedback.hidden = true;

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, email: email, message: message }),
      })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (data.ok) {
            form.reset();
            showFeedback('success');
            resetBtn();
          } else {
            showFeedback('error');
            resetBtn();
          }
        })
        .catch(function () {
          showFeedback('error');
          resetBtn();
        });
    });
  }

  // ── Smooth scroll with sticky-nav offset ─────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = nav ? nav.offsetHeight : 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth',
      });
    });
  });

}());
