// ═══ THEME (Light/Dark, follows system, manual override) ═══
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
  {
    n:'Starter Package', inv:'1kW Inverter',
    bat_li:'100Ah / 12V LiFePO4 Battery',      bWh_li:1200,
    bat_tu:'200Ah / 12V Tubular Battery',       bWh_tu:1000,
    ctrl_li:'20A MPPT Charge Controller',
    ctrl_tu:'20A MPPT Charge Controller',
    panelTotalW:500, max:1000
  },
  {
    n:'Standard Package', inv:'2kW Inverter',
    bat_li:'200Ah / 12V LiFePO4 Battery',      bWh_li:2400,
    bat_tu:'2 x 200Ah / 12V Tubular Batteries', bWh_tu:2000,
    ctrl_li:'40A MPPT Charge Controller',
    ctrl_tu:'40A MPPT Charge Controller',
    panelTotalW:1000, max:2000
  },
  {
    n:'Premium Package', inv:'3kW Hybrid Inverter',
    bat_li:'200Ah / 24V LiFePO4 Battery',      bWh_li:4800,
    bat_tu:'400Ah / 24V Tubular Battery',       bWh_tu:4000,
    ctrl_li:'Built-in (Hybrid Inverter)',
    ctrl_tu:'Built-in (Hybrid Inverter)',
    panelTotalW:1800, max:3000
  },
  {
    n:'Heavy Duty Package', inv:'5kW Hybrid Inverter',
    bat_li:'400Ah / 24V LiFePO4 Battery',      bWh_li:9600,
    bat_tu:'800Ah / 24V Tubular Battery',       bWh_tu:8000,
    ctrl_li:'Built-in (Hybrid Inverter)',
    ctrl_tu:'Built-in (Hybrid Inverter)',
    panelTotalW:3000, max:5000
  },
];

const sel = {};
let solarPanelW = 300;
let solarBattType = 'lithium';
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
      <div class="a-img">${getAppSVG(a.id)}</div>
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
  updateBattCompare();
  if (!matches.length) {
    grid.innerHTML = `<div class="no-match"><p>Your load of <strong>${totalLoad.toLocaleString()}W</strong> exceeds standard packages. Chat us directly and we will put together a custom system for you.</p></div>`;
    return;
  }
  const ref = Math.max(...matches.map(p => {
    const bWh = solarBattType === 'lithium' ? p.bWh_li : p.bWh_tu;
    return bWh / (totalLoad * 0.25);
  }));
  grid.innerHTML = matches.map(p => {
    const bat  = solarBattType === 'lithium' ? p.bat_li  : p.bat_tu;
    const bWh  = solarBattType === 'lithium' ? p.bWh_li  : p.bWh_tu;
    const ctrl = solarBattType === 'lithium' ? p.ctrl_li : p.ctrl_tu;
    const panelCount = Math.ceil(p.panelTotalW / solarPanelW);
    const panelStr   = `${panelCount} x ${solarPanelW}W Monocrystalline Panel${panelCount > 1 ? 's' : ''}`;
    const yH = bWh / totalLoad, fH = bWh / p.max, lH = bWh / (totalLoad * 0.3);
    const detail = `${p.inv}, ${bat}, ${panelStr}`;
    return `<div class="rcard" onclick="openWa('${p.n}','${p.n} (${detail})',${totalLoad})">
      <span class="rbadge bg-sol">Let There Be Light</span>
      <div class="r-title">${p.n}</div>
      <div class="pkg-specs">
        <div class="pkg-row"><span class="pi">⚡</span><strong>${p.inv}</strong></div>
        <div class="pkg-row"><span class="pi">🔋</span><strong>${bat}</strong></div>
        <div class="pkg-row"><span class="pi">🔌</span><strong>${ctrl}</strong></div>
        <div class="pkg-row"><span class="pi">🌞</span><strong>${panelStr}</strong></div>
      </div>
      <div class="dur-row"><div class="dur-lbl">Your Load (${totalLoad.toLocaleString()}W) <span>${fmtD(yH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(yH,ref)}%;background:linear-gradient(90deg,#FFD000,#FF8C00)"></div></div></div>
      <div class="dur-row"><div class="dur-lbl">Inverter Full Load (${p.max.toLocaleString()}W) <span>${fmtD(fH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(fH,ref)}%;background:linear-gradient(90deg,#FF4444,#FF8C00)"></div></div></div>
      <div class="dur-row" style="margin-bottom:12px"><div class="dur-lbl">Light Use (30% of load) <span>${fmtD(lH)}</span></div><div class="dur-track"><div class="dur-fill" style="width:${bW(lH,ref)}%;background:linear-gradient(90deg,#00C853,#00E676)"></div></div></div>
      <button class="rcta">Ask If Available</button></div>`;
  }).join('');
}

