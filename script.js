// ═══ THEME (Light/Dark — follows system, manual override) ═══
(function initTheme() {
  const saved = localStorage.getItem('chibaik-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  applyTheme(isDark, false);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('chibaik-theme')) applyTheme(e.matches, true);
  });
})();

function applyTheme(dark, animate) {
  if (!animate) document.documentElement.style.transition = 'none';
  document.documentElement.classList.toggle('dark', dark);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
  if (!animate) requestAnimationFrame(() => { document.documentElement.style.transition = ''; });
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('chibaik-theme', isDark ? 'light' : 'dark');
  applyTheme(!isDark, true);
}

// ═══ NAV ═══
function toggleDd(id) {
  const el = document.getElementById(id), was = el.classList.contains('open');
  closeAllDd();
  if (!was) el.classList.add('open');
}
function closeAllDd() { document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('open')); }
document.addEventListener('click', e => { if (!e.target.closest('.nav-item')) closeAllDd(); });
function scrollS(id) { document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); closeAllDd(); }
function toggleMob() {
  const mn = document.getElementById('mobNav');
  mn.classList.toggle('open');
  document.getElementById('hamBtn').textContent = mn.classList.contains('open') ? '✕' : '☰';
}
function closeMob() { document.getElementById('mobNav').classList.remove('open'); document.getElementById('hamBtn').textContent = '☰'; }

// ═══ SCROLL ANIMATIONS ═══
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.1 });
document.querySelectorAll('.anim').forEach(el => obs.observe(el));

const numObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      const target = parseInt(e.target.dataset.target);
      if (!target) return;
      const suffix = e.target.dataset.suffix || '';
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1600, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        e.target.textContent = Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => numObs.observe(el));

