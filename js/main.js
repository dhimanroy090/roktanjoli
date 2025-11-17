// Sample donor dataset and simple filter logic
const donors = [
  {name: 'আলীম', blood: 'A+', city: 'Dhaka', phone: '+8801-111111111'},
  {name: 'সুমন', blood: 'O+', city: 'Chittagong', phone: '+8801-222222222'},
  {name: 'রিতা', blood: 'B+', city: 'Dhaka', phone: '+8801-333333333'},
  {name: 'নাজমুল', blood: 'AB-', city: 'Khulna', phone: '+8801-444444444'},
];

function formatDonor(d) {
  return `\n  <div class="border rounded p-3 mt-3 bg-white">\n    <div class="font-semibold">${d.name} — ${d.blood}</div>\n    <div class="text-sm text-gray-600">${d.city} • ${d.phone}</div>\n  </div>`;
}

function showResults(results) {
  const el = document.getElementById('results');
  if (!results || results.length === 0) {
    el.innerHTML = '<p class="text-gray-600">কোনো রেজাল্ট পাওয়া যায়নি — অনুগ্রহ করে কন্ডিশন বদলান।</p>';
    return;
  }
  el.innerHTML = results.map(formatDonor).join('');
}

function handleSearch(e) {
  e.preventDefault();
  const blood = document.getElementById('bloodGroup').value.trim();
  const city = document.getElementById('city').value.trim().toLowerCase();

  let results = donors.filter(d => {
    const matchBlood = !blood || d.blood === blood;
    const matchCity = !city || d.city.toLowerCase().includes(city);
    return matchBlood && matchCity;
  });

  showResults(results);
}

function handleContact() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();
  if (!name || !email || !msg) {
    alert('অনুগ্রহ করে সব ঘর পূরণ করুন।');
    return;
  }
  // For demo we just show a notice. Hook this to backend to send messages.
  document.getElementById('contactNotice').classList.remove('hidden');
  setTimeout(() => document.getElementById('contactNotice').classList.add('hidden'), 5000);
  document.getElementById('contactForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('searchForm');
  form.addEventListener('submit', handleSearch);

  document.getElementById('sendMsg').addEventListener('click', handleContact);

  // initial show some donors
  showResults(donors.slice(0, 3));

  // simple scroll-triggered fade-in for elements with `data-animate`
  const animTargets = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('fade-in');
          io.unobserve(e.target);
        }
      });
    }, {threshold: 0.15});
    animTargets.forEach(t => io.observe(t));
  } else {
    // fallback: reveal all
    animTargets.forEach(t => t.classList.add('fade-in'));
  }

  // mobile nav toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('show');
    });
  }

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth', block: 'start'});
          if (mobileNav && mobileNav.classList.contains('show')) mobileNav.classList.remove('show');
        }
      }
    });
  });
  
  // wire donor registration
  const donorForm = document.getElementById('donorForm');
  if (donorForm) donorForm.addEventListener('submit', handleDonorRegister);

  // hospital request
  const requestForm = document.getElementById('requestForm');
  if (requestForm) requestForm.addEventListener('submit', handleHospitalRequest);

  // newsletter
  const subscribeBtn = document.getElementById('subscribeBtn');
  if (subscribeBtn) subscribeBtn.addEventListener('click', handleNewsletter);

  // event registration buttons
  document.querySelectorAll('[data-event]').forEach(btn => btn.addEventListener('click', handleEventRegister));

  // show live stats
  updateLiveStats();
  // init campaign carousel
  initCampaignCarousel();
});

// Campaign carousel (auto slider)
function initCampaignCarousel() {
  const carousel = document.getElementById('campaignCarousel');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
  let idx = 0;
  let timer = null;
  function show(i) {
    slides.forEach((s,si) => s.classList.toggle('show', si === i));
    dots.forEach((d,di) => d.classList.toggle('active', di === i));
  }
  function next() { idx = (idx + 1) % slides.length; show(idx); }
  // start
  show(idx);
  timer = setInterval(next, 4000);
  // pause on hover
  carousel.addEventListener('mouseenter', () => { clearInterval(timer); timer = null; });
  carousel.addEventListener('mouseleave', () => { if (!timer) timer = setInterval(next, 4000); });
  // dot click
  dots.forEach((d, i) => d.addEventListener('click', () => { idx = i; show(idx); }));
}

// register donor (stores in localStorage for demo)
function handleDonorRegister(e) {
  e.preventDefault();
  const name = document.getElementById('d_name').value.trim();
  const phone = document.getElementById('d_phone').value.trim();
  const blood = document.getElementById('d_blood').value;
  const agree = document.getElementById('d_agree').checked;
  if (!name || !phone || !blood || !agree) { alert('অনুগ্রহ করে সব বাধ্যতামূলক ঘর পূরণ ও সম্মতি দিন।'); return; }
  const storage = JSON.parse(localStorage.getItem('rkt_donors') || '[]');
  storage.push({name, phone, blood, city: document.getElementById('d_city').value || '', date: new Date().toISOString()});
  localStorage.setItem('rkt_donors', JSON.stringify(storage));
  alert('ধন্যবাদ — রেজিস্ট্রেশন গ্রহণ করা হয়েছে।');
  document.getElementById('donorForm').reset();
  updateLiveStats();
}

function handleHospitalRequest(e) {
  e.preventDefault();
  const name = document.getElementById('r_name').value.trim();
  const phone = document.getElementById('r_phone').value.trim();
  const blood = document.getElementById('r_blood').value;
  if (!name || !phone || !blood) { alert('অনুগ্রহ করে নাম, ফোন এবং রক্তের গ্রুপ দিন।'); return; }
  const storage = JSON.parse(localStorage.getItem('rkt_requests') || '[]');
  storage.push({name, phone, blood, note: document.getElementById('r_note').value || '', date: new Date().toISOString()});
  localStorage.setItem('rkt_requests', JSON.stringify(storage));
  alert('অনুরোধ জমা হয়েছে — আপনার সাথে শিগগিরই যোগাযোগ করা হবে।');
  document.getElementById('requestForm').reset();
}

function handleNewsletter() {
  const em = document.getElementById('newsletterEmail').value.trim();
  if (!em) { alert('ইমেইল দিন।'); return; }
  const storage = JSON.parse(localStorage.getItem('rkt_news') || '[]');
  storage.push({email: em, date: new Date().toISOString()});
  localStorage.setItem('rkt_news', JSON.stringify(storage));
  alert('ধন্যবাদ — আপনি নিউজলেটারে সাবস্ক্রাইব করেছেন।');
  document.getElementById('newsletterForm').reset();
}

function handleEventRegister(e) {
  const ev = e.currentTarget.getAttribute('data-event');
  const storage = JSON.parse(localStorage.getItem('rkt_events') || '[]');
  storage.push({event: ev, date: new Date().toISOString()});
  localStorage.setItem('rkt_events', JSON.stringify(storage));
  alert('Event registration received: ' + ev);
}

function updateLiveStats() {
  const donors = JSON.parse(localStorage.getItem('rkt_donors') || '[]');
  const events = JSON.parse(localStorage.getItem('rkt_events') || '[]');
  const units = donors.length * 1; // demo: 1 unit per donor
  document.getElementById('stat-donors').textContent = donors.length || 1200;
  document.getElementById('stat-units').textContent = units || 15000;
  document.getElementById('stat-campaigns').textContent = (events.length || 42);
}