function setSolarPanel(w, btn) {
  solarPanelW = w;
  document.querySelectorAll('#panelBtns .sol-sel-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  buildSolRecs();
}

function setSolarBatt(type, btn) {
  solarBattType = type;
  document.querySelectorAll('#battBtns .sol-sel-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  buildSolRecs();
}

function updateBattCompare() {
  const el = document.getElementById('battCompare');
  if (!el) return;
  if (solarBattType === 'lithium') {
    el.innerHTML = `<div class="batt-info batt-info-li">
      <div class="batt-info-col"><h4>Lithium (LiFePO4) Advantages</h4>
        <div class="batt-info-item">Lasts 8 to 10 years with daily use</div>
        <div class="batt-info-item">Zero maintenance required</div>
        <div class="batt-info-item">Lighter and more compact</div>
        <div class="batt-info-item">Safe up to 90% depth of discharge</div>
        <div class="batt-info-item">Charges faster from solar panels</div>
      </div>
      <div class="batt-info-col"><h4>Lithium Disadvantages</h4>
        <div class="batt-info-item neg">Higher upfront cost than tubular</div>
      </div>
    </div>`;
  } else {
    el.innerHTML = `<div class="batt-info batt-info-tu">
      <div class="batt-info-col"><h4>Tubular (Lead-Acid) Advantages</h4>
        <div class="batt-info-item">Lower upfront cost</div>
        <div class="batt-info-item">Widely available across Nigeria</div>
        <div class="batt-info-item">Can be serviced and repaired locally</div>
      </div>
      <div class="batt-info-col"><h4>Tubular Disadvantages</h4>
        <div class="batt-info-item neg">Lasts only 3 to 5 years</div>
        <div class="batt-info-item neg">Needs water topping every 3 months</div>
        <div class="batt-info-item neg">Much heavier than lithium</div>
        <div class="batt-info-item neg">Only safe to 50% depth of discharge</div>
        <div class="batt-info-item neg">Must be in a ventilated space, produces gas when charging</div>
      </div>
    </div>`;
  }
}
function switchRTab(tab, btn) {
  document.querySelectorAll('.rtab').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.rpanel').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('rp-' + tab).classList.add('on');
}

// ═══ SHARE, CALC ═══
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

function initDyk() {
  const fact = dykFacts[Math.floor(Math.random() * dykFacts.length)];
  currentDykFact = fact.text;
  const textEl = document.getElementById('dykText');
  const iconEl = document.getElementById('dykIcon');
  if (textEl) textEl.textContent = fact.text;
  if (iconEl) iconEl.textContent = fact.icon;

  // enable close button after 5 seconds
  setTimeout(() => {
    const btn = document.getElementById('dykClose');
    const x   = document.getElementById('dykX');
    const prog = document.getElementById('dykProgress');
    if (btn) { btn.disabled = false; btn.classList.add('ready'); }
    if (x)   { x.classList.add('pop'); }
    if (prog) { prog.style.stroke = '#00C853'; }
  }, 6000);
}

function closeDyk() {
  const btn = document.getElementById('dykClose');
  if (!btn || !btn.classList.contains('ready')) return;
  const card    = document.getElementById('dykCard');
  const overlay = document.getElementById('dykOverlay');
  if (card)    card.classList.add('closing');
  if (overlay) overlay.classList.add('closing');
  setTimeout(() => { if (overlay) overlay.remove(); }, 500);
}

// ═══ SHARE, DYK ═══
function shareDyk(platform) {
  if (!currentDykFact) { alert('No fact loaded yet.'); return; }
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
  document.getElementById('waName').addEventListener('keydown', e => { if (e.key === 'Enter') sendWa(); });
  document.getElementById('fc-p').addEventListener('keydown', e => { if (e.key === 'Enter') calcFuel(); });
});

// ═══ GENERATOR LIVE COUNTER ═══
const GEN_PER_SEC = 440277; // ₦38 billion ÷ 86,400 seconds = ₦440,277 per second

function fmtCounter(n) {
  if (n >= 1e12) return '₦' + (n / 1e12).toFixed(2) + ' Trillion';
  if (n >= 1e9)  return '₦' + (n / 1e9).toFixed(2)  + ' Billion';
  if (n >= 1e6)  return '₦' + (n / 1e6).toFixed(1)  + ' Million';
  return '₦' + Math.round(n).toLocaleString();
}

function updateGenCounter() {
  const todayEl = document.getElementById('genToday');
  const monthEl = document.getElementById('genMonth');
  const yearEl  = document.getElementById('genYear');
  if (!todayEl) return;

  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);

  const secToday  = (now - midnight) / 1000;
  const today     = secToday * GEN_PER_SEC;
  const month     = (now.getDate() - 1) * 38e9 + today;
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 1)) / 86400000);
  const year      = dayOfYear * 38e9 + today;

  todayEl.textContent = fmtCounter(today);
  monthEl.textContent = fmtCounter(month);
  yearEl.textContent  = fmtCounter(year);
}

updateGenCounter();
setInterval(updateGenCounter, 1000);

// ═══ SCROLL PROGRESS BAR ═══
window.addEventListener('scroll', () => {
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById('scrollProg').style.width = ((scrolled / total) * 100) + '%';
}, { passive: true });

// ═══ HERO QUICK CALCULATOR ═══
const quickApps = [
  { name:'Lights',      icon:'💡', watts:45  },
  { name:'Ceiling Fan', icon:'🌀', watts:60  },
  { name:'TV 43"',      icon:'📺', watts:80  },
  { name:'Fridge',      icon:'🧊', watts:150 },
  { name:'DSTV',        icon:'📡', watts:20  },
  { name:'Laptop',      icon:'💻', watts:65  },
  { name:'AC 1HP',      icon:'❄️', watts:750 },
  { name:'Phones',      icon:'📱', watts:60  },
];

function renderHeroChips() {
  const el = document.getElementById('heroChips');
  if (!el) return;
  el.innerHTML = quickApps.map(a =>
    `<button class="hero-chip" data-watts="${a.watts}" onclick="toggleChip(this)">
      ${a.icon} ${a.name}<span class="chip-w">${a.watts}W</span>
    </button>`
  ).join('');
}

