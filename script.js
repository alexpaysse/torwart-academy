// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

function closeMobile() {
  if (mobileMenu) mobileMenu.classList.remove('open');
}

// ===== CONTACT FORM =====
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('contact-submit-btn');
  const success = document.getElementById('form-success');
  const error = document.getElementById('form-error');

  if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
  if (success) success.style.display = 'none';
  if (error) error.style.display = 'none';

  const data = {
    _subject: '📬 New Contact Message — Torwart Academy',
    Name:     `${form.fname.value.trim()} ${form.lname.value.trim()}`,
    Email:    form.email.value.trim(),
    Phone:    form.phone ? form.phone.value : '',
    Interest: form.interest ? form.interest.value : '',
    Message:  form.message ? form.message.value : '',
  };

  try {
    const res = await fetch('https://formsubmit.co/ajax/towartgkacademy@yahoo.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      if (success) success.style.display = 'block';
      form.reset();
    } else {
      if (error) error.style.display = 'block';
    }
  } catch (err) {
    if (error) error.style.display = 'block';
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
  }
}

// ===== BOOKING SYSTEM =====
let selectedPkg = null;

// Package selection
document.querySelectorAll('.booking-pkg').forEach(pkg => {
  pkg.addEventListener('click', () => {
    document.querySelectorAll('.booking-pkg').forEach(p => p.classList.remove('selected'));
    pkg.classList.add('selected');
    selectedPkg = {
      id: pkg.dataset.pkg,
      price: pkg.dataset.price,
      label: pkg.dataset.label
    };
    const step1next = document.getElementById('step1next');
    if (step1next) step1next.disabled = false;
    // Update hidden form fields
    const formPkg = document.getElementById('form-package');
    const formSubject = document.getElementById('form-subject');
    if (formPkg) formPkg.value = selectedPkg.label;
    if (formSubject) formSubject.value = `🥅 New Booking: ${selectedPkg.label}`;
  });
});

function goToStep(n) {
  document.querySelectorAll('.booking-step').forEach((s, i) => {
    s.style.display = (i + 1 === n) ? '' : 'none';
  });
}

// ===== SUBMIT BOOKING (email + SMS) =====
async function submitBooking() {
  if (!selectedPkg) return;

  const fname  = document.getElementById('b-fname');
  const lname  = document.getElementById('b-lname');
  const email  = document.getElementById('b-email');
  const phone  = document.getElementById('b-phone');
  const date   = document.getElementById('b-date');
  const player = document.getElementById('b-player');
  const age    = document.getElementById('b-age');
  const notes  = document.getElementById('b-notes');

  // Validate required fields
  if (!fname.value.trim() || !lname.value.trim() || !email.value.trim()) {
    alert('Please fill in your first name, last name, and email.');
    return;
  }

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
  }

  const bookingData = {
    _subject: `🥅 New Booking: ${selectedPkg.label}`,
    // SMS text via carrier gateway — replace with Alex's carrier email
    // Verizon: 2188250807@vtext.com | AT&T: 2188250807@txt.att.com | T-Mobile: 2188250807@tmomail.net
    _cc: '2188250807@tmomail.net',
    Package:  selectedPkg.label,
    Name:     `${fname.value.trim()} ${lname.value.trim()}`,
    Email:    email.value.trim(),
    Phone:    phone ? phone.value : '',
    'Preferred Date': date ? date.value : '',
    'Player Name': player ? player.value : '',
    'Age & Experience': age ? age.value : '',
    Notes:    notes ? notes.value : '',
  };

  try {
    // FormSubmit.co — no account needed, just verify email on first submission
    const res = await fetch('https://formsubmit.co/ajax/towartgkacademy@yahoo.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    const success = document.getElementById('booking-success');
    const errorEl = document.getElementById('booking-error');
    if (res.ok) {
      if (success) success.style.display = 'block';
      if (errorEl) errorEl.style.display = 'none';
      // Reset form fields
      [fname, lname, email, phone, date, player, age, notes].forEach(el => { if (el) el.value = ''; });
      document.querySelectorAll('.booking-pkg').forEach(p => p.classList.remove('selected'));
      selectedPkg = null;
    } else {
      if (errorEl) errorEl.style.display = 'block';
    }

  } catch (err) {
    const errorEl = document.getElementById('booking-error');
    if (errorEl) errorEl.style.display = 'block';
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Booking Request →';
    }
  }
}
