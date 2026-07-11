
const STORAGE_KEY = "suiviFitnessCompletV1";
const PIN_KEY = "suiviFitnessPinV1";


const defaultMuscle = [
	"Pecs", "Dos", "Épaules", "Quads", "Ischios", "Mollets", "Biceps", "Triceps"

];
const defaultExercises = [
  "Adducteurs",
  "Curl concentré",
  "Curl double poulie 6",
  "Curl double poulie 4",
  "Curl marteau",
  "Élévation frontale double poulie",
  "Élévation latérale haltères",
  "Élévation latérale poulie mid",
  "High cable fly",
  "Leg extension",
  "Leg press",
  "Leg curl allongé",
  "Mollets Perfect Squat",
  "Pec deck",
  "Pull-over",
  "Leg curl assis",
  "Smith incline bench press",
  "Dévellopé militaire Smith",
  "Dévellopé militaire haltères",
  "Smith shrug",
  "Squat",
  "Squat talons +",
  "Tirage rowing prise large",
  "Tirage unilatéral poulie basse",
  "Tirage unilatéral poulie haute",
  "Tirage vertical",
  "Trap rowing prise neutre",
  "Oiseau banc incliné",
  "Oiseau unilatéral poulie basse",
  "Oiseau unilatéral poulie haute",
  "Reverse Fly"
];

const defaultFoods = [
{name:"Petit Yoplait",kcal:87,prot:9,gluc:4,lip:3.8},
{name:"Œufs",kcal:65,prot:5.54,gluc:0.34,lip:4.4},
{name:"Patates",kcal:81,prot:1.8,gluc:17,lip:0.5},
{name:"Pates",kcal:359,prot:12.5,gluc:71.2,lip:2},
{name:"Riz",kcal:352,prot:7.5,gluc:78,lip:0.6},
{name:"Poulet",kcal:110,prot:22,gluc:0,lip:1.5},
{name:"Steak",kcal:123,prot:21,gluc:0,lip:4.1},
{name:"Whey isolate",kcal:364,prot:87,gluc:1.2,lip:0.8},
{name:"Légumes ratatouilles",kcal:19,prot:3.1,gluc:0.9,lip:0.5},
{name:"Flocons avoine",kcal:372,prot:13.5,gluc:58.7,lip:7},
{name:"Pomme",kcal:57,prot:0.5,gluc:12.5,lip:0.5},
{name:"Banane",kcal:91,prot:0,gluc:19.7,lip:0},
{name:"Crème de riz",kcal:324,prot:6.5,gluc:72,lip:0.8},
{name:"Noix de cajou",kcal:595,prot:19.3,gluc:22.6,lip:46.6},
{name:"Parmesan",kcal:396,prot:33,gluc:0,lip:29},
{name:"Jus de raisin",kcal:67,prot:0.2,gluc:16,lip:0},
{name:"Lait amande",kcal:15,prot:0.5,gluc:0.4,lip:1.2},
{name:"Confiture 66%",kcal:166,prot:1.6,gluc:39,lip:0.1},
{name:"Harris complet",kcal:105,prot:3.3,gluc:17,lip:2},
{name:"Fruits rouges",kcal:35,prot:1,gluc:5.8,lip:0},
{name:"Madeleine",kcal:116,prot:1.3,gluc:13,lip:7},
{name:"Mélange noix",kcal:494,prot:7.3,gluc:41,lip:33},
{name:"Mangue ananas",kcal:59,prot:0.6,gluc:12,lip:0.5},
{name:"Crousty chicken",kcal:212,prot:16,gluc:12,lip:11}
  
];

let state = load();
state.theme = "galaxy"; // forced galaxy only
let current = "home";
let unlocked = !localStorage.getItem(PIN_KEY);
let profileFormOpen = false;
let mealDetailsOpen = false;
let customFoodFormOpen = false;
let trainingDetailsOpen = false;
let homeLastTrainingOpen = false;
let weightChartRange = "90";
let weightHistoryOpen = false;

let weightD3ResizeObserver = null;
let d3Promise = null;
let weightD3VisibleDomain = null;
let weightD3ZoomTransform = null;
let weightD3RenderFrame = null;




const appThemes = [
  {
    id:"aqua",
    name:"Aqua Glow",
    desc:"Fond goutte d'eau, verre clair, cyan doux.",
    swatches:["#eaf9ff","#22d3ee","#8b5cf6"]
  },
  {
    id:"pearl",
    name:"Pearl White",
    desc:"Blanc premium, très propre, sans image.",
    swatches:["#ffffff","#dbeafe","#0f172a"]
  },
  {
    id:"dark",
    name:"Dark Tech",
    desc:"Noir bleuté, cyan/violet, mode cockpit.",
    swatches:["#07111f","#00d4ff","#7c3aed"]
  },
  {
    id:"sunset",
    name:"Sunset Energy",
    desc:"Clair, chaud, énergie kcal, orange/rose.",
    swatches:["#fff7ed","#fb923c","#e11d48"]
  },
  {
    id:"mint",
    name:"Mint Focus",
    desc:"Vert d'eau, frais, récupération et équilibre.",
    swatches:["#ecfdf5","#2dd4bf","#16a34a"]
  },
  {
    id:"galaxy",
    name:"Galaxie",
    desc:"Espace premium, cyan, violet et glow cosmique.",
    swatches:["#050816","#22d3ee","#a855f7"]
  }
];

function currentTheme(){
  return "galaxy";
}

function applyTheme(){
  document.body.dataset.theme = "galaxy";
}

function setTheme(){
  state.theme = "galaxy";
  save();
  applyTheme();
  render();
}

function themePickerHtml(){
  const active = currentTheme();
  return `<div class="card theme-card theme-card-compact">
    <div class="theme-compact-row">
      <div>
        <h2>Thème</h2>
        <p class="small">Ambiance visuelle de l'application.</p>
      </div>
      <select id="themeSelect" class="theme-select" onchange="setTheme(this.value)">
        ${appThemes.map(t => `
          <option value="${t.id}" ${active===t.id ? "selected" : ""}>${escapeHtml(t.name)}</option>
        `).join("")}
      </select>
    </div>
  </div>`;
}


function today(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }
function fmt(d){ if(!d) return ""; return new Date(d+"T00:00:00").toLocaleDateString("fr-FR"); }
function monthName(d){ return new Date(d+"T00:00:00").toLocaleDateString("fr-FR",{month:"long"}); }
function weekNumber(d){
  const date = new Date(d+"T00:00:00");
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(),0,1));
  return Math.ceil((((tmp-yearStart)/86400000)+1)/7);
}
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function defaultProfile(){
  return {pseudo:"", age:"", taille:"", activite:"1.20", sexe:"homme", objectifPoids:""};
}

function defaultSettings(){
  return {theme:"galaxy"};
}

function normalizeState(data){
  const base = {trainings:[], meals:[], weights:[], muscles:defaultMuscle, exercises:defaultExercises, foods:defaultFoods, profile:defaultProfile(), settings:defaultSettings()};
  const merged = Object.assign({}, base, data || {});
  merged.profile = Object.assign(defaultProfile(), merged.profile || {});
  merged.settings = Object.assign(defaultSettings(), merged.settings || {});
  if(!Array.isArray(merged.trainings)) merged.trainings = [];
  if(!Array.isArray(merged.meals)) merged.meals = [];
  if(!Array.isArray(merged.weights)) merged.weights = [];
  if(!Array.isArray(merged.muscles)) merged.muscles = defaultMuscle.slice();
  if(!Array.isArray(merged.exercises)) merged.exercises = defaultExercises.slice();
  if(!Array.isArray(merged.foods)) merged.foods = defaultFoods.slice();
  return merged;
}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try { return normalizeState(JSON.parse(raw)); } catch(e){}
  }
  return normalizeState({});
}

function isFutureDate(d){
  return d && d > today();
}

function checkNotFutureDate(d){
  if(isFutureDate(d)){
    alert("La date ne peut pas être supérieure à aujourd'hui.");
    return false;
  }
  return true;
}

function sum(arr, key){ return arr.reduce((a,b)=>a+(Number(b[key])||0),0); }

function render(){
  applyTheme();
  const app = document.getElementById("app");
  if(!unlocked){ app.innerHTML = lockScreen(); return; }
  app.innerHTML = `<div class="app">
    <h1>Suivi Fitness</h1>
    <div class="subtitle">Musculation · Nutrition · Poids</div>
    ${screenHtml()}
  </div>
  ${navHtml()}`;
  afterRender();
}

function lockScreen(){
  return `<div class="app lock"><div class="card" style="width:100%">
    <h2>Déverrouillage</h2>
    <p class="small">Entre ton code pour ouvrir l'application.</p>
    <input id="pinInput" type="password" inputmode="numeric" placeholder="Code">
    <button onclick="unlockApp()">Ouvrir</button>
  </div></div>`;
}
function unlockApp(){
  const pin = localStorage.getItem(PIN_KEY);
  const val = document.getElementById("pinInput").value;
  if(val === pin){ unlocked = true; render(); } else alert("Code incorrect");
}


function navIconSvg(id){
  const icons = {
    home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8v9.4a.8.8 0 0 1-.8.8h-5.1v-6.2H8.9V21H3.8a.8.8 0 0 1-.8-.8v-9.4Z"/></svg>`,
    weight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 4.2h9.6c1.5 0 2.8 1.1 3 2.6l1.1 9.7A3.2 3.2 0 0 1 17.7 20H6.3a3.2 3.2 0 0 1-3.2-3.5l1.1-9.7c.2-1.5 1.5-2.6 3-2.6Z"/><path d="M8.1 8.6a4.8 4.8 0 0 1 7.8 0"/><path d="M12 8.7v3.2"/></svg>`,
    meals: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 4v7.2c0 1.5 1 2.7 2.4 3V21"/><path d="M3.6 4v5.2"/><path d="M6.8 4v5.2"/><path d="M10 4v5.2"/><path d="M17.2 4c1.7 2 2.5 4.2 2.3 6.4-.2 2.3-1.2 3.8-2.8 4.5V21"/><path d="M16.8 4v10.8"/></svg>`,
    training: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4"/><path d="M6 8v8"/><path d="M9 11h6"/><path d="M18 8v8"/><path d="M21 10v4"/></svg>`,
    history: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17 9 12l3.2 3.2L20 6.8"/><path d="M15 6.8h5V12"/></svg>`,
    profile: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"/><path d="M4.8 21c.9-4.1 3.5-6.2 7.2-6.2s6.3 2.1 7.2 6.2"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>`
  };
  return icons[id] || "";
}


function navHtml(){
  const items = [
    ["home","Accueil"],
    ["weight","Poids"],
    ["meals","Repas"],
    ["training","Train"],
    ["history","Suivi"],
    ["profile","Profil"],
    ["settings","Menu"]
  ];

  return `<div class="nav nav-neon"><div class="nav-inner">${items.map(([id,label])=>
    `<button class="${current===id ? "active" : ""}" onclick="go('${id}')">
      <span class="nav-icon">${navIconSvg(id)}</span>
      <span class="nav-label">${label}</span>
    </button>`).join("")}</div></div>`;
}
function go(id){ current=id; render(); }

function screenHtml(){
  if(current==="home") return homeHtml();
  if(current==="training") return trainingHtml();
  if(current==="meals") return mealsHtml();
  if(current==="weight") return weightHtml();
  if(current==="history") return historyHtml();
  if(current==="profile") return profileHtml();
  if(current==="settings") return settingsHtml();
}

function lastWeight(){
  return state.weights.slice().sort((a,b)=>b.date.localeCompare(a.date))[0] || null;
}