function toggleChip(btn) {
  btn.classList.toggle('on');
  updateHeroTotal();
}

function updateHeroTotal() {
  let total = 0;
  document.querySelectorAll('.hero-chip.on').forEach(c => { total += parseInt(c.dataset.watts); });
  const el = document.getElementById('heroTotal');
  if (!el) return;
  el.textContent = total.toLocaleString() + 'W';
  el.classList.add('bumped');
  setTimeout(() => el.classList.remove('bumped'), 250);
}

// ═══ CALC TOAST ═══
function showToast(msg) {
  const t = document.getElementById('calcToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ═══ HIDE/SHOW WA FLOAT WHEN CALC IS OPEN ═══
const _openCalc = openCalc;
openCalc = function() {
  _openCalc();
  document.getElementById('waFloat')?.classList.add('hide');
};
const _closeCalc = closeCalc;
closeCalc = function() {
  _closeCalc();
  document.getElementById('waFloat')?.classList.remove('hide');
};

// Patch showRes to fire toast
const _showRes = showRes;
showRes = function() {
  _showRes();
  setTimeout(() => showToast('⚡ ' + totalLoad.toLocaleString() + 'W load, here are your options'), 400);
};

// ═══ INIT NEW FEATURES ═══
document.addEventListener('DOMContentLoaded', () => {
  renderHeroChips();
});


// ═══ CUSTOM APPLIANCE SVG ILLUSTRATIONS ═══
const svgMap = {

  'bulb-led': `<svg viewBox="0 0 80 80" fill="none"><path d="M40 10C25 10 15 22 15 34c0 10 7 17 13 22v6c0 2 2 4 5 4h14c3 0 5-2 5-4v-6c6-5 13-12 13-22C65 22 55 10 40 10z" stroke="#FFD000" stroke-width="2.5" stroke-linejoin="round" fill="rgba(255,208,0,.08)"/><line x1="30" y1="66" x2="30" y2="70" stroke="#FFD000" stroke-width="2"/><line x1="40" y1="66" x2="40" y2="70" stroke="#FFD000" stroke-width="2"/><line x1="50" y1="66" x2="50" y2="70" stroke="#FFD000" stroke-width="2"/><path d="M31 70v4c0 2 3 3 9 3s9-1 9-3v-4" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><path d="M29 28q3-6 8-7" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-linecap="round"/></svg>`,

  'bulb-cfl': `<svg viewBox="0 0 80 80" fill="none"><path d="M30 65V42q0-14-7-20-5-5-5-8 0-6 8-6 8 0 10 12h14q2-12 10-12 8 0 8 6 0 3-5 8-7 6-7 20v23" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)" stroke-linejoin="round"/><line x1="32" y1="65" x2="32" y2="69" stroke="#FFD000" stroke-width="2"/><line x1="40" y1="65" x2="40" y2="69" stroke="#FFD000" stroke-width="2"/><line x1="48" y1="65" x2="48" y2="69" stroke="#FFD000" stroke-width="2"/><path d="M33 69v4c0 2 3 3 7 3s7-1 7-3v-4" stroke="#FFD000" stroke-width="2"/></svg>`,

  'flood': `<svg viewBox="0 0 80 80" fill="none"><rect x="20" y="24" width="40" height="28" rx="4" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="40" cy="38" r="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.12)"/><circle cx="40" cy="38" r="5" fill="rgba(255,208,0,.3)"/><rect x="32" y="14" width="16" height="10" rx="2" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><line x1="40" y1="8" x2="40" y2="14" stroke="#FFD000" stroke-width="2.5" stroke-linecap="round"/><line x1="22" y1="52" x2="18" y2="62" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/><line x1="58" y1="52" x2="62" y2="62" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/></svg>`,

  'strip': `<svg viewBox="0 0 80 80" fill="none"><rect x="6" y="32" width="68" height="16" rx="4" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="18" cy="40" r="4" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.25)"/><circle cx="30" cy="40" r="4" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.2)"/><circle cx="42" cy="40" r="4" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.3)"/><circle cx="54" cy="40" r="4" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.2)"/><circle cx="66" cy="40" r="4" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.25)"/><path d="M6 36q0-8 8-10l58 0" stroke="#FFD000" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/></svg>`,

  'fan-c': `<svg viewBox="0 0 80 80" fill="none"><line x1="40" y1="6" x2="40" y2="16" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="40" r="9" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.12)"/><circle cx="40" cy="40" r="3" fill="#FFD000"/><ellipse cx="40" cy="22" rx="9" ry="14" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><ellipse cx="58" cy="40" rx="14" ry="9" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><ellipse cx="40" cy="58" rx="9" ry="14" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><ellipse cx="22" cy="40" rx="14" ry="9" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/></svg>`,

  'fan-s': `<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="26" r="20" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.06)"/><circle cx="40" cy="26" r="13" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.04)"/><circle cx="40" cy="26" r="5" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.2)"/><line x1="40" y1="6" x2="40" y2="46" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="20" y1="26" x2="60" y2="26" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="26" y1="12" x2="54" y2="40" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="54" y1="12" x2="26" y2="40" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="40" y1="46" x2="40" y2="64" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><path d="M24 64q0 8 16 10q16-2 16-10" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/></svg>`,

  'fan-t': `<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="30" r="17" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.06)"/><circle cx="40" cy="30" r="11" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.04)"/><circle cx="40" cy="30" r="4" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.2)"/><line x1="40" y1="13" x2="40" y2="47" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="23" y1="30" x2="57" y2="30" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="40" y1="47" x2="40" y2="58" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><rect x="22" y="58" width="36" height="10" rx="4" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.08)"/></svg>`,

  'fan-e': `<svg viewBox="0 0 80 80" fill="none"><rect x="10" y="10" width="60" height="60" rx="8" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.06)"/><circle cx="40" cy="40" r="22" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.04)"/><circle cx="40" cy="40" r="6" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.15)"/><line x1="40" y1="18" x2="40" y2="62" stroke="#FFD000" stroke-width="1" opacity=".3"/><line x1="18" y1="40" x2="62" y2="40" stroke="#FFD000" stroke-width="1" opacity=".3"/><line x1="24" y1="24" x2="56" y2="56" stroke="#FFD000" stroke-width="1" opacity=".3"/><line x1="56" y1="24" x2="24" y2="56" stroke="#FFD000" stroke-width="1" opacity=".3"/></svg>`,

  'ac': `<svg viewBox="0 0 80 80" fill="none"><rect x="4" y="22" width="72" height="36" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="8" y="26" width="58" height="28" rx="4" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.04)"/><line x1="12" y1="36" x2="62" y2="36" stroke="#FFD000" stroke-width="1.5"/><line x1="12" y1="42" x2="62" y2="42" stroke="#FFD000" stroke-width="1.5"/><line x1="12" y1="48" x2="62" y2="48" stroke="#FFD000" stroke-width="1.5"/><circle cx="70" cy="32" r="2.5" fill="#FFD000"/><circle cx="70" cy="40" r="2.5" fill="rgba(255,208,0,.3)"/><circle cx="70" cy="48" r="2.5" fill="rgba(255,208,0,.3)"/></svg>`,

  'fridge-m': `<svg viewBox="0 0 80 80" fill="none"><rect x="18" y="10" width="44" height="62" rx="5" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><line x1="18" y1="30" x2="62" y2="30" stroke="#FFD000" stroke-width="2"/><path d="M52 16v11" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><path d="M52 34v30" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><line x1="24" y1="72" x2="56" y2="72" stroke="#FFD000" stroke-width="1.5" opacity=".5"/></svg>`,

  'fridge': `<svg viewBox="0 0 80 80" fill="none"><rect x="14" y="6" width="52" height="68" rx="5" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><line x1="14" y1="28" x2="66" y2="28" stroke="#FFD000" stroke-width="2"/><path d="M54 12v12" stroke="#FFD000" stroke-width="3.5" stroke-linecap="round"/><path d="M54 32v36" stroke="#FFD000" stroke-width="3.5" stroke-linecap="round"/><line x1="20" y1="72" x2="60" y2="72" stroke="#FFD000" stroke-width="1.5" opacity=".4"/><line x1="20" y1="75" x2="60" y2="75" stroke="#FFD000" stroke-width="1.5" opacity=".4"/></svg>`,

  'freezer': `<svg viewBox="0 0 80 80" fill="none"><rect x="6" y="28" width="68" height="42" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><path d="M16 28l2-14h44l2 14" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><path d="M20 18h40" stroke="#FFD000" stroke-width="1.5"/><path d="M28 28q12-6 24 0" stroke="#FFD000" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="40" cy="52" r="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><line x1="40" y1="42" x2="40" y2="62" stroke="#FFD000" stroke-width="1.5" opacity=".4"/><line x1="30" y1="52" x2="50" y2="52" stroke="#FFD000" stroke-width="1.5" opacity=".4"/></svg>`,

  'tv': `<svg viewBox="0 0 80 80" fill="none"><rect x="6" y="14" width="68" height="42" rx="4" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="10" y="18" width="60" height="34" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.04)"/><path d="M30 56l-4 14h28l-4-14" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><line x1="18" y1="70" x2="62" y2="70" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><path d="M14 22q2-2 4 0" stroke="rgba(255,255,255,.25)" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="68" cy="34" r="2" fill="#FFD000"/></svg>`,

  'decoder': `<svg viewBox="0 0 80 80" fill="none"><rect x="8" y="26" width="64" height="28" rx="4" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="14" y="31" width="28" height="18" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.08)"/><line x1="16" y1="36" x2="40" y2="36" stroke="#FFD000" stroke-width="1.5" opacity=".5"/><line x1="16" y1="41" x2="40" y2="41" stroke="#FFD000" stroke-width="1.5" opacity=".5"/><line x1="16" y1="46" x2="40" y2="46" stroke="#FFD000" stroke-width="1.5" opacity=".5"/><circle cx="54" cy="40" r="6" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><circle cx="54" cy="40" r="2" fill="#FFD000"/><circle cx="66" cy="34" r="2" fill="#FFD000"/><circle cx="66" cy="40" r="2" fill="rgba(255,208,0,.3)"/><circle cx="66" cy="46" r="2" fill="rgba(255,208,0,.3)"/></svg>`,

  'sound': `<svg viewBox="0 0 80 80" fill="none"><rect x="14" y="8" width="52" height="64" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="40" cy="36" r="18" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.05)"/><circle cx="40" cy="36" r="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><circle cx="40" cy="36" r="4" fill="rgba(255,208,0,.35)"/><circle cx="40" cy="62" r="5" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.1)"/><circle cx="40" cy="62" r="2" fill="#FFD000"/><rect x="32" y="14" width="16" height="6" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.08)"/></svg>`,

  'console': `<svg viewBox="0 0 80 80" fill="none"><path d="M8 46q0 10 8 14l14 4q6 2 10-4q4 6 10 4l14-4q8-4 8-14L68 28q-2-8-10-8H22Q14 20 12 28z" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><line x1="22" y1="38" x2="22" y2="50" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="44" x2="28" y2="44" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/><circle cx="52" cy="38" r="3" stroke="#FFD000" stroke-width="1.5"/><circle cx="60" cy="42" r="3" stroke="#FFD000" stroke-width="1.5"/><circle cx="60" cy="34" r="3" stroke="#FFD000" stroke-width="1.5"/><circle cx="52" cy="46" r="3" stroke="#FFD000" stroke-width="1.5"/><rect x="34" y="24" width="12" height="8" rx="2" stroke="#FFD000" stroke-width="1.5"/></svg>`,

  'micro': `<svg viewBox="0 0 80 80" fill="none"><rect x="6" y="16" width="68" height="48" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="10" y="20" width="48" height="40" rx="4" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.04)"/><circle cx="34" cy="40" r="14" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.08)"/><circle cx="34" cy="40" r="7" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.12)"/><line x1="56" y1="22" x2="56" y2="58" stroke="#FFD000" stroke-width="1" opacity=".3"/><rect x="62" y="20" width="8" height="40" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.04)"/><circle cx="66" cy="30" r="3" stroke="#FFD000" stroke-width="1.5"/><circle cx="66" cy="40" r="3" fill="#FFD000"/><circle cx="66" cy="50" r="3" stroke="#FFD000" stroke-width="1.5"/><path d="M50 32h6" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/></svg>`,

  'kettle': `<svg viewBox="0 0 80 80" fill="none"><path d="M22 22q-4 18-2 36h36q2-18-2-36z" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)" stroke-linejoin="round"/><path d="M26 22h28q2-5 0-8H26q-2 3 0 8z" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><path d="M56 30q12-4 14-10" stroke="#FFD000" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M22 28Q10 36 10 44q0 10 12 10" stroke="#FFD000" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="60" rx="22" ry="5" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/></svg>`,

  'blender': `<svg viewBox="0 0 80 80" fill="none"><path d="M28 14l-4 38h32l-4-38z" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)" stroke-linejoin="round"/><path d="M32 14h16q2-4 0-6H32q-2 2 0 6z" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><line x1="26" y1="26" x2="54" y2="26" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="25" y1="36" x2="55" y2="36" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="24" y1="46" x2="56" y2="46" stroke="#FFD000" stroke-width="1" opacity=".35"/><rect x="20" y="52" width="40" height="12" rx="4" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.1)"/><rect x="28" y="64" width="24" height="8" rx="3" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/></svg>`,

  'rice': `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="52" rx="28" ry="14" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><path d="M12 52V44q0-24 28-24q28 0 28 24v8" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><ellipse cx="40" cy="22" rx="16" ry="4" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.12)"/><line x1="40" y1="18" x2="40" y2="12" stroke="#FFD000" stroke-width="2.5" stroke-linecap="round"/><path d="M36 12l4-4 4 4" stroke="#FFD000" stroke-width="2" stroke-linejoin="round" fill="none"/><line x1="54" y1="50" x2="60" y2="50" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/></svg>`,

  'iron': `<svg viewBox="0 0 80 80" fill="none"><path d="M10 56V46q0-10 12-14h40q12 0 10 12l-8 12z" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)" stroke-linejoin="round"/><path d="M26 32V26q0-4 6-4h16q6 0 6 4v6" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><circle cx="40" cy="24" r="3" fill="rgba(255,208,0,.3)"/><circle cx="24" cy="50" r="2" fill="rgba(255,208,0,.4)"/><circle cx="32" cy="50" r="2" fill="rgba(255,208,0,.4)"/><circle cx="40" cy="50" r="2" fill="rgba(255,208,0,.4)"/><circle cx="48" cy="50" r="2" fill="rgba(255,208,0,.4)"/></svg>`,

  'toaster': `<svg viewBox="0 0 80 80" fill="none"><rect x="10" y="34" width="60" height="32" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="22" y="22" width="14" height="20" rx="3" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><rect x="44" y="22" width="14" height="20" rx="3" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><line x1="26" y1="26" x2="32" y2="26" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/><line x1="48" y1="26" x2="54" y2="26" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/><circle cx="62" cy="46" r="5" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.08)"/><circle cx="62" cy="46" r="2" fill="#FFD000"/><line x1="14" y1="44" x2="48" y2="44" stroke="#FFD000" stroke-width="1.5" opacity=".4"/></svg>`,

  'cooker': `<svg viewBox="0 0 80 80" fill="none"><rect x="8" y="46" width="64" height="22" rx="5" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="28" cy="32" r="16" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="28" cy="32" r="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><circle cx="28" cy="32" r="5" fill="rgba(255,208,0,.25)"/><circle cx="60" cy="32" r="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><circle cx="60" cy="32" r="5" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.15)"/><circle cx="22" cy="57" r="4" stroke="#FFD000" stroke-width="1.5"/><circle cx="40" cy="57" r="4" fill="#FFD000"/><circle cx="58" cy="57" r="4" stroke="#FFD000" stroke-width="1.5"/></svg>`,

  'disp': `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="16" rx="16" ry="8" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.12)"/><path d="M24 16v6q0 4 16 4q16 0 16-4v-6" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><rect x="22" y="26" width="36" height="46" rx="4" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="40" cy="42" r="10" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.08)"/><rect x="28" y="54" width="10" height="7" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.1)"/><rect x="42" y="54" width="10" height="7" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.1)"/></svg>`,

  'induction': `<svg viewBox="0 0 80 80" fill="none"><rect x="8" y="24" width="64" height="40" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="40" cy="44" r="16" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.08)"/><circle cx="40" cy="44" r="10" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.12)"/><circle cx="40" cy="44" r="5" fill="rgba(255,208,0,.25)"/><rect x="12" y="28" width="18" height="6" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.08)"/><circle cx="64" cy="36" r="3" stroke="#FFD000" stroke-width="1.5"/><circle cx="64" cy="44" r="3" fill="#FFD000"/><circle cx="64" cy="52" r="3" stroke="#FFD000" stroke-width="1.5"/></svg>`,

  'laptop': `<svg viewBox="0 0 80 80" fill="none"><path d="M12 12h56l-3 38H15z" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)" stroke-linejoin="round"/><path d="M16 16h48l-3 30H19z" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.04)" stroke-linejoin="round"/><path d="M8 50h64l4 12H4z" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.08)" stroke-linejoin="round"/><rect x="28" y="54" width="24" height="4" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.1)"/><path d="M16 20q2-2 4 0" stroke="rgba(255,255,255,.25)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,

  'desktop': `<svg viewBox="0 0 80 80" fill="none"><rect x="8" y="8" width="64" height="44" rx="4" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="12" y="12" width="56" height="36" rx="2" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.04)"/><path d="M28 52l-4 12" stroke="#FFD000" stroke-width="2.5" stroke-linecap="round"/><path d="M52 52l4 12" stroke="#FFD000" stroke-width="2.5" stroke-linecap="round"/><line x1="18" y1="64" x2="62" y2="64" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><path d="M14 16q2-2 4 0" stroke="rgba(255,255,255,.25)" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="67" cy="28" r="2" fill="#FFD000"/></svg>`,

  'printer': `<svg viewBox="0 0 80 80" fill="none"><rect x="8" y="28" width="64" height="30" rx="5" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><path d="M18 28V14h44v14" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><rect x="22" y="18" width="36" height="10" rx="2" fill="rgba(255,208,0,.08)"/><path d="M22 48v14h36V48" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><line x1="28" y1="52" x2="52" y2="52" stroke="#FFD000" stroke-width="1.5"/><line x1="28" y1="56" x2="52" y2="56" stroke="#FFD000" stroke-width="1.5"/><circle cx="60" cy="38" r="3" fill="#FFD000"/><circle cx="52" cy="38" r="3" stroke="#FFD000" stroke-width="1.5"/></svg>`,

  'router': `<svg viewBox="0 0 80 80" fill="none"><rect x="10" y="44" width="60" height="22" rx="5" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><line x1="22" y1="44" x2="18" y2="18" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><line x1="40" y1="44" x2="40" y2="14" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><line x1="58" y1="44" x2="62" y2="18" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="16" r="3.5" fill="#FFD000"/><circle cx="40" cy="12" r="3.5" fill="#FFD000"/><circle cx="62" cy="16" r="3.5" fill="#FFD000"/><circle cx="20" cy="55" r="2.5" fill="#FFD000"/><circle cx="28" cy="55" r="2.5" fill="rgba(255,208,0,.3)"/><circle cx="36" cy="55" r="2.5" fill="rgba(255,208,0,.3)"/><line x1="48" y1="50" x2="64" y2="50" stroke="#FFD000" stroke-width="1.5"/><line x1="48" y1="55" x2="64" y2="55" stroke="#FFD000" stroke-width="1.5"/><line x1="48" y1="60" x2="64" y2="60" stroke="#FFD000" stroke-width="1.5"/></svg>`,

  'phone': `<svg viewBox="0 0 80 80" fill="none"><rect x="22" y="6" width="36" height="56" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="26" y="10" width="28" height="44" rx="3" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.04)"/><circle cx="40" cy="66" r="4" stroke="#FFD000" stroke-width="2"/><rect x="34" y="8" width="12" height="3" rx="1.5" fill="rgba(255,208,0,.2)"/><path d="M40 62v12q0 4-4 4" stroke="#FFD000" stroke-width="2" stroke-linecap="round" fill="none"/><rect x="28" y="74" width="16" height="6" rx="3" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.07)"/></svg>`,

  'cctv': `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="34" cy="32" rx="22" ry="16" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="30" cy="32" r="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><circle cx="30" cy="32" r="5" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.2)"/><circle cx="30" cy="32" r="2" fill="#FFD000"/><path d="M50 24l16-8v32l-16-8" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><path d="M34 48v14" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><line x1="20" y1="62" x2="48" y2="62" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/></svg>`,

  'pump': `<svg viewBox="0 0 80 80" fill="none"><rect x="14" y="28" width="40" height="28" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="34" cy="42" r="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><circle cx="34" cy="42" r="5" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.2)"/><circle cx="34" cy="42" r="2" fill="#FFD000"/><path d="M54 38h12v-8h8" stroke="#FFD000" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M54 46h12v8h8" stroke="#FFD000" stroke-width="3" stroke-linecap="round" fill="none"/><rect x="14" y="56" width="40" height="8" rx="3" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.08)"/></svg>`,

  'washer': `<svg viewBox="0 0 80 80" fill="none"><rect x="8" y="8" width="64" height="68" rx="6" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="8" y="8" width="64" height="18" rx="6" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><circle cx="22" cy="17" r="4" stroke="#FFD000" stroke-width="2"/><circle cx="35" cy="17" r="4" fill="#FFD000"/><rect x="48" y="12" width="18" height="10" rx="2" stroke="#FFD000" stroke-width="1.5"/><circle cx="40" cy="50" r="22" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.04)"/><circle cx="40" cy="50" r="16" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.08)"/><circle cx="40" cy="50" r="6" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.15)"/></svg>`,

  'hairdryer': `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="38" cy="30" rx="26" ry="18" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><circle cx="26" cy="30" r="12" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><circle cx="26" cy="30" r="6" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.15)"/><path d="M38 48q-4 4-8 12q-2 6 2 8q6 0 8-6l2-14" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)" stroke-linecap="round" stroke-linejoin="round"/><line x1="56" y1="24" x2="64" y2="20" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/><line x1="58" y1="30" x2="68" y2="30" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/><line x1="56" y1="36" x2="64" y2="40" stroke="#FFD000" stroke-width="2" stroke-linecap="round"/></svg>`,

  'heater': `<svg viewBox="0 0 80 80" fill="none"><rect x="24" y="10" width="32" height="56" rx="8" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><rect x="28" y="16" width="24" height="8" rx="3" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.1)"/><circle cx="40" cy="42" r="12" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.08)"/><circle cx="40" cy="42" r="6" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.15)"/><line x1="10" y1="60" x2="22" y2="60" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><line x1="58" y1="60" x2="70" y2="60" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><path d="M10 60q-4-2-4-6V34q0-6 4-6h12" stroke="#FFD000" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M58 28h12q4 0 4 6v20q0 4-4 6" stroke="#FFD000" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,

  'fryer': `<svg viewBox="0 0 80 80" fill="none"><path d="M14 42q0-22 26-22q26 0 26 22v14q0 14-26 14q-26 0-26-14z" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><ellipse cx="40" cy="42" rx="22" ry="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><ellipse cx="40" cy="40" rx="22" ry="10" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.08)"/><ellipse cx="40" cy="38" rx="16" ry="7" stroke="#FFD000" stroke-width="1.5" fill="rgba(255,208,0,.12)"/><circle cx="60" cy="54" r="5" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><circle cx="60" cy="54" r="2" fill="#FFD000"/><rect x="28" y="64" width="24" height="6" rx="3" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.08)"/></svg>`,

  'grinder': `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="20" rx="22" ry="8" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.1)"/><path d="M18 20v32q0 14 22 14q22 0 22-14V20" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><ellipse cx="40" cy="52" rx="22" ry="8" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/><line x1="22" y1="32" x2="58" y2="32" stroke="#FFD000" stroke-width="1" opacity=".35"/><line x1="22" y1="42" x2="58" y2="42" stroke="#FFD000" stroke-width="1" opacity=".35"/><path d="M34 66v8h12v-8" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.07)"/><line x1="28" y1="74" x2="52" y2="74" stroke="#FFD000" stroke-width="3" stroke-linecap="round"/><rect x="36" y="8" width="8" height="12" rx="2" stroke="#FFD000" stroke-width="2" fill="rgba(255,208,0,.1)"/></svg>`,

};

