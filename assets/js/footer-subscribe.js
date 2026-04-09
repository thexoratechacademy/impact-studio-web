// Footer subscribe — works via event delegation so it runs
// even after the footer is dynamically injected into the page.

const SUBSCRIBE_API = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api/subscribe'
  : 'https://impact-studio-web.onrender.com/api/subscribe';

document.addEventListener('submit', async function (e) {
  if (!e.target || e.target.id !== 'subscribe-form') return;
  e.preventDefault();

  const form  = e.target;
  const input = document.getElementById('subscribe-email');
  const btn   = document.getElementById('subscribe-btn');
  const msg   = document.getElementById('subscribe-msg');

  // Honeypot check
  const formData = new FormData(form);
  const hpWebsite = formData.get('hp_website');
  if (hpWebsite && hpWebsite.trim() !== '') {
    console.warn('🤖 Bot detected (Newsletter)');
    return; // Silently block
  }

  const email = input ? input.value.trim() : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (input) input.style.borderColor = '#e74040';
    if (input) input.focus();
    return;
  }

  btn.textContent = 'Subscribing…';
  btn.disabled    = true;
  input.style.borderColor = '';

  try {
    const res  = await fetch(SUBSCRIBE_API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email })
    });
    const data = await res.json();

    if (data.success) {
      form.style.display = 'none';
      if (msg) msg.style.display = 'block';
    } else {
      alert(data.message || 'Subscription failed. Please try again.');
      btn.textContent = 'Subscribe';
      btn.disabled    = false;
    }
  } catch (err) {
    console.error('Subscribe error:', err);
    alert('Could not connect. Please try again later.');
    btn.textContent = 'Subscribe';
    btn.disabled    = false;
  }
});