function activityLabel(v){
  const labels = {
    "1.20":"Sédentaire",
    "1.375":"Peu actif",
    "1.55":"Modérément actif",
    "1.725":"Très actif",
    "1.90":"Travail physique + sport"
  };
  return labels[String(v)] || "-";
}

function bmrValue(){
  const profile = state.profile || defaultProfile();
  const w = lastWeight();
  const poids = w ? Number(w.poids) : 0;
  const taille = Number(profile.taille);
  const age = Number(profile.age);
  if(!poids || !taille || !age) return null;
  const sexeOffset = profile.sexe === "femme" ? -161 : 5;
  return Math.round((10 * poids) + (6.25 * taille) - (5 * age) + sexeOffset);
}

function tdeeValue(){
  const bmr = bmrValue();
  const activity = Number((state.profile || defaultProfile()).activite || 1.20);
  return bmr ? Math.round(bmr * activity) : null;
}



function dayIconSvg(type){
  const icons = {
    poids: `<img class="day-stat-svg-icon" src="icons/icon_poids_3d_glass.svg" alt="">`,
    kcal: `<img class="day-stat-svg-icon" src="icons/icon_kcal_3d_glass.svg" alt="">`,
    proteines: `<img class="day-stat-svg-icon" src="icons/icon_proteines_3d_glass.svg" alt="">`
  };
  return icons[type] || "";
}


function compactKgNumber(v){
  if(v === null || v === undefined || Number.isNaN(Number(v))) return "-";
  const n = Number(v);
  const digits = Math.abs(n - Math.round(n)) < 0.05 ? 0 : 1;
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits:digits,
    maximumFractionDigits:digits
  });
}

function signedCompactKg(v){
  if(v === null || v === undefined || Number.isNaN(Number(v))) return "—";
  const n = Number(v);
  const sign = n > 0 ? "+" : "";
  return sign + n.toLocaleString("fr-FR", {
    minimumFractionDigits:1,
    maximumFractionDigits:1
  }) + " kg";
}

