/* ── MODAL ── */
function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
function closeOnBg(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* ── GRADE SELECTION (modal) ── */
function selectGrade(btn, grade) {
  document.querySelectorAll('#modalOverlay .grade-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('m-grade').value = grade;
}

/* ── GRADE SELECTION (inline form) ── */
function selectGradeInline(btn, grade) {
  const section = btn.closest('.form-group');
  section.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('q-grade-s').value = grade;
}

/* ── CONFIG ── */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvNhc7lS-eHqCfeMVpbAO2vPav7m4sGMorckPpjmTb15H3XbRg9BqlcKPu0uAYAA4zWQ/exec";

/* ── SUBMIT INLINE FORM ── */
function submitInlineForm() {
  const parent = document.getElementById('q-parent').value.trim();
  const child  = document.getElementById('q-child').value.trim();
  const phone  = document.getElementById('q-phone').value.trim();
  const branch = document.getElementById('q-branch-s').value;
  const grade  = document.getElementById('q-grade-s').value;

  if (!parent || !child || !phone || !branch || !grade) {
    alert('Please fill in all required fields and select a grade.');
    return;
  }
  // Honeypot check — if filled, it's a bot
  if (document.getElementById('hp-field').value !== '') return;
  // Send to Google Apps Script (saves to Sheet + sends email to principal)
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parent, child, phone, branch, grade })
  });

  // Show thank you message, hide form
  document.querySelector('.admissions-grid > div:last-child').style.display = 'none';
  document.getElementById('thankyou-msg').style.display = 'block';

  // Reset after 6 seconds
  setTimeout(() => {
    document.querySelector('.admissions-grid > div:last-child').style.display = 'block';
    document.getElementById('thankyou-msg').style.display = 'none';
    document.getElementById('q-parent').value = '';
    document.getElementById('q-child').value = '';
    document.getElementById('q-phone').value = '';
    document.getElementById('q-branch-s').value = '';
    document.getElementById('q-grade-s').value = '';
    document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('selected'));
  }, 6000);
}

/* \u2500\u2500 ESC key to close modal \u2500\u2500 */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* \u2500\u2500 HAMBURGER NAV TOGGLE \u2500\u2500 */
function toggleNav() {
  document.querySelector('nav').classList.toggle('nav-open');
}
// Close nav when a nav link is clicked (smooth UX on mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('nav').classList.remove('nav-open');
  });

  /* ── GALLERY SLIDER ── */
(function () {
  const track = document.getElementById('galleryTrack');
  const dots  = document.querySelectorAll('#galleryDots .dot');
  const total = 5;
  let current = 0;
  let timer;

  function goToSlide(index) {
    current = index;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() {
    let nextIndex = current + 1;
    if (nextIndex >= total) {
      track.style.transition = 'transform 0.6s cubic-bezier(.77,0,.18,1)';
      track.style.transform = 'translateX(-' + (nextIndex * 100) + '%)';
      setTimeout(() => {
        track.style.transition = 'none';
        current = 0;
        track.style.transform = 'translateX(0%)';
        dots.forEach((d, i) => d.classList.toggle('active', i === 0));
      }, 650);
      dots.forEach(d => d.classList.remove('active'));
      dots[0].classList.add('active');
      return;
    }
    goToSlide(nextIndex);
  }

  function startTimer() { timer = setInterval(next, 1500); }
  function stopTimer()  { clearInterval(timer); }

  window.goToSlide = function(index) {
    stopTimer();
    goToSlide(index);
    startTimer();
  };

  track.parentElement.addEventListener('mouseenter', stopTimer);
  track.parentElement.addEventListener('mouseleave', startTimer);

  startTimer();
})();
});