// ═══ FUEL CALCULATOR ═══
function fmtN(n) { return '₦' + Math.round(n).toLocaleString(); }
function calcFuel() {
  const L = parseFloat(document.getElementById('fc-l').value) || 0;
  const P = parseFloat(document.getElementById('fc-p').value) || 0;
  if (!L || !P) { alert('Please enter your litres per week and fuel price.'); return; }
  const wk = L * P, mo = wk * 4.33, yr = mo * 12, five = yr * 5;
  document.getElementById('fc-weekly').textContent = fmtN(wk);
  document.getElementById('fc-monthly').textContent = fmtN(mo);
  document.getElementById('fc-yearly').textContent = fmtN(yr);
  document.getElementById('fc-5yr').textContent = fmtN(five);
  let ins = '';
  if (mo < 10000) ins = `You spend <strong>${fmtN(mo)}</strong> a month on fuel. Even a basic solar generator pays for itself in under a year.`;
  else if (mo < 40000) ins = `You are spending <strong>${fmtN(mo)} every month</strong> on fuel. That is <strong>${fmtN(yr)} a year.</strong> A mid-range solar system could pay itself off in roughly ${Math.round(500000 / mo)} months of redirecting that money.`;
  else if (mo < 100000) ins = `<strong>${fmtN(mo)} every single month</strong> is going to fuel. That is <strong>${fmtN(five)} over 5 years.</strong> A full home solar system could eliminate that cost entirely and pay for itself in about ${Math.round(1500000 / mo)} months.`;
  else ins = `You are spending <strong>${fmtN(mo)} a month</strong> on fuel. That is <strong>${fmtN(five)} over 5 years.</strong> A heavy duty solar system is not just worth it for you, it is urgent.`;
  document.getElementById('fc-insight').innerHTML = ins;
  const r = document.getElementById('fuelRes');
  r.classList.add('show');
  setTimeout(() => r.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

// ═══ PRICE TRACKER ═══
// ⬇ UPDATE PRICES HERE whenever market changes
const priceData = {
  lastUpdated: 'June 2026',
  categories: [
    {
      id: 'panels', label: '☀️ Panels',
      items: [
        { icon: '🔆', name: '250W Monocrystalline Panel', min: 55000, max: 75000, note: 'Good for small to medium systems' },
        { icon: '🔆', name: '300W Monocrystalline Panel', min: 65000, max: 90000, note: 'Most popular residential size' },
        { icon: '🔆', name: '400W Monocrystalline Panel', min: 85000, max: 120000, note: 'Best value per watt' },
        { icon: '🔆', name: '550W Monocrystalline Panel', min: 110000, max: 155000, note: 'For larger installations' },
      ]
    },
    {
      id: 'batteries', label: '🔋 Batteries',
      items: [
        { icon: '🔋', name: '100Ah / 12V LiFePO4 Battery', min: 280000, max: 380000, note: '~1.2kWh usable capacity' },
        { icon: '🔋', name: '200Ah / 12V LiFePO4 Battery', min: 520000, max: 720000, note: '~2.4kWh usable capacity' },
        { icon: '🔋', name: '100Ah / 24V LiFePO4 Battery', min: 320000, max: 460000, note: '~2.4kWh usable capacity' },
        { icon: '🔋', name: '200Ah / 24V LiFePO4 Battery', min: 600000, max: 850000, note: '~4.8kWh usable capacity' },
      ]
    },
    {
      id: 'inverters', label: '⚡ Inverters',
      items: [
        { icon: '⚡', name: '1kW Pure Sine Wave Inverter', min: 75000, max: 120000, note: 'For small home loads' },
        { icon: '⚡', name: '2kW Pure Sine Wave Inverter', min: 140000, max: 210000, note: 'Handles most household needs' },
        { icon: '⚡', name: '3kW Hybrid Inverter', min: 260000, max: 390000, note: 'Recommended — built-in MPPT' },
        { icon: '⚡', name: '5kW Hybrid Inverter', min: 450000, max: 680000, note: 'For heavy loads including AC' },
      ]
    },
    {
      id: 'controllers', label: '🎛️ Controllers',
      items: [
        { icon: '🎛️', name: '20A MPPT Charge Controller', min: 30000, max: 50000, note: 'For systems up to 260W panels at 12V' },
        { icon: '🎛️', name: '40A MPPT Charge Controller', min: 60000, max: 90000, note: 'For systems up to 520W panels at 12V' },
        { icon: '🎛️', name: '60A MPPT Charge Controller', min: 95000, max: 150000, note: 'For larger off-grid systems' },
      ]
    },
  ]
};

function renderPriceTabs() {
  const tabsEl = document.getElementById('priceTabs');
  const panelsEl = document.getElementById('pricePanels');
  if (!tabsEl || !panelsEl) return;
  tabsEl.innerHTML = priceData.categories.map((c, i) =>
    `<button class="price-tab${i === 0 ? ' on' : ''}" onclick="showPriceTab('${c.id}',this)">${c.label}</button>`
  ).join('');
  panelsEl.innerHTML = priceData.categories.map((c, i) => `
    <div class="price-panel${i === 0 ? ' on' : ''}" id="pp-${c.id}">
      ${c.items.map(item => `
        <div class="price-card">
          <span class="price-icon">${item.icon}</span>
          <div class="price-name">${item.name}</div>
          <div class="price-range">₦${item.min.toLocaleString()} — ₦${item.max.toLocaleString()}</div>
          <div class="price-note-text">${item.note}</div>
        </div>
      `).join('')}
    </div>
  `).join('');
}
function showPriceTab(id, btn) {
  document.querySelectorAll('.price-tab').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.price-panel').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('pp-' + id)?.classList.add('on');
}

// ═══ ACCORDION (FAQ + MYTHS) ═══
function toggleFaq(btn) {
  const item = btn.closest('.faq-card');
  const was = item.classList.contains('open');
  document.querySelectorAll('.faq-card').forEach(i => i.classList.remove('open'));
  if (!was) item.classList.add('open');
}
function toggleMyth(btn) {
  const item = btn.closest('.myth-card');
  const was = item.classList.contains('open');
  document.querySelectorAll('.myth-card').forEach(i => i.classList.remove('open'));
  if (!was) item.classList.add('open');
}

// ═══ GLOSSARY ═══
function filterGloss(v) {
  const q = v.toLowerCase().trim();
  let vis = 0;
  document.querySelectorAll('.gloss-card').forEach(c => {
    const show = !q || (c.dataset.t || '').includes(q) || c.textContent.toLowerCase().includes(q);
    c.classList.toggle('gone', !show);
    if (show) vis++;
  });
  document.getElementById('glossEmpty').style.display = vis === 0 ? 'block' : 'none';
}

// ═══ ASK A QUESTION ═══
function sendQuestion() {
  const name = document.getElementById('askName').value.trim();
  const state = document.getElementById('askState').value;
  const question = document.getElementById('askQuestion').value.trim();
  if (!question) { alert('Please write your question before sending.'); return; }
  const who = name ? `my name is ${name}` : 'I have a question';
  const loc = state ? ` I am based in ${state}.` : '';
  const msg = `Hi! ${who}.${loc} I have a solar question: ${question}`;
  window.open(`https://wa.me/+2347057027857?text=${encodeURIComponent(msg)}`, '_blank');
}

// ═══ NIGERIA SOLAR MAP ═══
const nigeriaStates = [
  { name:'Sokoto',      col:1, row:1, heat:2 }, { name:'Kebbi',       col:2, row:1, heat:2 },
  { name:'Katsina',     col:4, row:1, heat:2 }, { name:'Kano',        col:5, row:1, heat:3 },
  { name:'Jigawa',      col:6, row:1, heat:2 }, { name:'Borno',       col:9, row:1, heat:1 },
  { name:'Zamfara',     col:3, row:2, heat:2 }, { name:'Kaduna',      col:4, row:2, heat:3 },
  { name:'Bauchi',      col:6, row:2, heat:2 }, { name:'Gombe',       col:7, row:2, heat:2 },
  { name:'Yobe',        col:8, row:2, heat:1 }, { name:'Niger',       col:2, row:3, heat:2 },
  { name:'FCT',         col:5, row:3, heat:5 }, { name:'Plateau',     col:6, row:3, heat:3 },
  { name:'Adamawa',     col:8, row:3, heat:2 }, { name:'Kwara',       col:2, row:4, heat:3 },
  { name:'Kogi',        col:4, row:4, heat:2 }, { name:'Nasarawa',    col:5, row:4, heat:3 },
  { name:'Benue',       col:6, row:4, heat:2 }, { name:'Taraba',      col:8, row:4, heat:2 },
  { name:'Lagos',       col:1, row:5, heat:5 }, { name:'Ogun',        col:2, row:5, heat:4 },
  { name:'Oyo',         col:3, row:5, heat:4 }, { name:'Osun',        col:4, row:5, heat:3 },
  { name:'Ekiti',       col:5, row:5, heat:3 }, { name:'Ondo',        col:6, row:5, heat:3 },
  { name:'Edo',         col:7, row:5, heat:3 }, { name:'Cross River', col:9, row:5, heat:3 },
  { name:'Anambra',     col:4, row:6, heat:4 }, { name:'Enugu',       col:5, row:6, heat:3 },
  { name:'Ebonyi',      col:6, row:6, heat:2 }, { name:'Delta',       col:7, row:6, heat:3 },
  { name:'Akwa Ibom',   col:8, row:6, heat:4 }, { name:'Imo',         col:4, row:7, heat:3 },
  { name:'Abia',        col:5, row:7, heat:3 }, { name:'Rivers',      col:7, row:7, heat:4 },
  { name:'Bayelsa',     col:8, row:7, heat:2 },
];

function renderSolarMap() {
  const grid = document.getElementById('mapGrid');
  if (!grid) return;
  grid.innerHTML = '';
  nigeriaStates.forEach(s => {
    const tapped = localStorage.getItem(`cmap-${s.name}`) === '1';
    const cell = document.createElement('button');
    cell.className = `map-cell h${s.heat}${tapped ? ' tapped' : ''}`;
    cell.style.gridColumn = s.col;
    cell.style.gridRow = s.row;
    cell.innerHTML = s.name;
    cell.title = s.name;
    cell.onclick = () => tapState(s.name, cell);
    grid.appendChild(cell);
  });
  updateMapCount();
}

function tapState(name, cell) {
  const already = localStorage.getItem(`cmap-${name}`) === '1';
  if (already) {
    localStorage.removeItem(`cmap-${name}`);
    cell.classList.remove('tapped');
  } else {
    localStorage.setItem(`cmap-${name}`, '1');
    cell.classList.add('tapped');
  }
  updateMapCount();
}

function updateMapCount() {
  const count = nigeriaStates.filter(s => localStorage.getItem(`cmap-${s.name}`) === '1').length;
  const el = document.getElementById('mapCounter');
  if (el) el.textContent = count;
}

// ═══ CALC OVERLAY ═══
const appData = [
  { id:'bulb-led',  cat:'light',   img:'💡', name:'LED Bulb',                v:[{l:'5W Night Light',w:5},{l:'7W Standard',w:7},{l:'9W Bright',w:9},{l:'12W Extra Bright',w:12},{l:'15W Super Bright',w:15}] },
  { id:'bulb-cfl',  cat:'light',   img:'💡', name:'Fluorescent / CFL Bulb',  v:[{l:'11W Small',w:11},{l:'18W Medium',w:18},{l:'23W Standard',w:23},{l:'26W Bright',w:26}] },
  { id:'flood',     cat:'light',   img:'🔦', name:'Security / Flood Light',  v:[{l:'30W Small',w:30},{l:'50W Standard',w:50},{l:'100W Large',w:100},{l:'150W Industrial',w:150}] },
  { id:'strip',     cat:'light',   img:'🌈', name:'LED Strip Light (per set)',v:[{l:'Small Set 12W',w:12},{l:'Medium Set 20W',w:20},{l:'Large Set 36W',w:36}] },
  { id:'fan-c',     cat:'fans',    img:'🌀', name:'Ceiling Fan',             v:[{l:'Low Speed 45W',w:45},{l:'Standard 60W',w:60},{l:'High Speed 75W',w:75}] },
  { id:'fan-s',     cat:'fans',    img:'💨', name:'Standing Fan',            v:[{l:'Small 35W',w:35},{l:'Standard 50W',w:50},{l:'Large 60W',w:60},{l:'Industrial 120W',w:120}] },
  { id:'fan-t',     cat:'fans',    img:'💨', name:'Table / Desk Fan',        v:[{l:'Mini 20W',w:20},{l:'Standard 35W',w:35},{l:'Large 45W',w:45}] },
  { id:'fan-e',     cat:'fans',    img:'🌬️', name:'Exhaust Fan',             v:[{l:'Small 20W',w:20},{l:'Standard 30W',w:30},{l:'Large 45W',w:45}] },
  { id:'ac',        cat:'cooling', img:'❄️', name:'Air Conditioner',         v:[{l:'0.75HP Window',w:600},{l:'1HP Split',w:750},{l:'1.5HP Split',w:1200},{l:'2HP Split',w:1800},{l:'2.5HP Inverter AC',w:2000}] },
  { id:'fridge-m',  cat:'cooling', img:'🧊', name:'Mini Fridge',             v:[{l:'50L 45W',w:45},{l:'80L 60W',w:60},{l:'100L 80W',w:80},{l:'120L 100W',w:100}] },
  { id:'fridge',    cat:'cooling', img:'🧊', name:'Refrigerator',            v:[{l:'Single Door 100L',w:100},{l:'Single Door 150L',w:120},{l:'Single Door 200L',w:150},{l:'Double Door 300L',w:200},{l:'Double Door 400L',w:300}] },
  { id:'freezer',   cat:'cooling', img:'🧊', name:'Deep / Chest Freezer',    v:[{l:'100L Small',w:100},{l:'200L Standard',w:150},{l:'300L Large',w:200},{l:'500L Commercial',w:350}] },
  { id:'tv',        cat:'ent',     img:'📺', name:'Television',              v:[{l:'24 inch 40W',w:40},{l:'32 inch 60W',w:60},{l:'43 inch 80W',w:80},{l:'50 inch 100W',w:100},{l:'55 inch 120W',w:120},{l:'65 inch 150W',w:150},{l:'75 inch 200W',w:200}] },
  { id:'decoder',   cat:'ent',     img:'📡', name:'DSTV / Decoder Box',      v:[{l:'Standard Box 15W',w:15},{l:'HD Decoder 20W',w:20},{l:'Explora / Smart 25W',w:25}] },
  { id:'sound',     cat:'ent',     img:'🔊', name:'Sound System',            v:[{l:'Small 50W',w:50},{l:'Medium 100W',w:100},{l:'Large 200W',w:200},{l:'Home Theatre 400W',w:400}] },
  { id:'console',   cat:'ent',     img:'🎮', name:'Gaming Console',          v:[{l:'PS4 / Xbox One 140W',w:140},{l:'PS5 / Xbox Series X 200W',w:200},{l:'Nintendo Switch 18W',w:18}] },
  { id:'micro',     cat:'kitchen', img:'📦', name:'Microwave Oven',          v:[{l:'700W Rated 1000W draw',w:1000},{l:'900W Rated 1200W draw',w:1200},{l:'1100W Rated 1400W draw',w:1400}] },
  { id:'kettle',    cat:'kitchen', img:'☕', name:'Electric Kettle',         v:[{l:'0.8L 1000W',w:1000},{l:'1.5L 1500W',w:1500},{l:'1.7L 1800W',w:1800},{l:'2L 2000W',w:2000}] },
  { id:'blender',   cat:'kitchen', img:'🥤', name:'Blender',                 v:[{l:'Personal 200W',w:200},{l:'Standard 400W',w:400},{l:'Heavy Duty 700W',w:700},{l:'Commercial 1000W',w:1000}] },
  { id:'rice',      cat:'kitchen', img:'🍚', name:'Rice Cooker',             v:[{l:'1L Small 300W',w:300},{l:'1.8L Medium 500W',w:500},{l:'3L Large 700W',w:700},{l:'5.6L Family 1000W',w:1000}] },
  { id:'iron',      cat:'kitchen', img:'👔', name:'Electric Iron',           v:[{l:'Dry Iron 1000W',w:1000},{l:'Steam Iron 1200W',w:1200},{l:'Heavy Duty 1800W',w:1800}] },
  { id:'toaster',   cat:'kitchen', img:'🍞', name:'Toaster',                 v:[{l:'2 Slice 800W',w:800},{l:'4 Slice 1200W',w:1200},{l:'Toaster Oven 1500W',w:1500}] },
  { id:'cooker',    cat:'kitchen', img:'🍲', name:'Electric Cooker',         v:[{l:'1 Plate 1000W',w:1000},{l:'2 Plate 2000W',w:2000},{l:'4 Plate + Oven 3500W',w:3500}] },
  { id:'disp',      cat:'kitchen', img:'💧', name:'Water Dispenser',         v:[{l:'Cold Only 100W',w:100},{l:'Hot and Cold 400W',w:400},{l:'With Compressor 150W',w:150}] },
  { id:'laptop',    cat:'office',  img:'💻', name:'Laptop',                  v:[{l:'Ultrabook 30W',w:30},{l:'Standard 65W',w:65},{l:'Performance 90W',w:90},{l:'Gaming 150W',w:150}] },
  { id:'desktop',   cat:'office',  img:'🖥️', name:'Desktop + Monitor',       v:[{l:'Budget 150W',w:150},{l:'Standard 250W',w:250},{l:'Gaming PC 400W',w:400},{l:'Workstation 600W',w:600}] },
  { id:'printer',   cat:'office',  img:'🖨️', name:'Printer',                 v:[{l:'Inkjet 30W',w:30},{l:'Laser Printer 400W',w:400},{l:'Large Format 500W',w:500}] },
  { id:'router',    cat:'office',  img:'📶', name:'WiFi Router',             v:[{l:'Basic 10W',w:10},{l:'Standard 15W',w:15},{l:'High End 25W',w:25}] },
  { id:'phone',     cat:'office',  img:'📱', name:'Phone Charger',           v:[{l:'Single 15W',w:15},{l:'Fast Charge Single 30W',w:30},{l:'Multiple Phones 60W',w:60}] },
  { id:'cctv',      cat:'office',  img:'📹', name:'CCTV System',             v:[{l:'4 Cameras 30W',w:30},{l:'8 Cameras 60W',w:60},{l:'16 Cameras + DVR 100W',w:100}] },
  { id:'pump',      cat:'heavy',   img:'🚿', name:'Water Pump',              v:[{l:'0.5HP 375W',w:375},{l:'1HP 750W',w:750},{l:'1.5HP 1125W',w:1125},{l:'2HP 1500W',w:1500},{l:'3HP Borehole 2250W',w:2250}] },
  { id:'washer',    cat:'heavy',   img:'👕', name:'Washing Machine',         v:[{l:'Top Load 5kg 300W',w:300},{l:'Top Load 7kg 500W',w:500},{l:'Front Load 7kg 700W',w:700},{l:'Front Load 10kg 900W',w:900}] },
  { id:'hairdryer', cat:'heavy',   img:'💇', name:'Hair Dryer',              v:[{l:'1200W Light',w:1200},{l:'1600W Standard',w:1600},{l:'2000W Professional',w:2000}] },
  { id:'heater',    cat:'heavy',   img:'♨️', name:'Water Heater',            v:[{l:'Instant Shower 3000W',w:3000},{l:'Storage 10L 1500W',w:1500},{l:'Storage 20L 2000W',w:2000}] },
  { id:'fryer',     cat:'heavy',   img:'🍟', name:'Air Fryer',               v:[{l:'Small 2L 800W',w:800},{l:'Standard 3.5L 1200W',w:1200},{l:'Large 5L 1500W',w:1500}] },
  { id:'grinder',   cat:'heavy',   img:'⚙️', name:'Grinding Machine',        v:[{l:'Home 200W',w:200},{l:'Standard 500W',w:500},{l:'Heavy Duty 1500W',w:1500}] },
];
const catList = [
  { id:'all',    l:'All'         },
  { id:'light',  l:'💡 Lighting' },
  { id:'fans',   l:'🌀 Fans'     },
  { id:'cooling',l:'❄️ Cooling'  },
  { id:'ent',    l:'📺 Entertainment' },
  { id:'kitchen',l:'🍳 Kitchen'  },
  { id:'office', l:'💻 Office'   },
  { id:'heavy',  l:'⚙️ Heavy Duty' },
];
const stations = [
  { tier:'Entry-Level',  r:'300W / 256Wh Battery',      max:300,   cap:256   },
  { tier:'Entry-Level',  r:'500W / 512Wh Battery',      max:500,   cap:512   },
  { tier:'Entry-Level',  r:'500W / 1,000Wh Battery',    max:500,   cap:1000  },
  { tier:'Entry-Level',  r:'800W / 768Wh Battery',      max:800,   cap:768   },
  { tier:'Entry-Level',  r:'1,000W / 960Wh Battery',    max:1000,  cap:960   },
  { tier:'Entry-Level',  r:'1,000W / 1,000Wh Battery',  max:1000,  cap:1000  },
  { tier:'Entry-Level',  r:'1,000W / 2,000Wh Battery',  max:1000,  cap:2000  },
  { tier:'Mid-Range',    r:'1,200W / 960Wh Battery',    max:1200,  cap:960   },
  { tier:'Mid-Range',    r:'1,800W / 1,024Wh Battery',  max:1800,  cap:1024  },
  { tier:'Mid-Range',    r:'2,000W / 2,000Wh Battery',  max:2000,  cap:2000  },
  { tier:'Mid-Range',    r:'2,400W / 2,048Wh Battery',  max:2400,  cap:2048  },
  { tier:'Mid-Range',    r:'3,000W / 2,560Wh Battery',  max:3000,  cap:2560  },
  { tier:'Heavy-Duty',   r:'3,600W / 3,600Wh Battery',  max:3600,  cap:3600  },
  { tier:'Heavy-Duty',   r:'3,600W / 8,000Wh Battery',  max:3600,  cap:8000  },
  { tier:'Heavy-Duty',   r:'6,000W / 16,000Wh Battery', max:6000,  cap:16000 },
  { tier:'Heavy-Duty',   r:'7,200W / 6,000Wh Battery',  max:7200,  cap:6000  },
  { tier:'Heavy-Duty',   r:'12,000W / 14,330Wh Battery',max:12000, cap:14330 },
];
const pkgs = [
  { n:'Starter Package',    inv:'1kW Inverter',        bat:'100Ah / 12V Battery', bWh:1200, ctrl:'20A MPPT Charge Controller', pan:'2 × 250W Solar Panels', max:1000 },
  { n:'Standard Package',   inv:'2kW Inverter',        bat:'200Ah / 12V Battery', bWh:2400, ctrl:'40A MPPT Charge Controller', pan:'4 × 250W Solar Panels', max:2000 },
  { n:'Premium Package',    inv:'3kW Hybrid Inverter', bat:'200Ah / 24V Battery', bWh:4800, ctrl:'Built-in (Hybrid Inverter)', pan:'6 × 300W Solar Panels', max:3000 },
  { n:'Heavy Duty Package', inv:'5kW Hybrid Inverter', bat:'400Ah / 24V Battery', bWh:9600, ctrl:'Built-in (Hybrid Inverter)', pan:'10 × 300W Solar Panels',max:5000 },
];

const sel = {};
let totalLoad = 0, activeCat = 'all', waItem = '', waLoad = 0;

function emojiImg(e) {
  const c = document.createElement('canvas'); c.width = 90; c.height = 90;
  const x = c.getContext('2d'); x.font = '62px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(e, 45, 50); return c.toDataURL();
}

function openCalc() {
  document.getElementById('calcOv').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('ctabs').childElementCount) { renderCats(); renderApps(); }
  updateTB();
}
function closeCalc() { document.getElementById('calcOv').classList.remove('open'); document.body.style.overflow = ''; hideTB(); }
function showCalcPg() { document.getElementById('calcPg').classList.add('on'); document.getElementById('resPg').classList.remove('on'); updateTB(); }
function showRes() {
  document.getElementById('calcPg').classList.remove('on');
  document.getElementById('resPg').classList.add('on');
  hideTB();
  document.getElementById('loadNum').textContent = totalLoad.toLocaleString();
  buildGenRecs(); buildSolRecs();
  document.getElementById('calcOv').scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCats() {
  document.getElementById('ctabs').innerHTML = catList.map(c =>
    `<button class="ctab${c.id === 'all' ? ' on' : ''}" onclick="filterCat('${c.id}',this)">${c.l}</button>`
  ).join('');
}
function filterCat(cat, btn) {
  activeCat = cat;
  document.querySelectorAll('.ctab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderApps();
}
function renderApps() {
  const list = activeCat === 'all' ? appData : appData.filter(a => a.cat === activeCat);
  document.getElementById('agrid').innerHTML = list.map(a => {
    const s = sel[a.id] || { vi: 0, q: 0 };
    return `<div class="acard${s.q > 0 ? ' lit' : ''}" id="ac-${a.id}">
      <div class="a-img"><img src="${emojiImg(a.img)}" alt="${a.name}"></div>
      <div class="a-body">
        <div class="a-name">${a.name}</div>
        <select class="a-sel" id="as-${a.id}" onchange="chVar('${a.id}',this.value)">
          ${a.v.map((v, i) => `<option value="${i}"${i === s.vi ? ' selected' : ''}>${v.l}</option>`).join('')}
        </select>
        <span class="a-w" id="aw-${a.id}">${a.v[s.vi].w}W per unit</span>
        <div class="aqrow">
          <button class="aqbtn aq-minus" onclick="chQ('${a.id}',-1)">−</button>
          <span class="aqn" id="aqn-${a.id}">${s.q}</span>
          <button class="aqbtn aq-plus" onclick="chQ('${a.id}',1)">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function chVar(id, vi) {
  if (!sel[id]) sel[id] = { vi: 0, q: 0 };
  sel[id].vi = parseInt(vi);
  const a = appData.find(x => x.id === id);
  const aw = document.getElementById('aw-' + id);
  if (aw) aw.textContent = a.v[sel[id].vi].w + 'W per unit';
  recalc();
}
function chQ(id, d) {
  if (!sel[id]) sel[id] = { vi: 0, q: 0 };
  sel[id].q = Math.max(0, sel[id].q + d);
  const qn = document.getElementById('aqn-' + id), card = document.getElementById('ac-' + id);
  if (qn) qn.textContent = sel[id].q;
  if (card) sel[id].q > 0 ? card.classList.add('lit') : card.classList.remove('lit');
  recalc();
}
function recalc() {
  totalLoad = 0;
  for (const [id, s] of Object.entries(sel)) {
    if (!s.q) continue;
    const a = appData.find(x => x.id === id);
    if (a) totalLoad += a.v[s.vi].w * s.q;
  }
  document.getElementById('tb-w').textContent = totalLoad.toLocaleString();
  const btn = document.getElementById('tb-rec');
  if (btn) btn.disabled = totalLoad === 0;
  updateTB();
}
function updateTB() {
  const bar = document.getElementById('totalBar');
  const open = document.getElementById('calcOv').classList.contains('open');
  const pg = document.getElementById('calcPg').classList.contains('on');
  open && pg ? bar.classList.add('on') : bar.classList.remove('on');
}
function hideTB() { document.getElementById('totalBar').classList.remove('on'); }
function resetAll() {
  Object.keys(sel).forEach(k => { sel[k] = { vi: sel[k]?.vi || 0, q: 0 }; });
  totalLoad = 0; renderApps(); recalc();
}

function fmtD(h) {
  if (!isFinite(h) || h <= 0) return '<1 min';
  if (h < 1) return Math.round(h * 60) + 'm';
  const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
  return mm > 0 ? `${hh}h ${mm}m` : `${hh}h`;
}
function bW(h, max) { return Math.min(100, isFinite(h) && h > 0 ? Math.round((h / max) * 100) : 0); }

function buildGenRecs() {
  const grid = document.getElementById('rg-gen');
  const matches = stations.filter(s => s.max >= totalLoad);
  if (!matches.length) { grid.innerHTML = `<div class="no-match"><p>Your load of <strong>${totalLoad.toLocaleString()}W</strong> is too high for standard power stations. Switch to the <strong>Let There Be Light</strong> tab.</p></div>`; return; }
  const ref = Math.max(...matches.map(s => s.cap / (totalLoad * 0.25)));
  grid.innerHTML = matches.map(s => {
    const yH = s.cap / totalLoad, mH = s.cap / s.max, lH = s.cap / (totalLoad * 0.3);
    return `<div class="rcard" onclick="openWa('${s.r}','${s.r}',${totalLoad})">
      <span class="rbadge bg-gen">${s.tier}</span>
      <div class="r-title">${s.r}</div>
      <div class="r-sub">Inverter: ${s.max.toLocaleString()}W · Battery: ${s.cap.toLocaleString()}Wh</div>
      <div class="dur-row"><div class="dur-lbl">⚡ Your Load (${totalLoad.toLocaleString()}W) <span>${fmtD(yH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(yH,ref)}%;background:linear-gradient(90deg,#FFD000,#FF8C00)"></div></div></div>
      <div class="dur-row"><div class="dur-lbl">🔴 Station Full Power (${s.max.toLocaleString()}W) <span>${fmtD(mH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(mH,ref)}%;background:linear-gradient(90deg,#FF4444,#FF8C00)"></div></div></div>
      <div class="dur-row" style="margin-bottom:12px"><div class="dur-lbl">🟢 Light Use (30% of load) <span>${fmtD(lH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(lH,ref)}%;background:linear-gradient(90deg,#00C853,#00E676)"></div></div></div>
      <button class="rcta">💬 Ask If Available</button></div>`;
  }).join('');
}
function buildSolRecs() {
  const grid = document.getElementById('rg-solar');
  const matches = pkgs.filter(p => p.max >= totalLoad);
  if (!matches.length) { grid.innerHTML = `<div class="no-match"><p>Your load of <strong>${totalLoad.toLocaleString()}W</strong> exceeds standard packages. Chat us directly for a custom system.</p></div>`; return; }
  const ref = Math.max(...matches.map(p => p.bWh / (totalLoad * 0.25)));
  grid.innerHTML = matches.map(p => {
    const yH = p.bWh / totalLoad, fH = p.bWh / p.max, lH = p.bWh / (totalLoad * 0.3);
    const detail = `${p.inv}, ${p.bat}, ${p.pan}`;
    return `<div class="rcard" onclick="openWa('${p.n}','${p.n} (${detail})',${totalLoad})">
      <span class="rbadge bg-sol">Let There Be Light ☀️</span>
      <div class="r-title">${p.n}</div>
      <div class="pkg-specs">
        <div class="pkg-row"><span class="pi">⚡</span><strong>${p.inv}</strong></div>
        <div class="pkg-row"><span class="pi">🔋</span><strong>${p.bat}</strong></div>
        <div class="pkg-row"><span class="pi">🔌</span><strong>${p.ctrl}</strong></div>
        <div class="pkg-row"><span class="pi">🌞</span><strong>${p.pan}</strong></div>
      </div>
      <div class="dur-row"><div class="dur-lbl">⚡ Your Load (${totalLoad.toLocaleString()}W) <span>${fmtD(yH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(yH,ref)}%;background:linear-gradient(90deg,#FFD000,#FF8C00)"></div></div></div>
      <div class="dur-row"><div class="dur-lbl">🔴 Inverter Full Load (${p.max.toLocaleString()}W) <span>${fmtD(fH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(fH,ref)}%;background:linear-gradient(90deg,#FF4444,#FF8C00)"></div></div></div>
      <div class="dur-row" style="margin-bottom:12px"><div class="dur-lbl">🟢 Light Use (30% of load) <span>${fmtD(lH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(lH,ref)}%;background:linear-gradient(90deg,#00C853,#00E676)"></div></div></div>
      <button class="rcta">💬 Ask If Available</button></div>`;
  }).join('');
}
function switchRTab(tab, btn) {
  document.querySelectorAll('.rtab').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.rpanel').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('rp-' + tab).classList.add('on');
}

// ═══ SHARE — CALC ═══
function shareCalc(platform) {
  const siteUrl = window.location.hostname !== 'localhost' ? window.location.href : 'https://chibaikpower.vercel.app';
  const msg = `My home needs ${totalLoad.toLocaleString()}W of solar power. I found this using the free Load Calculator at Chibaik Power. Calculate yours free: ${siteUrl} ⚡`;
  if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank');
  else if (platform === 'copy') {
    navigator.clipboard.writeText(msg).then(() => {
      const btn = document.getElementById('calcCopyBtn');
      btn.textContent = '✅ Copied';
      setTimeout(() => btn.textContent = '📋 Copy', 2000);
    });
  }
}

// ═══ WA MODAL ═══
function openWa(display, full, load) {
  waItem = full; waLoad = load;
  document.getElementById('waItem').textContent = display;
  document.getElementById('waName').value = '';
  document.getElementById('waOv').classList.add('open');
  setTimeout(() => document.getElementById('waName').focus(), 150);
}
function closeWa() { document.getElementById('waOv').classList.remove('open'); }
function closeWaOut(e) { if (e.target === document.getElementById('waOv')) closeWa(); }
function buildMsg(name) {
  const who = name ? `my name is ${name}` : "I'd like to enquire";
  return `Hi! ${who}. I used your Load Calculator and my total load is ${waLoad.toLocaleString()}W. I am interested in the ${waItem}. Is it available and how much does it cost?`;
}
function sendWa() { const n = document.getElementById('waName').value.trim(); window.open(`https://wa.me/+2347057027857?text=${encodeURIComponent(buildMsg(n))}`, '_blank'); closeWa(); }
function sendWaAnon() { window.open(`https://wa.me/+2347057027857?text=${encodeURIComponent(buildMsg(''))}`, '_blank'); closeWa(); }

// ═══ DYK POPUP ═══
const dykFacts = [
  { icon:'⛽', text:'Add up every naira you spent on fuel last year. Most Lagos and Abuja households spend between ₦300,000 and ₦600,000 annually on generator fuel alone. That is school fees. A trip. A business investment. All going up in smoke, literally.' },
  { icon:'😤', text:'NEPA takes light, you start the generator. NEPA brings light, you turn it off. The average Nigerian does this dance 3 to 5 times a day. Solar does not know that dance. It just stays on.' },
  { icon:'🌞', text:'The same sun that makes you sweat in Lagos, Abuja, Kano or Port Harcourt is powerful enough to run your AC, charge your devices and power every light in your house for free. Most people just have not captured it yet.' },
  { icon:'🔧', text:'Your generator has been serviced at least twice this year. New spark plug, engine oil, repair man. Your solar panel? It just sits on the roof and works. No moving parts means almost nothing to fix for 25 to 30 years.' },
  { icon:'📉', text:'Solar panels that cost ₦500,000 in 2010 now cost under ₦80,000. The price dropped over 90 percent in 15 years. Right now, today, is the best time in history to switch to solar. It only gets better from here.' },
  { icon:'🌬️', text:'During harmattan, the dust settling on solar panels can quietly cut their output by up to 25 percent. A simple rinse with water once or twice a month during that season keeps your system running at full power.' },
  { icon:'🔋', text:'Many Nigerians buy a solar system and drain the battery to zero every night, then wonder why it stopped holding charge within two years. Lithium batteries are designed to stop at 20 percent. Push past that regularly and you are slowly killing it.' },
  { icon:'🌍', text:'If you live in Kano, Kaduna, Jos, Maiduguri or anywhere in the north, you sit on some of the strongest solar radiation on the planet. The same sun that makes the afternoon brutal is enough to power an entire compound for the whole night.' },
  { icon:'💡', text:'Most Nigerians just want to charge their phone, watch TV, feel a fan moving and keep their fridge cold. Those four things together use roughly 250 to 300 watts. Even a basic entry-level solar system handles that comfortably for hours.' },
  { icon:'❄️', text:'That 1.5HP AC pulling 1,200 watts is the number one reason solar systems disappoint buyers who skip the load calculation. One AC running all night can empty a mid-range battery before 3am. Know your load before you buy anything.' },
  { icon:'🏫', text:'Think about children studying at night. In homes without stable power, kids read by candlelight or under generator lighting switched off by 10pm. One small solar system changes that permanently for the life of the home.' },
  { icon:'🧊', text:'Every time NEPA takes light for hours, food spoils in the freezer. Businesses lose stock. Restaurants throw out ingredients. Solar keeps your freezer running through every outage, quietly saving you money you never track but always feel.' },
  { icon:'🏭', text:'Nigerian businesses lose an estimated $29 billion every year to bad electricity, according to the World Bank. That is enough to build six brand new international airports. That money is not missing, it is just going to fuel and lost productivity.' },
  { icon:'♻️', text:'Your generator will need a full overhaul within 3 to 4 years and will likely need replacing within 8 to 10. A quality lithium solar battery is still running at over 80 percent capacity after 8 to 10 years of daily use. One is a constant cost. The other is a one-time investment.' },
  { icon:'☀️', text:'The sun rises every single day in Nigeria without fail. It does not go on strike. It does not collapse the grid. It does not send a bill. It is the most reliable source of energy available to every Nigerian, completely free, every morning.' },
];

let currentDykFact = '';

(function initDyk() {
  const fact = dykFacts[Math.floor(Math.random() * dykFacts.length)];
  currentDykFact = fact.text;
  document.getElementById('dykText').textContent = fact.text;
  document.getElementById('dykIcon').textContent = fact.icon;
  setTimeout(() => {
    const btn = document.getElementById('dykClose');
    const x = document.getElementById('dykX');
    btn.disabled = false;
    btn.classList.add('ready');
    x.classList.add('pop');
    document.getElementById('dykProgress').style.stroke = '#00C853';
  }, 6000);
})();

function closeDyk() {
  if (!document.getElementById('dykClose').classList.contains('ready')) return;
  document.getElementById('dykCard').classList.add('closing');
  document.getElementById('dykOverlay').classList.add('closing');
  setTimeout(() => document.getElementById('dykOverlay').remove(), 500);
}

// ═══ SHARE — DYK ═══
function shareDyk(platform) {
  const siteUrl = window.location.hostname !== 'localhost' ? window.location.href : 'https://chibaikpower.vercel.app';
  const msg = `Solar fact from Chibaik Power: "${currentDykFact}" Learn more at ${siteUrl} ⚡`;
  if (platform === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  else if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg.substring(0, 280))}`, '_blank');
  else if (platform === 'copy') {
    navigator.clipboard.writeText(msg).then(() => {
      const btn = document.getElementById('dykCopyBtn');
      btn.textContent = '✅ Copied';
      setTimeout(() => btn.textContent = '📋 Copy', 2000);
    });
  }
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  renderPriceTabs();
  renderSolarMap();
  document.getElementById('waName').addEventListener('keydown', e => { if (e.key === 'Enter') sendWa(); });
  document.getElementById('fc-p').addEventListener('keydown', e => { if (e.key === 'Enter') calcFuel(); });
});