function getAppSVG(id) {
  return svgMap[id] || `<svg viewBox="0 0 80 80" fill="none"><rect x="10" y="10" width="60" height="60" rx="8" stroke="#FFD000" stroke-width="2.5" fill="rgba(255,208,0,.07)"/><text x="40" y="48" font-size="22" text-anchor="middle" fill="#FFD000" font-family="sans-serif" font-weight="bold">?</text></svg>`;
}

// ═══ REVIEW SECTION ═══
let reviewRating = 0;

function setRating(val) {
  reviewRating = val;
  document.querySelectorAll('.star-btn').forEach(btn => {
    btn.classList.toggle('on', parseInt(btn.dataset.val) <= val);
  });
}

function submitReview() {
  if (!reviewRating) { alert('Please select a star rating before sending.'); return; }
  const name  = document.getElementById('revName').value.trim();
  const state = document.getElementById('revState').value;
  const text  = document.getElementById('revText').value.trim();
  if (!text) { alert('Please write your review before sending.'); return; }
  const stars  = '★'.repeat(reviewRating) + '☆'.repeat(5 - reviewRating);
  const who    = name ? name : 'Anonymous';
  const loc    = state ? ` from ${state}` : '';
  const msg    = `Hi! I want to leave a review for Chibaik Power.\n\nName: ${who}${loc}\nRating: ${stars}\n\nReview: ${text}\n\n(You may share this on your website if you like)`;
  window.open(`https://wa.me/+2347057027857?text=${encodeURIComponent(msg)}`, '_blank');
}

