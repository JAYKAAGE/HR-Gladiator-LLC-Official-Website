/* ============================================
   HR GLADIATOR — Contact / Booking Page Scripts
   Handles: client-side validation + Formspree submission
   ============================================ */

document.getElementById('footer-year').textContent = new Date().getFullYear();

(function () {
  'use strict';

  const form      = document.getElementById('booking-form');
  const successEl = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const submitTxt = submitBtn.querySelector('.submit-text');
  const submitLdr = submitBtn.querySelector('.submit-loading');

  if (!form) return;

  // ---------- Helpers ----------

  function showError(input, message) {
    input.classList.add('invalid');
    const err = input.closest('.form-group').querySelector('.form-error');
    if (err) err.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('invalid');
    const err = input.closest('.form-group').querySelector('.form-error');
    if (err) err.textContent = '';
  }

  // ---------- Inline validation on blur ----------

  function validateField(field) {
    const val = field.value.trim();

    if (field.required && !val) {
      showError(field, 'This field is required.');
      return false;
    }

    if (field.type === 'email' && val) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(val)) {
        showError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    if (field.type === 'tel' && val) {
      const phoneRe = /^[\d\s\-().+]{7,20}$/;
      if (!phoneRe.test(val)) {
        showError(field, 'Please enter a valid phone number.');
        return false;
      }
    }

    clearError(field);
    return true;
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  // ---------- Consent checkbox ----------

  const consent      = document.getElementById('consent');
  const consentError = document.getElementById('consent-error');

  function validateConsent() {
    if (!consent.checked) {
      consentError.textContent = 'You must agree to be contacted before submitting.';
      return false;
    }
    consentError.textContent = '';
    return true;
  }

  consent.addEventListener('change', validateConsent);

  // ---------- Full form validation ----------

  function validateAll() {
    let valid = true;

    form.querySelectorAll('input:not([type="checkbox"]):not([name="_gotcha"]), select, textarea').forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!validateConsent()) valid = false;

    return valid;
  }

  // ---------- Submit ----------

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validateAll()) {
      // Scroll to first error
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitTxt.style.display = 'none';
    submitLdr.style.display = 'inline';

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Show success
        form.style.display = 'none';
        successEl.style.display = 'block';
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const json = await res.json().catch(() => ({}));
        const msg  = (json.errors && json.errors.map(e => e.message).join(', '))
                  || 'Something went wrong. Please try again or email us directly.';
        showToast('⚠️ ' + msg, 6000);

        // Reset button
        submitBtn.disabled = false;
        submitTxt.style.display = 'inline';
        submitLdr.style.display = 'none';
      }
    } catch (err) {
      showToast('⚠️ Network error. Please check your connection or email us directly at hrgladiatorllc@gmail.com.', 7000);
      submitBtn.disabled = false;
      submitTxt.style.display = 'inline';
      submitLdr.style.display = 'none';
    }
  });

  // ---------- Phone masking (light) ----------
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let raw = this.value.replace(/\D/g, '').slice(0, 10);
      if (raw.length >= 6) {
        raw = `(${raw.slice(0,3)}) ${raw.slice(3,6)}-${raw.slice(6)}`;
      } else if (raw.length >= 3) {
        raw = `(${raw.slice(0,3)}) ${raw.slice(3)}`;
      }
      this.value = raw;
    });
  }

})();
