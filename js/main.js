// Nafa Wellness — small vanilla JS enhancements. No external dependencies.
(function () {
  'use strict';

  // Mobile nav toggle
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close menu when a link is clicked (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form: basic honeypot spam check + mailto fallback.
  // NOTE: this is a placeholder submission method for the prototype phase.
  // A proper inline-success form service (e.g. one set up under the
  // client's own account) can replace this later without changing the markup.
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var honeypot = form.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        return; // silently drop likely spam bots
      }
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim();
      var message = form.message.value.trim();
      var phone = form.phone.value.trim();

      if (!name || !email || !subject || !message) {
        status.textContent = 'Please fill in all required fields.';
        status.className = 'form-status error';
        return;
      }

      var body = 'Name: ' + name + '\nEmail: ' + email + (phone ? '\nPhone: ' + phone : '') + '\n\n' + message;
      var mailto = 'mailto:nafawellness@gmail.com'
        + '?subject=' + encodeURIComponent('[Website] ' + subject)
        + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
      status.textContent = 'Opening your email app to send this message…';
      status.className = 'form-status success';
    });
  }
})();