// ═══ PANEL + BATTERY COUNTER ═══

const lithiumSizes = [
  { label:'2.4kWh',  kWh:2.4,  note:'Ideal for small apartments. Powers fan, TV, lights and phone charging for 4 to 6 hours.' },
  { label:'5kWh',    kWh:5,    note:'Most popular for Nigerian homes. Powers a small to medium home through a full night outage.' },
  { label:'7.68kWh', kWh:7.68, note:'Great for homes with a fridge plus other loads. Comfortable overnight backup.' },
  { label:'10kWh',   kWh:10,   note:'The sweet spot for medium to large homes. Can power an AC for several hours overnight.' },
  { label:'15kWh',   kWh:15,   note:'For large homes or businesses with heavy loads including multiple ACs.' },
];

const tubularSizes = [
  { label:'100Ah / 12V', kWh:1.0,  note:'Entry level. Good for lights, fan and TV only. Needs replacing every 3 to 4 years.' },
  { label:'150Ah / 12V', kWh:1.5,  note:'Handles small home loads comfortably. Widely available from most dealers in Nigeria.' },
  { label:'200Ah / 12V', kWh:2.0,  note:'The most common choice for Nigerian homes. Good balance of cost and capacity.' },
  { label:'220Ah / 12V', kWh:2.2,  note:'Slightly more capacity than 200Ah. Good if you want a little extra backup time.' },
];