function weightSparklineSvg(rows){
  const values = rows
    .slice(-14)
    .map(r => Number(r.poids))
    .filter(v => Number.isFinite(v));

  if(values.length < 2){
    return `<svg class="weight-mini-sparkline" viewBox="0 0 300 82" aria-hidden="true">
      <path class="spark-area" d="M0 55 C45 42 70 66 110 50 S190 42 230 55 S275 40 300 28 V82 H0 Z"/>
      <path class="spark-line" d="M0 55 C45 42 70 66 110 50 S190 42 230 55 S275 40 300 28"/>
      <circle class="spark-dot" cx="300" cy="28" r="4"/>
    </svg>`;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(0.1, max - min);

  const pts = values.map((v,i) => {
    const x = values.length === 1 ? 0 : (i / (values.length - 1)) * 300;
    const y = 70 - ((v - min) / range) * 48;
    return [x, y];
  });

  const line = pts.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const first = pts[0];
  const last = pts[pts.length - 1];
  const area = `M${first[0].toFixed(1)},82 L${line.replaceAll(" ", " L")} L${last[0].toFixed(1)},82 Z`;

  return `<svg class="weight-mini-sparkline" viewBox="0 0 300 82" aria-hidden="true">
    <polygon class="spark-area" points="${first[0].toFixed(1)},82 ${line} ${last[0].toFixed(1)},82"/>
    <polyline class="spark-line" points="${line}"/>
    <circle class="spark-dot" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4"/>
  </svg>`;
}

function weightGalaxyIcon(){
  return `<svg class="galaxy-weight-icon" viewBox="0 0 96 76" aria-hidden="true">
    <defs>
      <linearGradient id="gwEdge" x1="0" y1="0" x2="96" y2="76">
        <stop offset="0" stop-color="#e9d5ff"/>
        <stop offset=".45" stop-color="#8b5cf6"/>
        <stop offset="1" stop-color="#22d3ee"/>
      </linearGradient>
      <radialGradient id="gwDial" cx="50%" cy="38%" r="55%">
        <stop offset="0" stop-color="#dffbff"/>
        <stop offset=".38" stop-color="#7c3aed"/>
        <stop offset="1" stop-color="#100a2f"/>
      </radialGradient>
    </defs>
    <rect x="9" y="10" width="78" height="54" rx="15" fill="rgba(9,12,40,.55)" stroke="url(#gwEdge)" stroke-width="3"/>
    <path d="M22 45h52" stroke="#22d3ee" stroke-opacity=".24" stroke-width="2"/>
    <circle cx="48" cy="29" r="16" fill="url(#gwDial)" stroke="#d8b4fe" stroke-width="3"/>
    <path d="M48 29v-14" stroke="#f8fbff" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="48" cy="29" r="4" fill="#22d3ee"/>
    <path d="M31 54h34" stroke="#a855f7" stroke-width="3" stroke-linecap="round" opacity=".75"/>
  </svg>`;
}

function renderWeightGalaxyDayCard(){
  const rows = state.weights.slice().sort((a,b)=>a.date.localeCompare(b.date));
  const latest = rows[rows.length - 1] || null;
  const current = latest ? Number(latest.poids) : null;
  const previous = rows.length > 1 ? Number(rows[rows.length - 2].poids) : null;
  const deltaDay = current !== null && Number.isFinite(previous) ? +(current - previous).toFixed(1) : null;
  const delta7 = getDeltaFromDays(rows, 7);
  const delta30 = getDeltaFromDays(rows, 30);

  const deltaItems = [
    ["jour", deltaDay],
    ["7j", delta7],
    ["30j", delta30]
  ];

  return `<div class="day-stat day-stat-weight-galaxy">
    <div class="weight-stars"></div>

    <div class="weight-galaxy-head">
      <span class="weight-galaxy-icon">${weightGalaxyIcon()}</span>
      <span class="weight-galaxy-label">Poids</span>
    </div>

    <div class="weight-galaxy-value">
      <strong>${current !== null ? compactKgNumber(current) : "-"}</strong>
      <span>kg</span>
    </div>

    ${weightSparklineSvg(rows)}

    <div class="weight-delta-cycle">
      ${deltaItems.map(([label, value], i) => `
        <div class="weight-delta-item delta-${i + 1} ${value !== null && value <= 0 ? "down" : "up"}">
          <span class="delta-label">Δ ${label}</span>
          <strong>${signedCompactKg(value)}</strong>
        </div>
      `).join("")}
    </div>
  </div>`;
}


function progressPercent(total, target){
  const t = Number(target) || 0;
  if(!t) return 0;
  return Math.max(0, Math.min(100, Math.round((Number(total) || 0) / t * 100)));
}


function galaxyCardIcon(type){
  if(type === "weight"){
    return `<img src="icons/icon_poids_3d_glass.svg" alt="Poids">`;
  }

  if(type === "calories"){
    return `<svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M36 7c6 13-5 19 2 30 5-4 7-10 5-17 13 12 17 31 5 42-10 9-29 7-36-5-9-16 2-28 10-36 6-7 7-13 6-19 8 5 12 12 13 21 5-5 5-11-5-16Z" fill="currentColor"/>
    </svg>`;
  }

  return `<img src="icons/icon_proteines_3d_glass.svg" alt="Protéines">`;
}

function galaxySparkline(rows){
  const values = rows
    .slice()
    .sort((a,b)=>a.date.localeCompare(b.date))
    .slice(-12)
    .map(r => Number(r.poids))
    .filter(v => Number.isFinite(v));

  if(values.length < 2){
    return `<svg class="g-weight-spark" viewBox="0 0 220 48" aria-hidden="true">
      <polyline points="0,30 38,28 72,31 110,25 146,27 184,22 220,35"/>
    </svg>`;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(.1, max - min);

  const pts = values.map((v,i) => {
    const x = values.length === 1 ? 0 : (i / (values.length - 1)) * 220;
    const y = 37 - ((v - min) / range) * 26;
    return [x, y];
  });

  const line = pts.map(([x,y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return `<svg class="g-weight-spark" viewBox="0 0 220 48" aria-hidden="true">
    <polyline points="${line}"/>
  </svg>`;
}

function galaxyDeltaValue(value){
  if(value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  const sign = n > 0 ? "+" : "";
  return sign + n.toLocaleString("fr-FR", {minimumFractionDigits:1, maximumFractionDigits:1}) + " kg";
}

function renderGalaxyWeightCard(){
  const rows = state.weights.slice().sort((a,b)=>a.date.localeCompare(b.date));
  const latest = rows[rows.length - 1] || null;
  const current = latest ? Number(latest.poids) : null;
  const previous = rows.length > 1 ? Number(rows[rows.length - 2].poids) : null;
  const deltaDay = current !== null && Number.isFinite(previous) ? +(current - previous).toFixed(1) : null;
  const delta7 = getDeltaFromDays(rows, 7);
  const delta30 = getDeltaFromDays(rows, 30);

  return `<div class="g-day-card g-weight-card">
    <div class="g-card-bg"></div>
    <div class="g-card-head">
      <span class="g-card-icon g-icon-weight">${galaxyCardIcon("weight")}</span>
      <span class="g-card-title">Poids</span>
    </div>

    <div class="g-weight-main">
      <span class="g-weight-number">${current !== null ? compactKgNumber(current) : "-"}</span>
      <span class="g-weight-unit">kg</span>
    </div>

    <div class="g-weight-chart">${galaxySparkline(rows)}</div>

    <div class="g-delta-row">
      <div><span>Δ jour</span><strong>${galaxyDeltaValue(deltaDay)}</strong></div>
      <div><span>Δ 7j</span><strong>${galaxyDeltaValue(delta7)}</strong></div>
      <div><span>Δ 30j</span><strong>${galaxyDeltaValue(delta30)}</strong></div>
    </div>
  </div>`;
}


function renderGalaxyCaloriesCard(kcal, tdee){
  const total = Math.round(Number(kcal) || 0);
  const target = Number(tdee) || 0;
  const percent = target ? progressPercent(total, target) : 0;
  const remaining = target ? Math.max(0, Math.round(target - total)) : null;

  return `<div class="g-day-card g-calories-card g-calories-premium-card">
    <div class="g-card-bg"></div>

    <div class="g-card-head g-calories-head">
      <span class="g-card-icon g-icon-calories g-flame-orb"><img src="icons/icon_kcal_3d_glass.svg" alt="Calories"></span>
      <span class="g-card-title">Calories</span>
    </div>

    <div class="g-calories-main">
      <span class="g-calories-number">${total.toLocaleString("fr-FR")}</span>
      <span class="g-calories-unit">kcal</span>
    </div>

    <div class="g-calories-info">
      <span>Objectif : ${target ? target.toLocaleString("fr-FR") + " kcal" : "-"}</span>
      ${remaining !== null ? `<strong>Reste ${remaining.toLocaleString("fr-FR")} kcal</strong>` : ""}
    </div>

    <div class="g-calories-progress">
      <div class="g-calories-track"><span style="width:${percent}%"></span></div>
      <strong>${Math.round(percent)}%</strong>
    </div>
  </div>`;
}


function renderGalaxyProgressCard(type, title, value, unit, goalText, progress){
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  const kind = type === "calories" ? "calories" : "protein";
  return `<div class="g-day-card g-progress-card g-${kind}-card">
    <div class="g-card-bg"></div>
    <div class="g-card-head">
      <span class="g-card-icon g-icon-${kind}">${galaxyCardIcon(kind)}</span>
      <span class="g-card-title">${title}</span>
    </div>

    <div class="g-progress-main">
      <span class="g-progress-number">${value}</span>
      <span class="g-progress-unit">${unit}</span>
    </div>

    <div class="g-progress-goal">${goalText}</div>

    <div class="g-progress-bottom">
      <div class="g-progress-track"><span style="width:${safeProgress}%"></span></div>
      <strong>${Math.round(safeProgress)}%</strong>
    </div>
  </div>`;
}

function renderGalaxyDayStats(w, kcal, prot, tdee){
  const proteinGoal = w ? Math.round(Number(w.poids) * 2) : null;
  return `<div class="galaxy-day-grid">
    ${renderGalaxyWeightCard()}
    ${renderGalaxyCaloriesCard(kcal, tdee)}
    ${renderGalaxyProgressCard(
      "protein",
      "Protéines",
      Math.round(prot).toLocaleString("fr-FR"),
      "g",
      proteinGoal ? "Objectif : " + proteinGoal + " g" : "Objectif : -",
      proteinGoal ? progressPercent(prot, proteinGoal) : 0
    )}
  </div>`;
}

function renderClassicDayStats(w, kcal, prot, tdee){
  return `<div class="day-stats">
    ${dayStat("Poids", w ? w.poids+" kg" : "-", dayIconSvg("poids"))}
    ${dayStat("Calories", Math.round(kcal)+" kcal", dayIconSvg("kcal"), tdee ? "Objectif : " + tdee + " kcal" : "Objectif : -", tdee ? progressPercent(kcal, tdee) : 0)}
    ${dayStat("Protéines", Math.round(prot)+" g", dayIconSvg("proteines"), w ? "Objectif : " + Math.round(Number(w.poids) * 2) + " g" : "Objectif : -", w ? progressPercent(prot, Number(w.poids) * 2) : 0)}
  </div>`;
}


function dayStat(label, value, icon, goalText="", progress=null){
  return `
    <div class="day-stat">
      <div class="day-stat-top">
        <span class="day-stat-icon">${icon}</span>
        <span class="day-stat-label">${label}</span>
      </div>
      <div class="day-stat-value">${value}</div>
      ${goalText ? `<div class="day-stat-goal">${goalText}</div>` : ""}
      ${progress !== null ? `
        <div class="day-stat-progress">
          <span style="width:${progress}%"></span>
        </div>
      ` : ""}
    </div>
  `;
}


function toggleHomeLastTrainingDetails(){
  homeLastTrainingOpen = !homeLastTrainingOpen;
  render();
}

function renderHomeLastTrainingCard(){
  const sorted = state.trainings
    .slice()
    .sort((a,b) => b.date.localeCompare(a.date));

  if(!sorted.length){
    return `<div class="card home-last-training-card home-last-empty">
      <h2>Dernière séance effectuée</h2>
      <div class="home-empty-session">
        <div class="home-session-visual"></div>
        <div>
          <strong>Aucune donnée</strong>
          <p class="small">Ta dernière séance apparaîtra ici dès que tu ajoutes une série.</p>
        </div>
      </div>
    </div>`;
  }

  const lastDate = sorted[0].date;
  const rows = sorted.filter(t => t.date === lastDate);
  const exercisesCount = new Set(rows.map(t => t.exercice)).size;
  const muscles = [...new Set(rows.map(t => t.seance).filter(Boolean))];
  const mainMuscle = muscles.length ? muscles.join(", ") : "Séance";
  const volume = rows.reduce((acc,t) => acc + (Number(t.volume) || (Number(t.poids)||0) * (Number(t.repetitions)||0)), 0);

  const details = homeLastTrainingOpen
    ? `<div class="home-training-details">
        ${rows.map(t=>row(`${t.exercice}`, `${t.poids} kg x ${t.repetitions}`)).join("")}
      </div>`
    : "";

  return `<div class="card home-last-training-card home-last-premium">
    <h2>Dernière séance effectuée</h2>

    <div class="home-session-panel">
      <div class="home-session-visual"></div>

      <div class="home-session-content">
        <div class="home-session-date">📅 ${fmt(lastDate)}</div>
        <strong class="home-session-title">${escapeHtml(mainMuscle)}</strong>

        <div class="home-session-metrics">
          <span>🏋️ ${exercisesCount} exercice${exercisesCount > 1 ? "s" : ""}</span>
          <span>▮ ${Math.round(volume).toLocaleString("fr-FR")} kg volume</span>
          <span>${rows.length} série${rows.length > 1 ? "s" : ""}</span>
        </div>
      </div>

      <button type="button" class="home-session-detail-btn" onclick="toggleHomeLastTrainingDetails()">
        ${homeLastTrainingOpen ? "Masquer" : "Détail"} <span>›</span>
      </button>
    </div>

    ${details}
  </div>`;
}


function homeActionIconSvg(type){
  const icons = {
    weight: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14a2 2 0 0 1 2 2v13H3V6a2 2 0 0 1 2-2Z"/><path d="M8 8a4 4 0 0 1 8 0"/><path d="M12 8v3"/></svg>`,
    meals: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v8"/><path d="M4 3v5a3 3 0 0 0 6 0V3"/><path d="M7 11v10"/><path d="M16 3v18"/><path d="M16 3c3 1 4 4 4 7v2h-4"/></svg>`,
    training: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7v10M3 9v6M9 9v6M18 7v10M21 9v6M15 9v6M9 12h6"/></svg>`
  };
  return icons[type] || icons.training;
}

function homeProfileEditIconSvg(){
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20.2 4.6 16.9 14.9 6.6a2.1 2.1 0 0 1 3 0l.5.5a2.1 2.1 0 0 1 0 3L8.1 20.4 4 20.2Z"/><path d="m13.8 7.7 2.5 2.5"/><path d="M4 20h5.1"/></svg>`;
}

function renderHomeProfileBanner(w, kcal, prot, tdee){
  const profile = state.profile || defaultProfile();
  const name = (profile.pseudo || "").trim() || "sportif";
  const sexeLabel = profile.sexe === "femme" ? "Femme" : "Homme";
  const age = profile.age ? `${escapeHtml(profile.age)} ans` : "âge à compléter";
  const taille = profile.taille ? `${escapeHtml(profile.taille)} cm` : "taille à compléter";
  const poids = w ? `${escapeHtml(w.poids)} kg` : "poids à compléter";

  let status = "Ajoute tes données du jour pour suivre ta progression.";
  if(tdee){
    const remainingKcal = Math.max(0, Math.round(tdee - (Number(kcal) || 0)));
    const proteinTarget = Math.round((Number(w?.poids) || 0) * 2) || 0;
    const remainingProt = proteinTarget ? Math.max(0, Math.round(proteinTarget - (Number(prot) || 0))) : null;
    status = remainingProt !== null
      ? `Il te reste ${remainingKcal.toLocaleString("fr-FR")} kcal et ${remainingProt.toLocaleString("fr-FR")} g de protéines.`
      : `Il te reste ${remainingKcal.toLocaleString("fr-FR")} kcal aujourd'hui.`;
  }

  return `<div class="card home-profile-banner">
    <div class="home-profile-avatar">👤</div>
    <div class="home-profile-main">
      <h2>Bonjour, ${escapeHtml(name)}</h2>
      <div class="home-profile-meta">${sexeLabel} · ${age} · ${taille} · ${poids}</div>
      <div class="home-profile-status">${status}</div>
    </div>
    <span class="home-profile-link" role="button" tabindex="0" onclick="go('profile')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();go('profile');}" aria-label="Modifier le profil" title="Modifier le profil">${homeProfileEditIconSvg()}</span>
  </div>`;
}

function homeHtml(){
  const todayMeals = state.meals.filter(m=>m.date===today());
  const w = lastWeight();
  const kcal = sum(todayMeals,"kcal"), prot=sum(todayMeals,"prot");
  const tdee = tdeeValue();

  return `${renderHomeProfileBanner(w, kcal, prot, tdee)}

  <div class="home-section-title-row">
    <h2>Vue du jour</h2>
    <span>Mis à jour aujourd'hui</span>
  </div>

  <div class="card vue-jour-card home-vue-premium">
    ${renderGalaxyDayStats(w, kcal, prot, tdee)}
  </div>

  <div class="card home-quick-card home-section-card">
    <h2>Ajout rapide</h2>
    <div class="quick-actions-grid">
      <button type="button" class="home-quick-action galaxy-btn active" aria-current="true" onclick="go('weight')">
        <span class="btn-icon">${homeActionIconSvg("weight")}</span>
        <span class="btn-text">Poids</span>
      </button>
      <button type="button" class="home-quick-action galaxy-btn" onclick="go('meals')">
        <span class="btn-icon">${homeActionIconSvg("meals")}</span>
        <span class="btn-text">Repas</span>
      </button>
      <button type="button" class="home-quick-action galaxy-btn" onclick="go('training')">
        <span class="btn-icon">${homeActionIconSvg("training")}</span>
        <span class="btn-text">Série</span>
      </button>
    </div>
  </div>

  ${renderHomeLastTrainingCard()}`;
}

function toggleProfileForm(){
  profileFormOpen = !profileFormOpen;
  render();
}

function saveProfile(){
  state.profile = state.profile || defaultProfile();
  const age = Number(val("profileAge"));
  const taille = Number(val("profileTaille"));
  if(!age || age < 10 || age > 100) return alert("Âge invalide.");
  if(!taille || taille < 100 || taille > 230) return alert("Taille invalide.");
  state.profile.pseudo = val("profilePseudo") || "";
  state.profile.age = String(age);
  state.profile.taille = String(taille);
  state.profile.sexe = val("profileSexe") || "homme";
  state.profile.activite = val("profileActivite") || "1.20";
  profileFormOpen = false;
  save();
  render();
}

function stat(label,value){ return `<div class="stat"><div class="label">${label}</div><div class="value">${value}</div></div>`; }
function row(left, right, type=null, id=null){

  return `
    <div class="row">

      <div>
        <div>${left}</div>
        <strong>${right}</strong>
      </div>

      ${type && id ? `
        <div class="row-actions">
          <button class="icon-btn edit"
            onclick="editItem('${type}','${id}')">
            ✏️
          </button>

          <button class="icon-btn delete"
            onclick="deleteItem('${type}','${id}')">
            🗑️
          </button>
        </div>
      ` : ""}

    </div>
  `;
}

function trainingHtml(){
  return `<div class="card"><h2>Ajouter une série</h2>
    <label>Date</label><input id="trDate" type="date" value="${today()}" max="${today()}">
    <label>Séance</label><select id="trSeance"><option value="">-- Choisir une séance --</option>${state.muscles.map(m =>`<option>${m}</option>`).join("")}</select>
    <label>Type</label><select id="trType"><option>1</option><option selected>2</option><option>3</option><option>4</option></select>
    <label>Exercice</label>

	<div class="autocomplete">
	  <input
		id="trExercice"
		placeholder="Tape au moins 2 lettres..."
		oninput="filterExercises()"
		autocomplete="off"
	  >
	  <div id="exerciseSuggestions" class="suggestions"></div>
	</div>
    <div class="grid3">
      <div><label>Série</label><input id="trSerie" inputmode="numeric" value="1"></div>
      <div><label>Poids</label><input id="trPoids" inputmode="decimal" placeholder="kg"></div>
      <div><label>Reps</label><input id="trReps" inputmode="numeric" placeholder="reps"></div>
    </div>
    <button onclick="addTraining()">Ajouter la série</button>
  </div>
  <div class="card"><h2>Dernière fois sur cet exercice</h2><div id="lastExercise"></div></div>
  <div class="card"><h2>Séance du jour</h2><div id="todayTraining"></div></div>
  <div class="card"><h2>Ajouter exercice personnalisé</h2>
    <label>Nom</label><input id="exerciseName" placeholder="Nom exercice">
    <button class="secondary" onclick="addExercise()">Ajouter à la liste</button>
  </div>`;
}
function addTraining(){
  const item = {
    id:uid(), date:val("trDate"), seance:val("trSeance"), type:val("trType"), exercice:val("trExercice"),
    serie:Number(val("trSerie")), poids:Number(val("trPoids").replace(",",".")), repetitions:Number(val("trReps")),
  };
	if(!item.date || !item.seance || !item.exercice || !item.poids || !item.repetitions){
	  return alert("Remplis date, séance, exercice, poids et répétitions.");
	}

	if(!checkNotFutureDate(item.date)) return;

	if(!state.exercises.includes(item.exercice)){
	  return alert("Exercice inconnu.");
	}
  item.volume = item.poids*item.repetitions;
  item.semaine = weekNumber(item.date); item.mois = monthName(item.date);
  state.trainings.unshift(item); save();
  document.getElementById("trSerie").value = item.serie+1;
  document.getElementById("trPoids").value = ""; document.getElementById("trReps").value = "";
  showTodayTraining(); showLastExercise();
}
function showLastExercise(){
  const ex = val("trExercice");
  const rows = state.trainings.filter(t=>t.exercice===ex).sort((a,b)=>b.date.localeCompare(a.date));
  const box = document.getElementById("lastExercise");
  if(!rows.length){ box.innerHTML = `<p class="small">Aucun historique.</p>`; return; }
  const lastDate = rows[0].date;
  const same = rows.filter(t=>t.date===lastDate);
  box.innerHTML = `<div class="pill">${fmt(lastDate)}</div>` + same.map(t=>row(`Série ${t.serie}`, `${t.poids} kg x ${t.repetitions}`)).join("");
}
function showTodayTraining(){
  const d = document.getElementById("trDate")?.value || today();
  const rows = state.trainings.filter(t=>t.date===d);
  const box = document.getElementById("todayTraining");
  if(!box) return;

  if(!rows.length){
    box.innerHTML = `<p class="small">Aucune série aujourd'hui.</p>`;
    return;
  }

  const exercisesCount = new Set(rows.map(t => t.exercice)).size;
  const volume = rows.reduce((acc,t) => acc + (Number(t.volume) || (Number(t.poids)||0) * (Number(t.repetitions)||0)), 0);

  const summary = `
    <div class="training-summary">
      <span>${rows.length} série${rows.length > 1 ? "s" : ""}</span>
      <span>${exercisesCount} exercice${exercisesCount > 1 ? "s" : ""}</span>
      <span>${Math.round(volume)} kg volume</span>
    </div>
  `;

  const toggle = `
    <button type="button" class="detail-toggle" onclick="toggleTodayTrainingDetails()">
      ${trainingDetailsOpen ? "Masquer la séance" : "Détail séance"}
    </button>
  `;

  const details = trainingDetailsOpen
    ? `<div class="training-details-list">
        ${rows.map(t=>row(`${t.exercice}`, `${t.poids} kg x ${t.repetitions}`)).join("")}
      </div>`
    : "";

  box.innerHTML = summary + toggle + details;
}

function mealsHtml(){
  return `<div class="card"><h2>Ajouter un aliment</h2>
    <label>Date</label><input id="mealDate" type="date" value="${today()}" max="${today()}">
    <label>Repas</label><select id="mealRepas"><option>PETIT DEJ</option><option>MIDI</option><option>COLLATION</option><option>SOIR</option></select>
    <label>Aliment</label>

	<div class="autocomplete">
	  <input
		id="mealFood"
		placeholder="Tape au moins 2 lettres..."
		oninput="filterFoods()"
		autocomplete="off"
	  >
	  <div id="foodSuggestions" class="suggestions"></div>
	</div>
    <label>Quantité en g</label><input id="mealQte" inputmode="decimal" placeholder="ex: 240">
    <button onclick="addMeal()">Ajouter l'aliment</button>
  </div>
  <div class="card"><h2>Totaux du jour</h2><div id="todayMeals"></div></div>
  <div class="card collapsible-card">
    <h2 class="collapsible-title" onclick="toggleCustomFoodForm()">
      <span>Ajouter aliment personnalisé</span>
      <span class="collapse-arrow">${customFoodFormOpen ? "▲" : "▼"}</span>
    </h2>
    ${customFoodFormOpen ? `
      <div class="collapsible-content">
        <label>Nom</label><input id="foodName" placeholder="Nom aliment">
        <div class="grid2"><div><label>Kcal /100g</label><input id="foodKcal" inputmode="decimal"></div><div><label>Prot /100g</label><input id="foodProt" inputmode="decimal"></div></div>
        <div class="grid2"><div><label>Gluc /100g</label><input id="foodGluc" inputmode="decimal"></div><div><label>Lip /100g</label><input id="foodLip" inputmode="decimal"></div></div>
        <button class="secondary" onclick="addFood()">Ajouter à la liste</button>
      </div>
    ` : ""}
  </div>`;
}

function toggleCustomFoodForm(){
  customFoodFormOpen = !customFoodFormOpen;
  render();
}

function addMeal(){
  const food = state.foods.find(f=>f.name===val("mealFood"));
  const q = Number(val("mealQte").replace(",","."));
  if(!food || !q) return alert("Choisis un aliment et une quantité.");
  if(!checkNotFutureDate(val("mealDate"))) return;
  const factor = q/100;
  const item = {
    id:uid(), date:val("mealDate"), repas:val("mealRepas"), aliment:food.name, qte:q,
    kcal:+(food.kcal*factor).toFixed(1), prot:+(food.prot*factor).toFixed(1),
    gluc:+(food.gluc*factor).toFixed(1), lip:+(food.lip*factor).toFixed(1),
    semaine:weekNumber(val("mealDate")), mois:monthName(val("mealDate"))
  };
  state.meals.unshift(item); save();
  document.getElementById("mealQte").value="";
  showTodayMeals();
}
function addFood(){
  const f = {name:val("foodName").trim(), kcal:num("foodKcal"), prot:num("foodProt"), gluc:num("foodGluc"), lip:num("foodLip")};
  if(!f.name) return alert("Nom obligatoire.");
  if(state.foods.some(x => normalizeText(x.name) === normalizeText(f.name))){
    return alert("Cet aliment existe déjà.");
  }
  state.foods.push(f);
  customFoodFormOpen = false;
  save();
  render();
}
function addExercise(){
  const name = val("exerciseName").trim();
  if(!name) return alert("Nom obligatoire.");
  if(state.exercises.some(x => normalizeText(x) === normalizeText(name))){
    return alert("Cet exercice existe déjà.");
  }
  state.exercises.push(name);
  state.exercises.sort((a,b) => a.localeCompare(b, "fr"));
  save();
  alert("Exercice ajouté.");
  render();
}

function mealOrderValue(name){
  const order = {"PETIT DEJ":1, "MIDI":2, "COLLATION":3, "SOIR":4};
  return order[String(name || "").toUpperCase()] || 99;
}

function mealGroupTotals(rows){
  return {
    kcal: sum(rows,"kcal"),
    prot: sum(rows,"prot"),
    gluc: sum(rows,"gluc"),
    lip: sum(rows,"lip")
  };
}

function renderMealDetailsGrouped(rows){
  const groups = {};

  rows.forEach(m => {
    const key = m.repas || "AUTRE";
    if(!groups[key]) groups[key] = [];
    groups[key].push(m);
  });

  return Object.keys(groups)
    .sort((a,b) => mealOrderValue(a) - mealOrderValue(b))
    .map(repas => {
      const items = groups[repas];
      const total = mealGroupTotals(items);

      return `
        <div class="meal-group">
          <div class="meal-group-head">
            <strong>${escapeHtml(repas)}</strong>
            <span>${Math.round(total.kcal)} kcal · ${Math.round(total.prot)} g prot</span>
          </div>
          <div class="meal-group-items">
            ${items.map(m=>row(`${m.aliment}`, `${m.qte}g · ${m.kcal} kcal`,"meals",m.id)).join("")}
          </div>
        </div>
      `;
    })
    .join("");
}

function toggleTodayTrainingDetails(){
  trainingDetailsOpen = !trainingDetailsOpen;
  showTodayTraining();
}

function showTodayMeals(){
  const d = document.getElementById("mealDate")?.value || today();
  const rows = state.meals.filter(m=>m.date===d);
  const kcal=sum(rows,"kcal"), prot=sum(rows,"prot"), gluc=sum(rows,"gluc"), lip=sum(rows,"lip");
  const box = document.getElementById("todayMeals");
  if(!box) return;

  const detailToggle = rows.length ? `
    <button type="button" class="detail-toggle" onclick="toggleTodayMealDetails()">
      ${mealDetailsOpen ? "Masquer le détail" : "Détail"}
    </button>
  ` : "";

  const details = mealDetailsOpen
    ? `<div class="meal-details-list">${renderMealDetailsGrouped(rows)}</div>`
    : "";

  box.innerHTML = `
    <div class="grid2 today-meals-totals">
      ${stat("Kcal",Math.round(kcal))}
      ${stat("Prot",Math.round(prot)+" g")}
      ${stat("Gluc",Math.round(gluc)+" g")}
      ${stat("Lip",Math.round(lip)+" g")}
    </div>
    ${rows.length ? detailToggle + details : `<p class="small">Aucun aliment.</p>`}
  `;
}

function toggleTodayMealDetails(){
  mealDetailsOpen = !mealDetailsOpen;
  showTodayMeals();
}


function movingAverage(values, period){
  return values.map((_, i) => {
    const start = Math.max(0, i - period + 1);
    const slice = values.slice(start, i + 1).filter(v => Number.isFinite(v));
    if(!slice.length) return null;
    return slice.reduce((a,b)=>a+b,0) / slice.length;
  });
}

function formatKg(v, digits=1){
  if(v === null || v === undefined || Number.isNaN(Number(v))) return "-";
  return Number(v).toLocaleString("fr-FR", {
    minimumFractionDigits:digits,
    maximumFractionDigits:digits
  }) + " kg";
}

function signedKg(v, digits=1){
  if(v === null || v === undefined || Number.isNaN(Number(v))) return "-";
  const n = Number(v);
  const sign = n > 0 ? "+" : "";
  return sign + n.toLocaleString("fr-FR", {
    minimumFractionDigits:digits,
    maximumFractionDigits:digits
  }) + " kg";
}

function getWeightTarget(){
  const profile = state.profile || defaultProfile();
  return Number(String(profile.objectifPoids || "").replace(",", ".")) || null;
}

function setWeightRange(range){
  weightChartRange = range;
  weightD3VisibleDomain = null;
  weightD3ZoomTransform = null;

  document.querySelectorAll(".weight-range-tabs button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.range === range);
  });

  drawWeightChart();
}

function saveWeightTarget(){
  const input = document.getElementById("weightTargetInput");
  if(!input) return;
  state.profile = state.profile || defaultProfile();
  const raw = input.value.trim();
  if(raw && (!Number(raw.replace(",", ".")) || Number(raw.replace(",", ".")) <= 0)){
    alert("Objectif poids invalide.");
    return;
  }
  state.profile.objectifPoids = raw;
  save();
  render();
}

function filterRowsByRange(rows){
  const sorted = rows.slice().sort((a,b) => a.date.localeCompare(b.date));
  if(weightChartRange === "all") return sorted;

  const days = Number(weightChartRange);
  if(!days) return sorted.slice(-90);

  const end = sorted.length ? new Date(sorted[sorted.length - 1].date + "T00:00:00") : new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);

  return sorted.filter(r => new Date(r.date + "T00:00:00") >= start);
}


function toggleWeightHistory(){
  weightHistoryOpen = !weightHistoryOpen;
  render();
}


function lastNonNull(arr){
  for(let i = arr.length - 1; i >= 0; i--){
    if(arr[i] !== null && arr[i] !== undefined && Number.isFinite(Number(arr[i]))) return Number(arr[i]);
  }
  return null;
}

function getDeltaFromDays(rows, days){
  const sorted = rows.slice().sort((a,b)=>a.date.localeCompare(b.date));
  if(sorted.length < 2) return null;

  const latest = Number(sorted[sorted.length - 1].poids);
  const latestDate = new Date(sorted[sorted.length - 1].date + "T00:00:00");
  const targetTime = new Date(latestDate);
  targetTime.setDate(targetTime.getDate() - days);

  let candidate = null;
  for(let i = sorted.length - 2; i >= 0; i--){
    const d = new Date(sorted[i].date + "T00:00:00");
    if(d <= targetTime){
      candidate = Number(sorted[i].poids);
      break;
    }
  }

  if(candidate === null || !Number.isFinite(candidate)) return null;
  return +(latest - candidate).toFixed(1);
}

function trendText(delta, suffix){
  if(delta === null || delta === undefined || Number.isNaN(Number(delta))) return "—";
  const n = Number(delta);
  const arrow = n < 0 ? "↓" : n > 0 ? "↑" : "→";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString("fr-FR",{minimumFractionDigits:1,maximumFractionDigits:1})} kg ${suffix} ${arrow}`;
}

function weightSummaryIcon(type){
  if(type === "current") return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 11l1.8-2.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  if(type === "ma") return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13c2.2 0 2.2-4 4.4-4s2.2 4 4.4 4 2.2-4 4.4-4 2.2 4 4.4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}

function renderWeightSummaryCards(rows){
  const sorted = rows.slice().sort((a,b)=>a.date.localeCompare(b.date));
  const last = sorted[sorted.length - 1] || null;
  const weights = sorted.map(r => Number(r.poids));
  const ma7Arr = movingAverage(weights, 7);
  const ma30Arr = movingAverage(weights, 30);

  const current = last ? Number(last.poids) : null;
  const ma7 = lastNonNull(ma7Arr);
  const ma30 = lastNonNull(ma30Arr);
  const target = getWeightTarget();
  const delta7 = getDeltaFromDays(sorted, 7);
  const delta30 = getDeltaFromDays(sorted, 30);
  const gap = current !== null && target !== null ? +(current - target).toFixed(1) : null;

  return `
    <div class="weight-summary-strip">
      <div class="weight-summary-box box-current">
        <div class="weight-summary-icon">${weightSummaryIcon("current")}</div>
        <div class="weight-summary-label">Poids actuel</div>
        <div class="weight-summary-value">${current !== null ? formatKg(current) : "-"}</div>
        <div class="weight-summary-sub">Aujourd'hui</div>
      </div>

      <div class="weight-summary-box box-ma7">
        <div class="weight-summary-icon">${weightSummaryIcon("ma")}</div>
        <div class="weight-summary-label">MM 7j</div>
        <div class="weight-summary-value">${ma7 !== null ? formatKg(ma7) : "-"}</div>
        <div class="weight-summary-sub ${delta7 !== null && delta7 <= 0 ? "down" : "up"}">${trendText(delta7, "/ 7 j")}</div>
      </div>

      <div class="weight-summary-box box-ma30">
        <div class="weight-summary-icon">${weightSummaryIcon("ma")}</div>
        <div class="weight-summary-label">MM 30j</div>
        <div class="weight-summary-value">${ma30 !== null ? formatKg(ma30) : "-"}</div>
        <div class="weight-summary-sub ${delta30 !== null && delta30 <= 0 ? "down" : "up"}">${trendText(delta30, "/ 30 j")}</div>
      </div>

      <div class="weight-summary-box box-target">
        <div class="weight-summary-icon">${weightSummaryIcon("target")}</div>
        <div class="weight-summary-label">Écart objectif</div>
        <div class="weight-summary-value">${gap !== null ? signedKg(gap) : "-"}</div>
        <div class="weight-summary-sub ${gap !== null && gap <= 0 ? "down" : "up"}">${gap === null ? "Objectif non défini" : (gap > 0 ? "au-dessus" : gap < 0 ? "en-dessous" : "objectif atteint")}</div>
      </div>
    </div>
  `;
}


function renderWeightHero(rows){
  const sorted = rows.slice().sort((a,b)=>a.date.localeCompare(b.date));
  const last = sorted[0] || null;
  const delta30 = getDeltaFromDays(sorted, 30);
  const target = getWeightTarget();
  const current = last ? Number(last.poids) : null;
  const gap = current !== null && target !== null ? +(current - target).toFixed(1) : null;

  const trendClass = delta30 === null ? "" : delta30 <= 0 ? "good" : "bad";
  const trendLabel = delta30 === null ? "Tendance à venir" : delta30 < 0 ? "Tendance baissière" : delta30 > 0 ? "Tendance haussière" : "Stable";

  return `
    <div class="weight-hero">
      <div class="weight-hero-main">
        <span class="weight-hero-label">Poids actuel</span>
        <strong>${current !== null ? formatKg(current) : "-"}</strong>
        <small>${last ? fmt(last.date) : "Aucune pesée"}</small>
      </div>

      <div class="weight-hero-side">
        <div class="weight-hero-mini">
          <span>30 jours</span>
          <strong class="${trendClass}">${delta30 === null ? "-" : signedKg(delta30)}</strong>
        </div>
        <div class="weight-hero-mini">
          <span>Objectif</span>
          <strong>${target ? formatKg(target) : "-"}</strong>
        </div>
        <div class="weight-hero-mini">
          <span>Écart</span>
          <strong class="${gap !== null && gap <= 0 ? "good" : "bad"}">${gap === null ? "-" : signedKg(gap)}</strong>
        </div>
      </div>
    </div>
  `;
}

function weightHtml(){
  const rows = state.weights.slice().sort((a,b)=>b.date.localeCompare(a.date));
  const last = rows[0], prev = rows[1];
  const diff = last && prev ? (Number(last.poids)-Number(prev.poids)) : null;
  const target = getWeightTarget();

  return `<div class="card"><h2>Ajouter poids</h2>
    <label>Date</label><input id="wDate" type="date" value="${today()}" max="${today()}">
    <label>Poids</label><input id="wPoids" inputmode="decimal" placeholder="kg">
    <button onclick="addWeight()">Ajouter poids</button>
  </div>

  <div class="weight-premium-card">
    <div class="weight-premium-head">
      <div>
        <div class="weight-premium-kicker">Suivi du poids</div>
      </div>
      <div class="weight-target-box">
        <label>Objectif</label>
        <div class="weight-target-line">
          <input id="weightTargetInput" inputmode="decimal" placeholder="80" value="${target ? String(target).replace(".", ",") : ""}">
          <button type="button" onclick="saveWeightTarget()">OK</button>
        </div>
      </div>
    </div>


    ${renderWeightHero(rows)}

    <div class="weight-range-tabs">
      ${["7","30","90","365","all"].map(r => `
        <button type="button" data-range="${r}" class="${weightChartRange===r ? "active" : ""}" onclick="setWeightRange('${r}')">
          ${r==="7" ? "7j" : r==="30" ? "30j" : r==="90" ? "90j" : r==="365" ? "1A" : "Tout"}
        </button>
      `).join("")}
    </div>

    <div class="weight-chart-wrap d3-chart-wrap">
      <div id="weightD3Chart" class="weight-d3-chart"></div>
    </div>

    <div class="weight-legend">
      <span><i class="line real"></i>Poids</span>
      <span><i class="line ma7"></i>MM 7j</span>
      <span><i class="line ma30"></i>MM 30j</span>
      <span><i class="line target"></i>Objectif</span>
    </div>

    ${renderWeightSummaryCards(rows)}
  </div>

  <div class="card weight-history-card collapsible-card">
    <div class="collapsible-title weight-history-toggle" onclick="toggleWeightHistory()">
      <span>Historique</span>
      <span class="collapse-arrow">${weightHistoryOpen ? "▲" : "▼"}</span>
    </div>
    ${weightHistoryOpen 
      ? `<div class="collapsible-content weight-history-content">
          ${rows.slice(0,20).map(w=>row(fmt(w.date), w.poids+" kg", "weights", w.id)).join("") || `<p class="small">Aucune donnée.</p>`}
        </div>`
      : ""
    }
  </div>`;
}

function addWeight(){
  const item = {id:uid(), date:val("wDate"), poids:num("wPoids")};
  if(!item.date || !item.poids) return alert("Remplis date et poids.");
  if(!checkNotFutureDate(item.date)) return;
  state.weights.unshift(item); save(); render();
}

function historyHtml(){
  return `<div class="card"><h2>Historique</h2>
    <label>Type</label><select id="histType" onchange="renderHistory()"><option value="trainings">Entraînements</option><option value="meals">Repas</option><option value="weights">Poids</option></select>
    <label>Date optionnelle</label><input id="histDate" type="date" max="${today()}" onchange="renderHistory()">
    <div id="historyBox"></div>
  </div>`;
}
function renderHistory(){
  const type=val("histType"), d=val("histDate");
  let rows = state[type] || [];
  if(d) rows = rows.filter(x=>x.date===d);
  const box = document.getElementById("historyBox");
  if(type==="trainings")
  box.innerHTML = rows.slice(0,80).map(t=>
    row(
      `${fmt(t.date)} · ${t.exercice}`,
      `${t.poids} kg x ${t.repetitions}`,
      "trainings",
      t.id
    )
  ).join("") || `<p class="small">Aucune donnée.</p>`;
  if(type==="meals")
  box.innerHTML = rows.slice(0,80).map(m=>
    row(
      `${fmt(m.date)} · ${m.aliment}`,
      `${m.kcal} kcal`,
      "meals",
      m.id
    )
  ).join("") || `<p class="small">Aucune donnée.</p>`;
  if(type==="weights") box.innerHTML = rows.slice(0,80).map(w=>
	  row(
		fmt(w.date),
		`${w.poids} kg`,
		"weights",
		w.id
	  )
	).join("") || `<p class="small">Aucune donnée.</p>`;
}


function profileHtml(){
  const profile = state.profile || defaultProfile();
  const bmr = bmrValue();
  const tdee = tdeeValue();
  const sexeLabel = profile.sexe === "femme" ? "Femme" : "Homme";
  const activity = String(profile.activite || "1.20").replace(".", ",");
  const latestWeight = lastWeight();
  const profileSummary = profile.age && profile.taille
    ? `${sexeLabel} • ${escapeHtml(profile.age)} ans • ${escapeHtml(profile.taille)} cm • activité x${activity}`
    : "Profil incomplet";

  const profileForm = `
    <div class="profile-form profile-form-page">
      <label>Prénom / pseudo</label><input id="profilePseudo" placeholder="ex: Maxime" value="${escapeHtml(profile.pseudo || '')}">
      <div class="grid2">
        <div><label>Âge</label><input id="profileAge" inputmode="numeric" placeholder="ex: 35" value="${escapeHtml(profile.age)}"></div>
        <div><label>Taille en cm</label><input id="profileTaille" inputmode="numeric" placeholder="ex: 180" value="${escapeHtml(profile.taille)}"></div>
      </div>
      <label>Sexe</label><select id="profileSexe">
        <option value="homme" ${profile.sexe !== "femme" ? "selected" : ""}>Homme</option>
        <option value="femme" ${profile.sexe === "femme" ? "selected" : ""}>Femme</option>
      </select>
      <label>Niveau d'activité</label><select id="profileActivite">
        <option value="1.20" ${String(profile.activite)==="1.20" ? "selected" : ""}>Sédentaire · x1,20</option>
        <option value="1.375" ${String(profile.activite)==="1.375" ? "selected" : ""}>Peu actif · x1,375</option>
        <option value="1.55" ${String(profile.activite)==="1.55" ? "selected" : ""}>Modérément actif · x1,55</option>
        <option value="1.725" ${String(profile.activite)==="1.725" ? "selected" : ""}>Très actif · x1,725</option>
        <option value="1.90" ${String(profile.activite)==="1.90" ? "selected" : ""}>Travail physique + sport · x1,90</option>
      </select>
      <button class="green" onclick="saveProfile()">Enregistrer le profil</button>
    </div>`;

  return `<div class="card profile-hero-card">
    <h2>Profil utilisateur</h2>
    <p class="small">Tes informations servent à calculer ton métabolisme et tes objectifs calories.</p>
    <div class="profile-summary profile-summary-page">
      <span>👤 ${profileSummary}</span>
      <span>⚖️ Dernier poids : ${latestWeight ? escapeHtml(latestWeight.poids)+" kg" : "-"}</span>
    </div>
  </div>

  <div class="card"><h2>Informations personnelles</h2>
    ${profileForm}
  </div>

  <div class="card metabolism-card"><h2>Métabolisme</h2>
    <p class="small">Calcul Mifflin-St Jeor avec le dernier poids enregistré.</p>
    <div class="grid2">
      ${stat("Métabolisme basal", bmr ? bmr+" kcal" : "-")}
      ${stat("Dépense totale", tdee ? tdee+" kcal" : "-")}
    </div>
    ${tdee ? `<div class="grid3 metabolic-targets">
      ${stat("Perte -15%", Math.round(tdee*0.85)+" kcal")}
      ${stat("Maintien", tdee+" kcal")}
      ${stat("Masse +10%", Math.round(tdee*1.10)+" kcal")}
    </div>` : `<p class="small">Ajoute ton âge, ta taille, ton activité et au moins une pesée pour afficher le calcul.</p>`}
  </div>`;
}

function settingsHtml(){
  return `
  <div class="card"><h2>Code de verrouillage</h2>
    <p class="small">Le code protège l'ouverture sur ton téléphone. Il reste local.</p>
    <input id="pinNew" type="password" inputmode="numeric" placeholder="Nouveau code, ou vide pour supprimer">
    <button onclick="savePin()">Enregistrer le code</button>
  </div>
  <div class="card"><h2>Sauvegarde</h2>
    <button class="green" onclick="exportData()">Exporter mes données</button>
	<label>Importer JSON (fichier)</label><input type="file"id="fileImport"accept=".json"><button onclick="importFile()">Importer fichier JSON</button>
    <button class="danger" onclick="resetData()">Tout supprimer</button>
  </div>
  <div class="card"><h2>Listes disponibles</h2>
    <p class="small">Affiche les exercices ou les aliments enregistrés. Une seule liste s'affiche à la fois.</p>
    <div class="grid2 data-switch">
      <button id="btnDataExercises" class="secondary" onclick="showDataTable('exercises')">Exercices</button>
      <button id="btnDataFoods" class="secondary" onclick="showDataTable('foods')">Aliments</button>
    </div>
    <div id="dataTableBox" class="data-table-box"></div>
  </div>`;
}
function escapeHtml(v){
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let currentDataTable = null;

function setDataTableButtons(activeType){
  const btnExercises = document.getElementById("btnDataExercises");
  const btnFoods = document.getElementById("btnDataFoods");

  if(btnExercises){
    btnExercises.className = activeType === "exercises" ? "green" : "secondary";
  }
  if(btnFoods){
    btnFoods.className = activeType === "foods" ? "green" : "secondary";
  }
}

function showDataTable(type){
  const box = document.getElementById("dataTableBox");
  if(!box) return;

  if(currentDataTable === type){
    currentDataTable = null;
    box.innerHTML = "";
    setDataTableButtons(null);
    return;
  }

  currentDataTable = type;
  setDataTableButtons(type);

  if(type === "exercises"){
    const rows = state.exercises
      .slice()
      .sort((a,b) => a.localeCompare(b, "fr"));

    box.innerHTML = `
      <h3>Exercices disponibles (${rows.length})</h3>
      <div class="table-head data-exercise-head"><div>#</div><div>Exercice</div><div>Action</div></div>
      ${rows.map((e,i) => `
        <div class="table-row data-exercise-row">
          <div>${i + 1}</div>
          <div>${escapeHtml(e)}</div>
          <div><button class="icon-btn delete" onclick='deleteListItem("exercises", ${JSON.stringify(e)})'>🗑️</button></div>
        </div>
      `).join("") || `<p class="small">Aucun exercice.</p>`}
    `;
    return;
  }

  if(type === "foods"){
    const rows = state.foods
      .slice()
      .sort((a,b) => a.name.localeCompare(b.name, "fr"));

    box.innerHTML = `
      <h3>Aliments disponibles (${rows.length})</h3>
      <div class="table-head data-food-head"><div>Aliment</div><div>Kcal</div><div>Prot</div><div>Gluc</div><div>Lip</div><div>Action</div></div>
      ${rows.map(f => `
        <div class="table-row data-food-row">
          <div>${escapeHtml(f.name)}</div>
          <div>${escapeHtml(f.kcal)}</div>
          <div>${escapeHtml(f.prot)}</div>
          <div>${escapeHtml(f.gluc)}</div>
          <div>${escapeHtml(f.lip)}</div>
          <div><button class="icon-btn delete" onclick='deleteListItem("foods", ${JSON.stringify(f.name)})'>🗑️</button></div>
        </div>
      `).join("") || `<p class="small">Aucun aliment.</p>`}
    `;
  }
}

function deleteListItem(type, name){
  const cleanName = String(name || "").trim();
  if(!cleanName) return;

  if(type === "exercises"){
    const used = state.trainings.some(t => normalizeText(t.exercice) === normalizeText(cleanName));
    const msg = used
      ? `Cet exercice est utilisé dans ton historique. Le supprimer de la liste ne supprime pas tes anciennes séries. Continuer ?`
      : `Supprimer l'exercice "${cleanName}" ?`;
    if(!confirm(msg)) return;
    state.exercises = state.exercises.filter(e => normalizeText(e) !== normalizeText(cleanName));
  }

  if(type === "foods"){
    const used = state.meals.some(m => normalizeText(m.aliment) === normalizeText(cleanName));
    const msg = used
      ? `Cet aliment est utilisé dans ton historique. Le supprimer de la liste ne supprime pas tes anciens repas. Continuer ?`
      : `Supprimer l'aliment "${cleanName}" ?`;
    if(!confirm(msg)) return;
    state.foods = state.foods.filter(f => normalizeText(f.name) !== normalizeText(cleanName));
  }

  save();
  showDataTable(type);
}

function savePin(){
  const p=val("pinNew");
  if(p){ localStorage.setItem(PIN_KEY,p); alert("Code enregistré."); }
  else { localStorage.removeItem(PIN_KEY); alert("Code supprimé."); }
}
function exportData(){
  const text = JSON.stringify(state,null,2);
  navigator.clipboard?.writeText(text);
  const blob = new Blob([text],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url; a.download="suivi-fitness-"+today()+".json"; a.click();
  URL.revokeObjectURL(url);
}
function importFile(){

  const file = document.getElementById("fileImport").files[0];

  if(!file){
    alert("Choisis un fichier JSON");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e){
    try{
      const parsed = JSON.parse(e.target.result);
      const before = {
        weights: state.weights.length,
        trainings: state.trainings.length,
        meals: state.meals.length,
        exercises: state.exercises.length,
        foods: state.foods.length
      };

      if(Array.isArray(parsed.weights)){
        parsed.weights.forEach(w => {
          if(!state.weights.some(x => sameWeight(x, w))){
            state.weights.push(w);
          }
        });
      }

      if(Array.isArray(parsed.trainings)){
        parsed.trainings.forEach(t => {
          if(!state.trainings.some(x => sameTraining(x, t))){
            state.trainings.push(t);
          }
        });
      }

      if(Array.isArray(parsed.meals)){
        parsed.meals.forEach(m => {
          if(!state.meals.some(x => sameMeal(x, m))){
            state.meals.push(m);
          }
        });
      }

      if(Array.isArray(parsed.exercises)){
        parsed.exercises.forEach(ex => addUniqueExercise(ex));
      }

      if(Array.isArray(parsed.foods)){
        parsed.foods.forEach(f => addUniqueFood(f));
      }

      save();

      const added = {
        weights: state.weights.length - before.weights,
        trainings: state.trainings.length - before.trainings,
        meals: state.meals.length - before.meals,
        exercises: state.exercises.length - before.exercises,
        foods: state.foods.length - before.foods
      };

      alert(`Import réussi. Ajoutés : ${added.trainings} entraînements, ${added.meals} repas, ${added.weights} poids, ${added.exercises} exercices, ${added.foods} aliments.`);
      render();
    }
    catch(e){
      alert("Erreur JSON");
    }
  };

  reader.readAsText(file);

}

function normalizeText(v){ return String(v || "").trim().toLowerCase(); }
function normalizeNum(v){ return Number(String(v || 0).replace(",", ".")) || 0; }
function sameWeight(a, b){
  return a.id && b.id ? a.id === b.id : a.date === b.date && normalizeNum(a.poids) === normalizeNum(b.poids);
}
function sameTraining(a, b){
  return a.id && b.id ? a.id === b.id :
    a.date === b.date &&
    normalizeText(a.seance) === normalizeText(b.seance) &&
    normalizeText(a.type) === normalizeText(b.type) &&
    normalizeText(a.exercice) === normalizeText(b.exercice) &&
    normalizeNum(a.serie) === normalizeNum(b.serie) &&
    normalizeNum(a.poids) === normalizeNum(b.poids) &&
    normalizeNum(a.repetitions) === normalizeNum(b.repetitions);
}
function sameMeal(a, b){
  return a.id && b.id ? a.id === b.id :
    a.date === b.date &&
    normalizeText(a.repas) === normalizeText(b.repas) &&
    normalizeText(a.aliment) === normalizeText(b.aliment) &&
    normalizeNum(a.qte) === normalizeNum(b.qte) &&
    normalizeNum(a.kcal) === normalizeNum(b.kcal);
}
function addUniqueExercise(ex){
  const name = String(ex || "").trim();
  if(name && !state.exercises.some(x => normalizeText(x) === normalizeText(name))){
    state.exercises.push(name);
  }
}
function addUniqueFood(f){
  if(!f || !f.name) return;
  const name = String(f.name).trim();
  if(!name) return;
  const clean = {name, kcal:normalizeNum(f.kcal), prot:normalizeNum(f.prot), gluc:normalizeNum(f.gluc), lip:normalizeNum(f.lip)};
  const exists = state.foods.some(x => normalizeText(x.name) === normalizeText(name));
  if(!exists){
    state.foods.push(clean);
  }
}

function resetData(){
  if(confirm("Supprimer toutes les données ?")){
    state={trainings:[],meals:[],weights:[],exercises:defaultExercises,foods:defaultFoods};
    save(); render();
  }
}


function enableDatePickerFullClick(){
  document.querySelectorAll('input[type="date"]').forEach(input => {
    if(input.dataset.fullDatePicker === "1") return;
    input.dataset.fullDatePicker = "1";

    input.addEventListener("click", () => {
      if(typeof input.showPicker === "function"){
        try{ input.showPicker(); }catch(e){}
      }
    });

    input.addEventListener("focus", () => {
      if(typeof input.showPicker === "function"){
        try{ input.showPicker(); }catch(e){}
      }
    });
  });
}

function afterRender(){
  enableDatePickerFullClick();
  if(current==="training"){ showLastExercise(); showTodayTraining(); }
  if(current==="meals"){ showTodayMeals(); }
  if(current==="history"){ renderHistory(); }
  if(current==="weight"){ drawWeightChart(); }
}
function loadD3(){
  if(window.d3) return Promise.resolve(window.d3);

  if(d3Promise) return d3Promise;

  d3Promise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-d3="true"]');

    if(existing){
      existing.addEventListener("load", () => resolve(window.d3));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js";
    script.async = true;
    script.dataset.d3 = "true";

    script.onload = () => {
      if(window.d3) resolve(window.d3);
      else reject(new Error("D3 introuvable après chargement."));
    };

    script.onerror = () => reject(new Error("Impossible de charger D3. Connexion internet requise."));

    document.head.appendChild(script);
  });

  return d3Promise;
}

function clearWeightD3Chart(){
  if(weightD3ResizeObserver){
    weightD3ResizeObserver.disconnect();
    weightD3ResizeObserver = null;
  }

  const el = document.getElementById("weightD3Chart");
  if(el) el.innerHTML = "";
}

function formatDateShort(iso){
  if(!iso) return "";
  const parts = String(iso).split("-");
  if(parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}`;
}

function chartRowsForWeight(){
  return filterRowsByRange(
    state.weights
      .slice()
      .sort((a,b) => a.date.localeCompare(b.date))
  );
}

function renderWeightChartFallback(message){
  const el = document.getElementById("weightD3Chart");
  if(!el) return;

  el.innerHTML = `
    <div class="chart-fallback">
      <strong>Graphique indisponible</strong>
      <span>${message}</span>
    </div>
  `;
}

function calcVisibleWeightDomain(data){
  const values = [];

  data.forEach(d => {
    if(Number.isFinite(d.poids)) values.push(d.poids);
    if(Number.isFinite(d.ma7)) values.push(d.ma7);
    if(Number.isFinite(d.ma30)) values.push(d.ma30);
  });

  if(!values.length) return [0, 1];

  const minRaw = Math.min(...values);
  const maxRaw = Math.max(...values);
  const pad = Math.max(0.35, (maxRaw - minRaw) * 0.22);

  let min = Math.floor((minRaw - pad) * 10) / 10;
  let max = Math.ceil((maxRaw + pad) * 10) / 10;

  if(min === max){
    min -= 0.5;
    max += 0.5;
  }

  return [min, max];
}

function filterVisibleData(data, domain){
  if(!domain) return data;
  const [x0, x1] = domain;
  return data.filter(d => d.date >= x0 && d.date <= x1);
}

function weightTickCount(min, max){
  const span = Math.abs(max - min);
  if(span <= 2) return 5;
  if(span <= 5) return 6;
  return 7;
}


function clampWeightDomain(domain, fullDomain){
  const dayMs = 24 * 60 * 60 * 1000;
  const fullStart = +fullDomain[0];
  const fullEnd = +fullDomain[1];
  const fullSpan = Math.max(1, fullEnd - fullStart);
  const minSpan = Math.min(2 * dayMs, fullSpan);

  let start = +domain[0];
  let end = +domain[1];

  if(!Number.isFinite(start) || !Number.isFinite(end) || start >= end){
    return [new Date(fullStart), new Date(fullEnd)];
  }

  let span = end - start;

  if(span < minSpan){
    const mid = (start + end) / 2;
    start = mid - minSpan / 2;
    end = mid + minSpan / 2;
    span = minSpan;
  }

  if(span >= fullSpan){
    return [new Date(fullStart), new Date(fullEnd)];
  }

  if(start < fullStart){
    end += fullStart - start;
    start = fullStart;
  }

  if(end > fullEnd){
    start -= end - fullEnd;
    end = fullEnd;
  }

  if(start < fullStart) start = fullStart;
  if(end > fullEnd) end = fullEnd;

  return [new Date(start), new Date(end)];
}

function requestWeightD3Render(renderFn){
  if(weightD3RenderFrame) cancelAnimationFrame(weightD3RenderFrame);

  weightD3RenderFrame = requestAnimationFrame(() => {
    weightD3RenderFrame = null;
    renderFn();
  });
}

async function drawWeightChart(){
  const el = document.getElementById("weightD3Chart");
  if(!el) return;

  clearWeightD3Chart();

  const rows = chartRowsForWeight();

  if(rows.length < 2){
    renderWeightChartFallback("Ajoute au moins 2 pesées pour afficher la courbe.");
    return;
  }

  el.innerHTML = `<div class="chart-loading">Chargement du graphique D3…</div>`;

  let d3;
  try{
    d3 = await loadD3();
  }catch(e){
    renderWeightChartFallback(e.message || "Erreur de chargement.");
    return;
  }

  el.innerHTML = "";

  const weights = rows.map(r => Number(r.poids));
  const ma7Arr = movingAverage(weights, 7);
  const ma30Arr = movingAverage(weights, 30);
  const parseDate = d3.timeParse("%Y-%m-%d");

  const data = rows.map((r, i) => ({
    date: parseDate(r.date),
    iso: r.date,
    poids: Number(r.poids),
    ma7: ma7Arr[i] === null ? null : Number(ma7Arr[i]),
    ma30: ma30Arr[i] === null ? null : Number(ma30Arr[i])
  })).filter(d => d.date && Number.isFinite(d.poids));

  if(data.length < 2){
    renderWeightChartFallback("Données de poids insuffisantes.");
    return;
  }

  const target = getWeightTarget();

  function render(){
    const width = Math.max(320, el.clientWidth || 430);
    const height = Math.max(360, el.clientHeight || 400);

    el.innerHTML = "";

    const margin = {
      top: 30,
      right: 14,
      bottom: 56,
      left: 42
    };

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const fullXDomain = d3.extent(data, d => d.date);

    let xDomain = weightD3VisibleDomain || fullXDomain;
    xDomain = clampWeightDomain(xDomain, fullXDomain);

    weightD3VisibleDomain = xDomain;

    let visibleData = filterVisibleData(data, xDomain);
    if(visibleData.length < 2){
      visibleData = data.slice(-2);
    }

    const [yMin, yMax] = calcVisibleWeightDomain(visibleData);

    const x = d3.scaleTime()
      .domain(xDomain)
      .range([0, innerW]);

    const y = d3.scaleLinear()
      .domain([yMin, yMax])
      .nice()
      .range([innerH, 0]);

    const svg = d3.select(el)
      .append("svg")
      .attr("class", "d3-weight-svg d3-animated")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("preserveAspectRatio", "none");

    const defs = svg.append("defs");

    const areaGradient = defs.append("linearGradient")
      .attr("id", "weightAreaGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    areaGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "var(--chart-area-top)");

    areaGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "var(--chart-area-bottom)");

    const lineGlow = defs.append("filter")
      .attr("id", "lineGlow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");

    lineGlow.append("feGaussianBlur")
      .attr("stdDeviation", "2.2")
      .attr("result", "coloredBlur");

    const feMerge = lineGlow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Fond subtil high-tech
    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", innerW)
      .attr("height", innerH)
      .attr("rx", 2)
      .attr("fill", "#fbfdff");

    // Grille horizontale
    const yTicks = y.ticks(weightTickCount(yMin, yMax));

    g.append("g")
      .attr("class", "d3-grid-y")
      .selectAll("line")
      .data(yTicks)
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", d => Math.round(y(d)) + 0.5)
      .attr("y2", d => Math.round(y(d)) + 0.5);

    // Grille verticale
    const visibleDays = Math.max(1, (x.domain()[1] - x.domain()[0]) / (24 * 60 * 60 * 1000));
    const xTickCount = visibleDays <= 3 ? Math.min(4, Math.ceil(visibleDays) + 1) : Math.min(7, Math.max(3, Math.floor(innerW / 70)));
    const xTicks = x.ticks(xTickCount);

    g.append("g")
      .attr("class", "d3-grid-x")
      .selectAll("line")
      .data(xTicks)
      .join("line")
      .attr("y1", 0)
      .attr("y2", innerH)
      .attr("x1", d => Math.round(x(d)) + 0.5)
      .attr("x2", d => Math.round(x(d)) + 0.5);

    // Axe Y à gauche
    const yAxis = d3.axisLeft(y)
      .tickValues(yTicks)
      .tickSize(0)
      .tickPadding(8)
      .tickFormat(d => Number(d).toLocaleString("fr-FR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }));

    g.append("g")
      .attr("class", "d3-axis d3-axis-y")
      .call(yAxis);

    // Label KG en haut
    g.append("text")
      .attr("class", "d3-y-unit")
      .attr("x", -2)
      .attr("y", -14)
      .attr("text-anchor", "start")
      .text("kg");

    // Axe X
    const xAxis = d3.axisBottom(x)
      .ticks(xTickCount)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat(visibleDays <= 3 ? d3.timeFormat("%d/%m %Hh") : d3.timeFormat("%d/%m"));

    g.append("g")
      .attr("class", "d3-axis d3-axis-x")
      .attr("transform", `translate(0,${innerH})`)
      .call(xAxis);

    g.append("line")
      .attr("class", "d3-x-baseline")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", Math.round(innerH) + 0.5)
      .attr("y2", Math.round(innerH) + 0.5);

    g.append("line")
      .attr("class", "d3-y-baseline")
      .attr("x1", 0.5)
      .attr("x2", 0.5)
      .attr("y1", 0)
      .attr("y2", innerH);

    // Ligne objectif
    if(target && target >= y.domain()[0] && target <= y.domain()[1]){
      g.append("line")
        .attr("class", "d3-target-line")
        .attr("x1", 0)
        .attr("x2", innerW)
        .attr("y1", y(target))
        .attr("y2", y(target));

      g.append("text")
        .attr("class", "d3-target-label")
        .attr("x", 6)
        .attr("y", y(target) - 8)
        .text("Objectif " + formatKg(target));
    }

    const area = d3.area()
      .defined(d => Number.isFinite(d.poids))
      .x(d => x(d.date))
      .y0(innerH)
      .y1(d => y(d.poids))
      .curve(d3.curveMonotoneX);

    const lineWeight = d3.line()
      .defined(d => Number.isFinite(d.poids))
      .x(d => x(d.date))
      .y(d => y(d.poids))
      .curve(d3.curveMonotoneX);

    const lineMa7 = d3.line()
      .defined(d => d.ma7 !== null && Number.isFinite(d.ma7))
      .x(d => x(d.date))
      .y(d => y(d.ma7))
      .curve(d3.curveMonotoneX);

    const lineMa30 = d3.line()
      .defined(d => d.ma30 !== null && Number.isFinite(d.ma30))
      .x(d => x(d.date))
      .y(d => y(d.ma30))
      .curve(d3.curveMonotoneX);

    const clipped = g.append("g")
      .attr("clip-path", "url(#d3ChartClip)");

    defs.append("clipPath")
      .attr("id", "d3ChartClip")
      .append("rect")
      .attr("width", innerW)
      .attr("height", innerH);

    clipped.append("path")
      .datum(data)
      .attr("class", "d3-area")
      .attr("d", area);

    clipped.append("path")
      .datum(data)
      .attr("class", "d3-line d3-line-ma30")
      .attr("pathLength", 1)
      .attr("d", lineMa30);

    clipped.append("path")
      .datum(data)
      .attr("class", "d3-line d3-line-ma7")
      .attr("pathLength", 1)
      .attr("d", lineMa7);

    clipped.append("path")
      .datum(data)
      .attr("class", "d3-line d3-line-weight")
      .attr("pathLength", 1)
      .attr("filter", "url(#lineGlow)")
      .attr("d", lineWeight);

    // Points visibles mais discrets
    const visiblePoints = visibleData.length > 42
      ? visibleData.filter((_, i) => i % Math.ceil(visibleData.length / 26) === 0)
      : visibleData;

    clipped.append("g")
      .attr("class", "d3-points")
      .selectAll("circle")
      .data(visiblePoints)
      .join("circle")
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.poids))
      .attr("r", 2.25);

    const last = data[data.length - 1];

    if(last.date >= weightD3VisibleDomain[0] && last.date <= weightD3VisibleDomain[1]){
      const lx = Math.min(innerW - 54, Math.max(6, x(last.date) + 6));
      const ly = Math.max(8, Math.min(innerH - 24, y(last.poids) - 13));

      g.append("circle")
        .attr("class", "d3-last-pulse")
        .attr("cx", x(last.date))
        .attr("cy", y(last.poids))
        .attr("r", 6);

      g.append("circle")
        .attr("class", "d3-last-dot")
        .attr("cx", x(last.date))
        .attr("cy", y(last.poids))
        .attr("r", 4);

      g.append("rect")
        .attr("class", "d3-last-tag")
        .attr("x", lx)
        .attr("y", ly)
        .attr("width", 54)
        .attr("height", 24)
        .attr("rx", 7);

      g.append("text")
        .attr("class", "d3-last-tag-text")
        .attr("x", lx + 27)
        .attr("y", ly + 16)
        .attr("text-anchor", "middle")
        .text(formatKg(last.poids).replace(" kg", ""));
    }

    // Tooltip custom
    const tooltip = d3.select(el)
      .append("div")
      .attr("class", "d3-tooltip")
      .style("opacity", 0);

    const bisect = d3.bisector(d => d.date).left;

    const focus = g.append("g")
      .attr("class", "d3-focus")
      .style("display", "none");

    focus.append("line")
      .attr("class", "d3-focus-line")
      .attr("y1", 0)
      .attr("y2", innerH);

    focus.append("circle")
      .attr("class", "d3-focus-dot")
      .attr("r", 4);

    const overlay = g.append("rect")
      .attr("class", "d3-overlay")
      .attr("width", innerW)
      .attr("height", innerH);

    function updateTooltip(event){
      const [mx] = d3.pointer(event, overlay.node());
      const date = x.invert(mx);
      let i = bisect(data, date, 1);
      if(i >= data.length) i = data.length - 1;
      const d0 = data[i - 1];
      const d1 = data[i];
      const d = !d0 ? d1 : !d1 ? d0 : (date - d0.date > d1.date - date ? d1 : d0);

      if(!d) return;

      const fx = x(d.date);
      const fy = y(d.poids);

      focus.style("display", null);
      focus.select(".d3-focus-line")
        .attr("x1", fx)
        .attr("x2", fx);

      focus.select(".d3-focus-dot")
        .attr("cx", fx)
        .attr("cy", fy);

      const html = `
        <strong>${fmt(d.iso)}</strong>
        <span><i class="dot weight"></i>Poids <b>${formatKg(d.poids)}</b></span>
        ${d.ma7 !== null ? `<span><i class="dot ma7"></i>MM 7j <b>${formatKg(d.ma7)}</b></span>` : ""}
        ${d.ma30 !== null ? `<span><i class="dot ma30"></i>MM 30j <b>${formatKg(d.ma30)}</b></span>` : ""}
      `;

      tooltip.html(html)
        .style("opacity", 1);

      const tooltipNode = tooltip.node();
      const tw = tooltipNode.offsetWidth || 150;
      const th = tooltipNode.offsetHeight || 100;
      const left = Math.min(width - tw - 8, Math.max(8, margin.left + fx + 12));
      const top = Math.min(height - th - 8, Math.max(8, margin.top + fy - th - 10));

      tooltip
        .style("left", left + "px")
        .style("top", top + "px");
    }

    overlay
      .on("mousemove touchmove", event => {
        if(event.touches && event.touches.length) event.preventDefault();
        updateTooltip(event);
      })
      .on("mouseenter touchstart", () => {
        focus.style("display", null);
      })
      .on("mouseleave touchend", () => {
        focus.style("display", "none");
        tooltip.style("opacity", 0);
      });

    // Zoom / pan manuel stable : on modifie directement le domaine des dates
    const wheelTarget = svg;

    wheelTarget.on("wheel", event => {
      event.preventDefault();

      const current = weightD3VisibleDomain || fullXDomain;
      const currentStart = +current[0];
      const currentEnd = +current[1];
      const span = currentEnd - currentStart;

      const pointer = d3.pointer(event, svg.node());
      const mouseX = Math.max(0, Math.min(innerW, pointer[0] - margin.left));
      const ratio = innerW ? mouseX / innerW : 0.5;

      const anchor = currentStart + span * ratio;
      const dy = event.deltaY * (event.deltaMode === 1 ? 16 : 1);

      // Facteur doux : molette haut = zoom avant, molette bas = zoom arrière
      let factor = Math.exp(dy * 0.00115);
      factor = Math.max(0.86, Math.min(1.16, factor));

      const newSpan = span * factor;
      const nextStart = anchor - newSpan * ratio;
      const nextEnd = anchor + newSpan * (1 - ratio);

      weightD3VisibleDomain = clampWeightDomain(
        [new Date(nextStart), new Date(nextEnd)],
        fullXDomain
      );

      weightD3ZoomTransform = null;
      requestWeightD3Render(render);
    });

    let panStartX = null;
    let panStartDomain = null;

    overlay.on("pointerdown", event => {
      event.preventDefault();

      panStartX = event.clientX;
      panStartDomain = weightD3VisibleDomain || fullXDomain;

      if(overlay.node().setPointerCapture){
        overlay.node().setPointerCapture(event.pointerId);
      }

      const onMove = moveEvent => {
        if(!panStartDomain) return;

        moveEvent.preventDefault();

        const dx = moveEvent.clientX - panStartX;
        const start = +panStartDomain[0];
        const end = +panStartDomain[1];
        const span = end - start;

        // Drag à droite = on remonte vers les dates plus anciennes, sans saut brutal
        const shift = -dx / Math.max(1, innerW) * span;

        weightD3VisibleDomain = clampWeightDomain(
          [new Date(start + shift), new Date(end + shift)],
          fullXDomain
        );

        weightD3ZoomTransform = null;
        requestWeightD3Render(render);
      };

      const onUp = upEvent => {
        panStartX = null;
        panStartDomain = null;

        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);

        try{
          if(overlay.node().releasePointerCapture){
            overlay.node().releasePointerCapture(upEvent.pointerId);
          }
        }catch(e){}
      };

      window.addEventListener("pointermove", onMove, {passive:false});
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    });

    // Mini navigator
    const navH = 18;
    const navY = height - 24;
    const navX = margin.left;
    const navW = innerW;

    const navScaleX = d3.scaleTime()
      .domain(fullXDomain)
      .range([navX, navX + navW]);

    const navScaleY = d3.scaleLinear()
      .domain(calcVisibleWeightDomain(data))
      .range([navY + navH, navY]);

    const navArea = d3.area()
      .x(d => navScaleX(d.date))
      .y0(navY + navH)
      .y1(d => navScaleY(d.poids))
      .curve(d3.curveMonotoneX);

    svg.append("rect")
      .attr("class", "d3-nav-bg")
      .attr("x", navX)
      .attr("y", navY)
      .attr("width", navW)
      .attr("height", navH)
      .attr("rx", 5);

    svg.append("path")
      .datum(data)
      .attr("class", "d3-nav-area")
      .attr("d", navArea);

    const [vd0, vd1] = weightD3VisibleDomain;
    const selX = navScaleX(vd0);
    const selW = Math.max(8, navScaleX(vd1) - selX);

    svg.append("rect")
      .attr("class", "d3-nav-window")
      .attr("x", selX)
      .attr("y", navY - 1)
      .attr("width", selW)
      .attr("height", navH + 2)
      .attr("rx", 5);
  }

  render();

  weightD3ResizeObserver = new ResizeObserver(() => {
    render();
  });

  weightD3ResizeObserver.observe(el);
}


function deleteItem(type, id){

  if(!confirm("Supprimer cette donnée ?")) return;

  state[type] = state[type].filter(x => x.id !== id);

  save();

  if(current === "history"){
    renderHistory();
  } else {
    render();
  }
}

function editItem(type, id){

  const item = state[type].find(x => x.id === id);
  if(!item) return;

  if(type === "weights"){
    const p = prompt("Modifier poids :", item.poids);
    if(p === null) return;
    item.poids = Number(p.replace(",", "."));
  }

  if(type === "trainings"){
    const p = prompt("Poids :", item.poids);
    const r = prompt("Répétitions :", item.repetitions);
    if(p === null || r === null) return;

    item.poids = Number(p.replace(",", "."));
    item.repetitions = Number(r);
    item.volume = item.poids * item.repetitions;
  }

  if(type === "meals"){
    const q = prompt("Quantité :", item.qte);
    if(q === null) return;

    const qte = Number(q.replace(",", "."));
    if(!qte || qte <= 0){
      alert("Quantité invalide.");
      return;
    }

    item.qte = qte;
    recalcMeal(item);
  }

  save();

  if(current === "history"){
    renderHistory();
  } else {
    render();
  }
}

function recalcMeal(item){
  const food = state.foods.find(f => f.name === item.aliment);

  if(!food){
    alert("Aliment introuvable dans la liste. Seule la quantité a été modifiée.");
    return;
  }

  const factor = item.qte / 100;
  item.kcal = +(food.kcal * factor).toFixed(1);
  item.prot = +(food.prot * factor).toFixed(1);
  item.gluc = +(food.gluc * factor).toFixed(1);
  item.lip = +(food.lip * factor).toFixed(1);
  item.semaine = weekNumber(item.date);
  item.mois = monthName(item.date);
}

function val(id){ return document.getElementById(id)?.value || ""; }
function num(id){ return Number(val(id).replace(",",".")) || 0; }

function filterFoods(){
  const input = document.getElementById("mealFood");
  const box = document.getElementById("foodSuggestions");

  if(!input || !box) return;

  const query = input.value.toLowerCase().trim();

  if(query.length < 2){
    box.innerHTML = "";
    box.style.display = "none";
    return;
  }

  const results = state.foods.filter(f =>
    f.name.toLowerCase().includes(query)
  );

  if(results.length === 0){
    box.innerHTML = "";
    box.style.display = "none";
    return;
  }

  box.innerHTML = results.map(f => `
    <div class="suggestion-item"
      onclick="selectFood('${f.name.replace(/'/g, "\\'")}')">
      ${f.name}
    </div>
  `).join("");

  box.style.display = "block";
}

function selectFood(name){
  document.getElementById("mealFood").value = name;
  document.getElementById("foodSuggestions").innerHTML = "";
  document.getElementById("foodSuggestions").style.display = "none";
}

function filterExercises(){
  const input = document.getElementById("trExercice");
  const box = document.getElementById("exerciseSuggestions");

  if(!input || !box) return;

  const query = input.value.toLowerCase().trim();

  if(query.length < 2){
    box.innerHTML = "";
    box.style.display = "none";
    return;
  }

  const results = state.exercises.filter(e =>
    e.toLowerCase().includes(query)
  );

  if(results.length === 0){
    box.innerHTML = "";
    box.style.display = "none";
    return;
  }

  box.innerHTML = results.map(e => `
    <div class="suggestion-item"
      onclick="selectExercise('${e.replace(/'/g, "\\'")}')">
      ${e}
    </div>
  `).join("");

  box.style.display = "block";
}

function selectExercise(name){
  const input = document.getElementById("trExercice");
  const box = document.getElementById("exerciseSuggestions");

  input.value = name;
  box.innerHTML = "";
  box.style.display = "none";

  showLastExercise();
}

render();