let solarPanelW    = 300;
let solarBattType  = 'lithium';
let solarBattSizeKwh = 5;
let solarBattCount = 1;
let solarPanelCount = 2;

// Nigeria average peak sun hours
const PEAK_SUN_HOURS = 5;

function initBattSizes() {
  const list = solarBattType === 'lithium' ? lithiumSizes : tubularSizes;
  const el = document.getElementById('battSizeBtns');
  if (!el) return;
  // default to first size
  solarBattSizeKwh = list[0].kWh;
  el.innerHTML = list.map((s, i) =>
    `<button class="sol-sel-btn${i===0?' on':''}" onclick="setBattSize(${s.kWh},this)">${s.label}</button>`
  ).join('');
  updateCounterInsights();
}

function setBattSize(kwh, btn) {
  solarBattSizeKwh = kwh;
  document.querySelectorAll('#battSizeBtns .sol-sel-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  updateCounterInsights();
  buildSolRecs();
}

function changeBattCount(delta) {
  solarBattCount = Math.max(1, Math.min(8, solarBattCount + delta));
  document.getElementById('battCount').textContent = solarBattCount;
  updateCounterInsights();
  buildSolRecs();
}

function changePanelCount(delta) {
  solarPanelCount = Math.max(1, Math.min(20, solarPanelCount + delta));
  document.getElementById('panelCount').textContent = solarPanelCount;
  updateCounterInsights();
  buildSolRecs();
}

function setSolarPanel(w, btn) {
  solarPanelW = w;
  document.querySelectorAll('#panelBtns .sol-sel-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  updateCounterInsights();
  buildSolRecs();
}

function setSolarBatt(type, btn) {
  solarBattType = type;
  document.querySelectorAll('#battBtns .sol-sel-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  initBattSizes();
  updateBattCompare();
  buildSolRecs();
}

function updateCounterInsights() {
  // Battery total
  const totalKwh = (solarBattSizeKwh * solarBattCount).toFixed(1);
  const battEl = document.getElementById('battTotalKwh');
  if (battEl) {
    battEl.textContent = solarBattType === 'lithium'
      ? totalKwh + 'kWh'
      : (solarBattCount * solarBattSizeKwh).toFixed(1) + 'kWh';
  }

  // Battery backup insight
  const battInsightEl = document.getElementById('battInsight');
  if (battInsightEl && totalLoad > 0) {
    const usable = solarBattType === 'lithium'
      ? solarBattSizeKwh * solarBattCount * 0.9
      : solarBattSizeKwh * solarBattCount * 0.5;
    const hours = usable / (totalLoad / 1000);
    const battSizeList = solarBattType === 'lithium' ? lithiumSizes : tubularSizes;
    const sizeNote = battSizeList.find(s => s.kWh === solarBattSizeKwh)?.note || '';
    battInsightEl.innerHTML = `With <strong>${solarBattCount} x ${solarBattType === 'lithium' ? solarBattSizeKwh + 'kWh lithium' : (tubularSizes.find(s=>s.kWh===solarBattSizeKwh)?.label||'')}</strong> your backup at your current load (<strong>${totalLoad.toLocaleString()}W</strong>) is approximately <strong>${fmtD(hours)}</strong>. ${sizeNote}`;
    battInsightEl.classList.add('show');
  } else if (battInsightEl) {
    battInsightEl.classList.remove('show');
  }

  // Panel total
  const totalPanelW = solarPanelW * solarPanelCount;
  const panelWEl = document.getElementById('panelTotalW');
  if (panelWEl) panelWEl.textContent = totalPanelW.toLocaleString() + 'W';

  // Panel charge time insight
  const panelInsightEl = document.getElementById('panelInsight');
  if (panelInsightEl) {
    const totalBattKwh = solarBattSizeKwh * solarBattCount;
    const panelDailyKwh = (totalPanelW / 1000) * PEAK_SUN_HOURS;
    const chargeHours = totalBattKwh / (totalPanelW / 1000);
    const coveragePercent = Math.min(100, Math.round((panelDailyKwh / totalBattKwh) * 100));
    panelInsightEl.innerHTML = `<strong>${solarPanelCount} x ${solarPanelW}W panels</strong> generate <strong>${panelDailyKwh.toFixed(1)}kWh per day</strong> on average in Nigeria (based on 5 peak sun hours). At that rate, they can fully charge your <strong>${totalBattKwh.toFixed(1)}kWh of storage</strong> in approximately <strong>${fmtD(chargeHours)}</strong> of direct sun. They replenish <strong>${coveragePercent}%</strong> of your total battery capacity each sunny day.`;
    panelInsightEl.classList.add('show');
  }
}

// counter patches moved to DOMContentLoaded
