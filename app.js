// ══════════════════════════════════════════════════════════════════
// CONFIGURATION — MODÈLES 2.5 CORRIGÉS
// ══════════════════════════════════════════════════════════════════
const API_BASE = 'https://apihub.agnes-ai.com/v1';
const POLL_BASE = 'https://apihub.agnes-ai.com/agnesapi';
const MODEL_TEXT = 'agnes-2.5-flash';
const MODEL_IMAGE = 'agnes-image-2.1-flash';

// Modèles vidéo 2.5 — le flash est gratuit, le 2.5 complet est payant
const VIDEO_MODELS = [
  { id: 'agnes-video-2.5-flash', label: '2.5-flash', quality: 'flash', paid: false, desc: 'Rapide, 720P uniquement' },
  { id: 'agnes-video-2.5',       label: '2.5',       quality: 'full',  paid: true,  desc: 'Complet, jusqu\'à 2K' }
];
let MODEL_VIDEO = 'agnes-video-2.5-flash';
let USER_MODEL_CHOICE = 'agnes-video-2.5-flash';

const VIDEO_FIRST_POLL_DELAY_SEC = 60;
const VIDEO_POLL_INTERVALS = [8, 8, 12, 12, 20, 20, 25];
const VIDEO_MAX_POLL_ATTEMPTS = 100;

const API_KEYS_STORAGE = 'cine_ia_api_keys_v4';
const DEBUG_MAX = 800;

// ⚠️ Préfixes acceptés : sk- (gratuit) et cpk- (payant)
const KEY_PREFIXES = ['sk-', 'cpk-'];

// (tailles vidéo : flash = 720P uniquement, modèle 2.5 complet = jusqu'à 1080P/2K)

// ══════════════════════════════════════════════════════════════════
// CATALOGUES (inchangés)
// ══════════════════════════════════════════════════════════════════
const DIRECTORS = [
  { id:'wes-anderson', emoji:'🎨', name:'Wes Anderson', sig:'perfect bilateral symmetry, centered frontal framing, deadpan tableaux, pastel palette, meticulous set dressing' },
  { id:'moebius', emoji:'🏜️', name:'Moebius', sig:'clean flowing line art, minimalist futuristic garments, unisex tunics, endless desert landscapes, serene sci-fi' },
  { id:'enki-bilal', emoji:'🌆', name:'Enki Bilal', sig:'angular expressive faces, dramatic chiaroscuro, dystopian grandeur, striking bone structure' },
  { id:'kurosawa', emoji:'⚔️', name:'Akira Kurosawa', sig:'dynamic weather as emotion, samurai stillness, dramatic staging, elemental landscapes' },
  { id:'miyazaki', emoji:'🌿', name:'Hayao Miyazaki', sig:'lush nature, warm hand-drawn aesthetic, quiet wonder, wind as character, gentle heroism' },
  { id:'villeneuve', emoji:'🏛️', name:'Denis Villeneuve', sig:'monumental architecture, muted color palette, oppressive atmosphere, slow grand cinematography' },
  { id:'wong-kar-wai', emoji:'🌃', name:'Wong Kar-wai', sig:'saturated jewel tones, romantic longing, smoky interiors, neon reflections, slow-motion yearning' },
  { id:'kubrick', emoji:'🔲', name:'Stanley Kubrick', sig:'one-point perspective, cold symmetry, unsettling perfection, wide-angle unease' },
  { id:'burton', emoji:'🦇', name:'Tim Burton', sig:'gothic whimsy, striped palettes, crooked architecture, melancholic fairy-tale world' },
  { id:'tarkovsky', emoji:'💧', name:'Andrei Tarkovsky', sig:'long slow takes, water and earth elements, spiritual decay, haunting stillness' },
  { id:'akira', emoji:'🏍️', name:'Katsuhiro Otomo', sig:'dense cyberpunk cityscapes, extreme perspective, detailed mechanical design, neon and chrome' },
  { id:'ghibli', emoji:'✈️', name:'Studio Ghibli', sig:'hand-painted watercolor backgrounds, quiet wonder, warm palettes' },
  { id:'refn', emoji:'🌺', name:'Nicolas W. Refn', sig:'neon-soaked silence, geometric staging, minimalist brutality, hypnotic pacing' },
  { id:'fellini', emoji:'🎪', name:'Federico Fellini', sig:'surreal carnival imagery, dreamlike procession, theatrical absurdity, ornate costumes' },
  { id:'lynch', emoji:'🚪', name:'David Lynch', sig:'suburban uncanny, red curtains, dark ambient, dream logic, unsettling warmth' },
  { id:'del-toro', emoji:'🐟', name:'Guillermo del Toro', sig:'ornate gothic fantasy, empathetic monsters, warm amber tones, lush creature design' }
];

const PALETTES = [
  { id:'pink-mint',    label:'Rose & Menthe',       colors:['#F4C2C2','#A8D8B9','#E5B95A','#F5F0E1','#7B9FB0'] },
  { id:'coral-teal',   label:'Corail & Turquoise',  colors:['#E8A87C','#85CDCA','#F4E4BA','#D4A5A5','#7C6A8B'] },
  { id:'mustard-blue', label:'Moutarde & Bleu',     colors:['#F7D794','#778BEB','#E77F67','#F1E7D0','#3B4B55'] },
  { id:'lavender',     label:'Lavande & Ocre',      colors:['#C5B7D9','#E5B95A','#F4A6A6','#F5EFE0','#7A8B7E'] },
  { id:'sage-blush',   label:'Sauge & Blush',       colors:['#B8C9A8','#F1C6C6','#E8B44A','#F5F0E1','#5B6E7A'] },
  { id:'ochre-rose',   label:'Ocre & Rose fané',    colors:['#D9A44A','#E8B8B8','#8FAE8B','#F4E8D0','#6B5B7B'] },
  { id:'cyber-neon',   label:'Cyber Néon',          colors:['#FF00A8','#00F5FF','#7000FF','#0A0A12','#FFF200'] },
  { id:'desert-gold',  label:'Désert Doré',         colors:['#E5B95A','#C99B6B','#8A7B5C','#F4E8D0','#3B2A1A'] },
  { id:'arctic-blue',  label:'Arctique Bleu',       colors:['#C6E5F4','#7B9FB0','#4A5B7B','#F5F0E1','#2A3B4A'] },
  { id:'forest-dark',  label:'Forêt Sombre',        colors:['#4A6B4A','#2A3B2A','#E5C15A','#8A9B7B','#F5F0E1'] }
];

const IDEA_PRESETS = [
  'Un chaton astronaute découvre une planète oubliée où les étoiles chantent.',
  'Une horlogère répare le temps dans une gare abandonnée, chaque réparation fait revivre un souvenir.',
  'Deux frères funambules traversent une ville rose à la recherche de leur mère disparue.',
  'Un vieux libraire et son chat parlant préservent le dernier livre au monde.',
  'Une danseuse de bambou enseigne le silence à un enfant qui ne peut pas parler.',
  'Une famille de jardiniers cultive des rêves dans une serre abandonnée depuis cent ans.'
];

// ══════════════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════════════
const state = {
  keyPool: [],
  isRunning: false,
  stopRequested: false,
  idea: '',
  directorId: 'wes-anderson',
  paletteId: 'pink-mint',
  sceneCount: 5,
  durationSeconds: 6,  // ⚠️ En SECONDES maintenant (plus en frames)
  ratio: '9:16',
  script: null,
  characters: [],
  videos: [],
  isPlayingFilm: false,
  playRAF: null,
  voiceEnabled: true,
  currentUtterance: null,
  workingPollUrlBuilder: null,
  availableModels: []
};

// ══════════════════════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════════════════════
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
function setStatus(text){const b=document.getElementById('status-bar');const t=document.getElementById('status-text');if(!b||!t)return;if(text){b.classList.add('visible');t.textContent=text}else b.classList.remove('visible')}

let toastTimeout=null;
function showToast(message,type='success',duration=2800){const t=document.getElementById('toast');const i=document.getElementById('toast-icon');const x=document.getElementById('toast-text');if(!t||!i||!x)return;t.classList.remove('visible','success','error','warn');void t.offsetWidth;const icons={success:'✓',error:'✕',warn:'⚠'};i.textContent=icons[type]||'✓';x.textContent=message;t.classList.add(type);requestAnimationFrame(()=>t.classList.add('visible'));if(toastTimeout)clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.classList.remove('visible'),duration)}

function nowTime(){return new Date().toLocaleTimeString('fr-FR',{hour12:false})}

function sanitizeForApi(text){
  if(text==null)return '';
  return String(text)
    .replace(/[\u2018\u2019\u201B\u2032\u02BC]/g, "'")
    .replace(/[\u201C\u201D\u201F\u2033]/g, '"')
    .replace(/\u2013/g, '-').replace(/\u2014/g, '--').replace(/\u2026/g, '...')
    .replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\u00A0/g, ' ').replace(/\u202F/g, ' ');
}

// ══════════════════════════════════════════════════════════════════
// DEBUG
// ══════════════════════════════════════════════════════════════════
let debugCount=0,debugEntries=[],debugCollapsed=false;
function debugLog(level,category,message,data){const body=document.getElementById('debug-body');if(!body)return;const time=nowTime();const entry=document.createElement('div');entry.className='debug-entry '+level;let html='<span class="debug-time">'+time+'</span><span class="debug-cat">['+esc(category)+']</span><span class="debug-msg">'+esc(message)+'</span>';if(data!==undefined&&data!==null){let ds;if(typeof data==='string')ds=data;else{try{ds=JSON.stringify(data,null,2)}catch(e){ds=String(data)}}if(ds.length>3000)ds=ds.slice(0,3000)+'\n…[tronqué]';html+='<pre class="debug-data">'+esc(ds)+'</pre>'}entry.innerHTML=html;body.appendChild(entry);debugEntries.push({time,level,category,message});if(debugEntries.length>DEBUG_MAX)debugEntries.shift();while(body.children.length>DEBUG_MAX)body.removeChild(body.firstChild);body.scrollTop=body.scrollHeight;debugCount++;const c=document.getElementById('debug-count');if(c)c.textContent=debugCount;}
function clearDebug(){const b=document.getElementById('debug-body');if(b)b.innerHTML='';debugEntries=[];debugCount=0;const c=document.getElementById('debug-count');if(c)c.textContent='0'}
function copyDebug(){const lines=debugEntries.map(e=>e.time+' ['+e.category+'] '+e.message).join('\n');const finish=(ok)=>showToast(ok?'Console copiée':'Copie impossible',ok?'success':'error');try{if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(lines).then(()=>finish(true)).catch(()=>legacyCopy(lines,finish));return}}catch(e){}legacyCopy(lines,finish)}
function legacyCopy(text,cb){const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.focus();ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(ta);cb(ok)}
function toggleDebugCollapse(){const p=document.getElementById('debug-panel');const b=document.getElementById('debug-collapse-btn');if(!p||!b)return;debugCollapsed=!debugCollapsed;p.classList.toggle('collapsed',debugCollapsed);b.textContent=debugCollapsed?'+':'−'}

// ══════════════════════════════════════════════════════════════════
// MULTI-CLÉS API (sk- et cpk-)
// ══════════════════════════════════════════════════════════════════
function isValidKeyFormat(k){
  if(!k||typeof k!=='string')return false;
  return KEY_PREFIXES.some(p=>k.startsWith(p));
}
function isPaidKey(k){return k&&k.startsWith('cpk-');}
function getStoredKeys(){try{const raw=localStorage.getItem(API_KEYS_STORAGE);if(!raw)return[];const arr=JSON.parse(raw);if(!Array.isArray(arr))return[];return arr.filter(k=>typeof k==='string'&&k.trim().length>0&&isValidKeyFormat(k.trim()))}catch(e){return[]}}
function setStoredKeys(keys){try{localStorage.setItem(API_KEYS_STORAGE,JSON.stringify(keys))}catch(e){}}
function refreshKeyPool(){const stored=getStoredKeys();const old=state.keyPool||[];state.keyPool=stored.map(k=>{const ex=old.find(p=>p.key===k);return ex||{key:k,lastUsed:0,cooldownUntil:0,active:true,errorCount:0,isPaid:isPaidKey(k)}})}
function hasActiveKey(){return state.keyPool.some(k=>k.active)}
function getReadyKey(){
  const now=Date.now();
  const active=state.keyPool.filter(k=>k.active);
  if(active.length===0)return{key:null,waitMs:0};
  const ready=active.filter(k=>!k.cooldownUntil||k.cooldownUntil<=now);
  if(ready.length===0){
    const soonest=active.reduce((a,b)=>(a.cooldownUntil||0)<(b.cooldownUntil||0)?a:b);
    return{key:null,waitMs:Math.max(1000,(soonest.cooldownUntil||0)-now)};
  }
  const paid=ready.filter(k=>k.isPaid);
  const pool=paid.length>0?paid:ready;
  pool.sort((a,b)=>(a.lastUsed||0)-(b.lastUsed||0));
  return{key:pool[0],waitMs:0};
}
async function acquireKey(label){
  while(true){
    if(state.stopRequested)throw new Error('Arrêt demandé');
    const{key,waitMs}=getReadyKey();
    if(key){key.lastUsed=Date.now();return key}
    if(waitMs===0)throw new Error('Aucune clé API active');
    debugLog('warn',label,'Toutes les clés en cooldown — attente '+Math.round(waitMs/1000)+'s');
    setStatus('Toutes les clés en cooldown — attente '+Math.round(waitMs/1000)+'s');
    await sleep(waitMs);
  }
}

function renderKeysStatus(){
  const el=document.getElementById('api-keys-status');
  if(!el)return;
  if(state.keyPool.length===0){el.innerHTML='';return}
  const now=Date.now();
  el.innerHTML=state.keyPool.map((k,i)=>{
    let s;
    if(!k.active)s='<span class="key-state dead">Inactive</span>';
    else if(k.cooldownUntil>now){const sec=Math.ceil((k.cooldownUntil-now)/1000);s='<span class="key-state cool">Cooldown '+sec+'s</span>'}
    else if(k.isPaid)s='<span class="key-state paid">Payante</span>';
    else s='<span class="key-state">Active</span>';
    return '<div class="key-row"><span class="key-id">#'+(i+1)+' · '+esc(k.key.slice(0,9))+'…'+esc(k.key.slice(-4))+'</span>'+s+'</div>';
  }).join('');
}

function saveKeysFromUI(){
  const input=document.getElementById('api-keys-input');
  if(!input)return;
  const keys=input.value.split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length>0);
  const valid=keys.filter(k=>isValidKeyFormat(k));
  const invalid=keys.filter(k=>!isValidKeyFormat(k));
  if(invalid.length>0){
    const ex=invalid[0].slice(0,12);
    const msg=invalid.length+' clé(s) refusée(s) — les clés doivent commencer par sk- ou cpk-.\n\nExemple refusé : "'+ex+'…"\n\nContinuer avec '+valid.length+' clé(s) valide(s) ?';
    if(!confirm(msg))return;
  }
  if(valid.length===0){
    showToast('Aucune clé valide (sk- ou cpk- requis)','error',4000);
    return;
  }
  setStoredKeys(valid);
  refreshKeyPool();
  updateApiPanel();
  const paidCount=valid.filter(isPaidKey).length;
  const freeCount=valid.length-paidCount;
  showToast(valid.length+' clé(s) enregistrée(s) · '+paidCount+' payante(s) + '+freeCount+' gratuite(s)','success',3500);
  debugLog('success','CLÉS',valid.length+' clé(s) actives · '+paidCount+' payante(s) · '+freeCount+' gratuite(s)');
}

async function testKeysAndModels(){
  if(state.keyPool.length===0){showToast('Enregistrez d\'abord au moins une clé','warn');return}
  debugLog('state','TEST','Test des clés et modèles disponibles…');
  setStatus('Test en cours…');
  const keys=[...new Set(state.keyPool.map(k=>k.key))];
  const allModels=new Set();
  let detected='agnes-video-2.5-flash', paidFullFound=false;
  for(const key of keys){
    const isPaid=isPaidKey(key);
    try{
      const res=await fetch(API_BASE+'/models',{method:'GET',headers:{'Authorization':'Bearer '+key}});
      if(res.ok){
        const data=await res.json();
        const models=(data.data||[]).map(m=>m.id);
        models.forEach(m=>allModels.add(m));
        const hasFull=models.some(m=>m.match(/video-2\.5(?!.*flash)/)||m.match(/video-v2\.5(?!.*flash)/));
        if(isPaid&&hasFull&&!paidFullFound){detected='agnes-video-2.5';paidFullFound=true;}
        debugLog('success','TEST','Clé '+key.slice(0,9)+'… ('+(isPaid?'payante':'gratuite')+') : '+models.filter(m=>m.toLowerCase().includes('video')).length+' modèle(s) vidéo');
      }else{
        debugLog('warn','TEST','Clé '+key.slice(0,9)+'… : HTTP '+res.status);
      }
    }catch(e){
      debugLog('warn','TEST','Clé '+key.slice(0,9)+'… : '+e.message);
    }
  }
  state.availableModels=[...allModels];
  if(USER_MODEL_CHOICE==='auto'){
    MODEL_VIDEO=detected;
    document.getElementById('video-model-display').textContent=detected;
    updateModelBadge();
  }
  const videoModels=[...allModels].filter(m=>m.toLowerCase().includes('video'));
  showToast(keys.length+' clé(s) testée(s) · '+videoModels.length+' modèle(s) vidéo','success',4000);
  debugLog('success','TEST','Modèles vidéo détectés : '+videoModels.join(', '));
  updateApiPanel();
  setStatus('Test terminé');
  await sleep(1500);
  setStatus(null);
}

function updateModelBadge(){
  const badge=document.getElementById('video-model-badge');
  if(!badge)return;
  if(MODEL_VIDEO==='agnes-video-2.5-flash'){
    badge.textContent='';
    badge.className='';
  }else if(MODEL_VIDEO==='agnes-video-2.5'){
    badge.textContent='· payant';
    badge.className='ml-paid';
  }
}

function updateApiPanel(){
  const panel=document.getElementById('api-panel');
  const input=document.getElementById('api-keys-input');
  const line=document.getElementById('api-status-line');
  const text=document.getElementById('api-status-text');
  if(!panel||!input||!line||!text)return;
  refreshKeyPool();
  const n=state.keyPool.length;
  const paidCount=state.keyPool.filter(k=>k.isPaid).length;
  const freeCount=n-paidCount;
  panel.classList.remove('ok','paid');
  line.classList.remove('ok','paid');
  if(n>0){
    if(paidCount>0){
      panel.classList.add('paid');line.classList.add('paid');
      text.textContent='✓ '+n+' clé(s) · '+paidCount+' payante(s) + '+freeCount+' gratuite(s) · parallélisme : '+n;
    }else{
      panel.classList.add('ok');line.classList.add('ok');
      text.textContent='✓ '+n+' clé(s) gratuite(s) · parallélisme : '+n;
    }
    input.value=state.keyPool.map(k=>k.key).join('\n');
  }else{
    text.textContent='Aucune clé API enregistrée (sk- ou cpk-)';
    input.value='';
  }
  renderKeysStatus();
  updateButtons();
}

// ══════════════════════════════════════════════════════════════════
// API FETCH
// ══════════════════════════════════════════════════════════════════
async function apiFetch(url,options,label,maxAttempts){
  options=options||{};label=label||'API';
  maxAttempts=(typeof maxAttempts==='number'&&maxAttempts>0)?maxAttempts:6;
  let lastErr=null;

  for(let attempt=0;attempt<maxAttempts;attempt++){
    if(state.stopRequested)throw new Error('Arrêt demandé');
    let keyObj=null;
    try{keyObj=await acquireKey(label)}catch(e){throw e}

    const method=options.method||'GET';
    debugLog('api','REQ '+label,method+' '+url+' · clé #'+(state.keyPool.indexOf(keyObj)+1)+' '+keyObj.key.slice(-4)+(keyObj.isPaid?' [payante]':' [gratuite]')+' (essai '+(attempt+1)+'/'+maxAttempts+')');

    const headers=Object.assign({},options.headers||{},{'Authorization':'Bearer '+keyObj.key});
    const finalOptions=Object.assign({},options,{headers});

    try{
      const t0=Date.now();
      const res=await fetch(url,finalOptions);
      const dt=Date.now()-t0;
      let retryAfter=0;try{retryAfter=parseInt(res.headers.get('Retry-After')||'0',10)||0}catch(e){}
      let errorText='';
      if(!res.ok){try{errorText=(await res.clone().text()).slice(0,1200)}catch(e){}}
      debugLog('response','RÉP '+label,'HTTP '+res.status+' en '+dt+'ms · clé '+keyObj.key.slice(-4),errorText||undefined);
      if(res.ok){keyObj.errorCount=0;return res}

      // Cas modèle indisponible → permettre la bascule
      if((res.status===400||res.status===404)&&(errorText.includes('model_not_found')||errorText.includes('No available channel'))){
        debugLog('error','MODÈLE','Modèle '+MODEL_VIDEO+' indisponible');
        const err=new Error('MODEL_NOT_AVAILABLE');
        err.status=res.status;err.body=errorText;throw err;
      }

      if([401,403].includes(res.status)){
        keyObj.errorCount=(keyObj.errorCount||0)+1;
        if(keyObj.errorCount>=3){keyObj.active=false;debugLog('error','CLÉ','Clé '+keyObj.key.slice(-4)+' désactivée');renderKeysStatus()}
        const err=new Error('HTTP '+res.status+' — '+errorText.slice(0,400));
        err.status=res.status;err.body=errorText;throw err;
      }
      if(res.status===404){const err=new Error('HTTP 404');err.status=404;err.body=errorText;throw err}
      if(res.status===429){
        const wait=retryAfter>0?retryAfter:Math.min(120,20+attempt*15);
        keyObj.cooldownUntil=Date.now()+wait*1000;
        debugLog('warn','RATELIMIT','Clé '+keyObj.key.slice(-4)+' → cooldown '+wait+'s');
        renderKeysStatus();
        const{key:next}=getReadyKey();
        if(next&&next!==keyObj){debugLog('info','ROTATION','Nouvelle clé : '+next.key.slice(-4));continue}
        setStatus('Limite API — attente '+wait+'s');
        await sleep(Math.min(wait*1000,3000));
        continue;
      }
      if([500,502,503,504,520,522,524].includes(res.status)){
        const wait=Math.min(60,8+attempt*6);
        debugLog('warn','SERVICE','HTTP '+res.status+' — attente '+wait+'s');
        await sleep(wait*1000);continue;
      }
      const wait=Math.min(60,6+attempt*5);
      debugLog('warn','HTTP','HTTP '+res.status+' — retry dans '+wait+'s');
      await sleep(wait*1000);
    }catch(e){
      if(e.message==='Arrêt demandé')throw e;
      if(e.message==='MODEL_NOT_AVAILABLE')throw e;
      if(e.status&&[400,401,403,404].includes(e.status))throw e;
      lastErr=e;
      const wait=Math.min(45,4+attempt*4);
      debugLog('warn','NETWORK',e.message+' — retry dans '+wait+'s');
      await sleep(wait*1000);
    }
  }
  throw lastErr||new Error('Tentatives épuisées pour '+label);
}

// ══════════════════════════════════════════════════════════════════
// JSON PARSER
// ══════════════════════════════════════════════════════════════════
function balanceJson(text){let ob=0,ok=0,ins=false,esc=false;for(let i=0;i<text.length;i++){const ch=text[i];if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch==='"'){ins=!ins;continue}if(ins)continue;if(ch==='{')ob++;else if(ch==='}')ob--;else if(ch==='[')ok++;else if(ch===']')ok--}let r=text;if(ins)r+='"';while(ok>0){r+=']';ok--}while(ob>0){r+='}';ob--}return r}
function fixUnquotedKeys(text){let out='';let i=0;const n=text.length;let ins=false,esc=false;const stack=[];let last='{';while(i<n){const ch=text[i];if(esc){out+=ch;esc=false;i++;continue}if(ch==='\\'){out+=ch;esc=true;i++;continue}if(ins){out+=ch;if(ch==='"')ins=false;i++;continue}if(ch==='"'){ins=true;out+=ch;i++;continue}if(ch==='{'){stack.push('{');last='{';out+=ch;i++;continue}if(ch==='['){stack.push('[');last='[';out+=ch;i++;continue}if(ch==='}'){if(stack.length)stack.pop();last='}';out+=ch;i++;continue}if(ch===']'){if(stack.length)stack.pop();last=']';out+=ch;i++;continue}if(ch===','){last=',';out+=ch;i++;continue}if(ch===':'){last=':';out+=ch;i++;continue}if(/\s/.test(ch)){out+=ch;i++;continue}const top=stack[stack.length-1];if((last==='{'||last===',')&&top==='{'&&/[A-Za-z_$]/.test(ch)){let j=i;while(j<n&&/[A-Za-z0-9_$]/.test(text[j]))j++;let k=j;while(k<n&&/\s/.test(text[k]))k++;if(text[k]===':'){out+='"'+text.slice(i,j)+'"';i=j;continue}}out+=ch;i++}return out}
function fixMissingCommas(text){let out='';let i=0;const n=text.length;let ins=false,esc=false,justClosed=false;while(i<n){const ch=text[i];if(esc){out+=ch;esc=false;i++;continue}if(ch==='\\'){out+=ch;esc=true;i++;continue}if(ins){out+=ch;if(ch==='"'){ins=false;let j=i+1;while(j<n&&/\s/.test(text[j]))j++;justClosed=(text[j]!==':')}i++;continue}if(/\s/.test(ch)){out+=ch;i++;continue}if(justClosed&&ch!==','&&ch!=='}'&&ch!==']'&&ch!==':'){out+=',';justClosed=false}if(ch==='"'){ins=true;justClosed=false;out+=ch;i++;continue}if(ch==='{'){justClosed=false;out+=ch;i++;continue}if(ch==='['){justClosed=false;out+=ch;i++;continue}if(ch==='}'){justClosed=true;out+=ch;i++;continue}if(ch===']'){justClosed=true;out+=ch;i++;continue}if(ch===','){justClosed=false;out+=ch;i++;continue}if(ch===':'){justClosed=false;out+=ch;i++;continue}justClosed=false;out+=ch;i++}return out}
function repairJson(text){
  if(!text)return null;
  let c=String(text).trim();
  const fm=c.match(/```(?:json)?\s*([\s\S]*?)```/);
  if(fm)c=fm[1].trim();
  const fb=c.indexOf('{');if(fb<0)return null;c=c.slice(fb);
  const lb=c.lastIndexOf('}');if(lb>0)c=c.slice(0,lb+1);
  let out='';let ins=false,esc=false;
  for(let i=0;i<c.length;i++){const ch=c[i];if(esc){out+=('"\\/bfnrtu'.includes(ch)?'\\'+ch:ch);esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch==='"'){ins=!ins;out+=ch;continue}if(ins){if(ch==='\n'){out+='\\n';continue}if(ch==='\r'){out+='\\r';continue}if(ch==='\t'){out+='\\t';continue}const code=ch.charCodeAt(0);if(code<32){out+='\\u'+code.toString(16).padStart(4,'0');continue}}out+=ch}
  if(esc)out+='\\';if(ins)out+='"';
  try{out=fixUnquotedKeys(out)}catch(e){}
  try{out=fixMissingCommas(out)}catch(e){}
  out=out.replace(/,\s*([}\]])/g,'$1');
  return out;
}
function extractJson(text){
  if(!text)return null;
  const repaired=repairJson(text);
  if(!repaired){debugLog('error','PARSE','Aucun { trouvé');return null}
  try{return JSON.parse(repaired)}catch(e1){
    debugLog('warn','PARSE','1er essai échoué : '+e1.message);
    try{return JSON.parse(balanceJson(repaired))}catch(e2){
      debugLog('error','PARSE','2e essai échoué : '+e2.message);
      debugLog('error','PARSE','Aperçu du JSON cassé',repaired.slice(0,2000));
      return null;
    }
  }
}

// ══════════════════════════════════════════════════════════════════
// IMAGE + VIDÉO (nouvelle API 2.5)
// ══════════════════════════════════════════════════════════════════
async function generateImage(prompt) {
  const body={model:MODEL_IMAGE,prompt:sanitizeForApi(prompt),n:1,size:'1K',ratio:'1:1'};
  const res=await apiFetch(API_BASE+'/images/generations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)},'Image',4);
  const data=await res.json();
  const item=data.data&&data.data[0];
  if(!item)throw new Error('Pas d\'image');
  if(item.url)return item.url;
  if(item.b64_json)return 'data:image/png;base64,'+item.b64_json;
  throw new Error('Format inconnu');
}

function decodeCompositeId(composite){
  if(!composite||typeof composite!=='string')return null;
  if(!composite.startsWith('video_'))return null;
  let b64=composite.slice(6);while(b64.length%4)b64+='=';
  try{const dec=atob(b64);const m=dec.match(/video_id:([^;]+)/);if(m&&m[1])return m[1].trim()}catch(e){}
  return null;
}

/**
 * ⚠️ FONCTION CLÉ — Format 2.5 (nouveau)
 * Pas de num_frames, pas de "image", pas de frame_rate
 * On utilise : seconds, mode, size, aspect_ratio, first_frame/last_frame
 */
async function createVideoTaskWithModel(prompt,imageUrl,durationSeconds,modelId){
  // Déterminer la taille selon le modèle
  const size = modelId === 'agnes-video-2.5-flash' ? '720P' : '1080P';
  
  // Construire le body au format 2.5
  const body = {
    model: modelId,
    prompt: sanitizeForApi(prompt),
    seconds: String(durationSeconds),  // ⚠️ Chaîne de caractères entre "4" et "12"
    size: size,
    aspect_ratio: state.ratio,
    mode: 'text'  // text par défaut, keyframe si image
  };

  // Si une image d'ancrage est fournie → mode keyframe
  if(imageUrl){
    body.mode = 'keyframe';
    body.first_frame = imageUrl;  // ⚠️ "first_frame" remplace "image"
  }

  debugLog('ai','PROMPT VIDÉO ['+modelId+']','Envoyé · ' + durationSeconds + 's · ' + size + ' · ' + state.ratio + ' · mode=' + body.mode);
  const res=await apiFetch(API_BASE+'/videos',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(body)
  },'Video',3);

  const data=await res.json();
  debugLog('response','VIDÉO CRÉÉE ['+modelId+']','Réponse complète',data);
  
  const compositeId=data.video_id||data.id||data.task_id;
  if(!compositeId)throw new Error('Pas de video_id dans la réponse');
  const innerId=decodeCompositeId(compositeId);
  debugLog('info','VIDÉO ID ['+modelId+']','composite='+compositeId.slice(0,40)+'… · inner='+(innerId||'—'));
  return {compositeId,innerId,raw:data,model:modelId};
}

async function createVideoTask(prompt,imageUrl,durationSeconds){
  let lastErr=null;
  const modelsToTry=[MODEL_VIDEO,...VIDEO_MODELS.map(m=>m.id).filter(id=>id!==MODEL_VIDEO)];
  for(const modelId of modelsToTry){
    try{
      debugLog('info','MODÈLE','Tentative avec '+modelId+'…');
      const result=await createVideoTaskWithModel(prompt,imageUrl,durationSeconds,modelId);
      if(modelId!==MODEL_VIDEO){
        MODEL_VIDEO=modelId;
        document.getElementById('video-model-display').textContent=modelId;
        updateModelBadge();
        showToast('Bascule sur '+modelId,'warn',3000);
      }
      return result;
    }catch(e){
      if(e.message==='MODEL_NOT_AVAILABLE'||e.status===400||e.status===404){
        debugLog('warn','MODÈLE',modelId+' indisponible → modèle suivant');
        lastErr=e;
        continue;
      }
      throw e;
    }
  }
  throw lastErr||new Error('Aucun modèle vidéo disponible');
}

function buildIdCandidates(v){
  const ids=[];
  if(typeof v==='string'){
    ids.push({label:'composite',value:v});
    const i=decodeCompositeId(v);if(i&&i!==v)ids.push({label:'inner',value:i});
  }else if(v&&typeof v==='object'){
    if(v.compositeId)ids.push({label:'composite',value:v.compositeId});
    if(v.innerId)ids.push({label:'inner',value:v.innerId});
    const raw=v.raw||{};
    for(const f of['id','task_id','request_id'])if(raw[f]&&!ids.some(x=>x.value===raw[f]))ids.push({label:'raw.'+f,value:raw[f]});
  }
  const seen=new Set();
  return ids.filter(x=>{if(seen.has(x.value))return false;seen.add(x.value);return true});
}

async function pollVideo(videoIdObj,onProgress){
  const candidates=buildIdCandidates(videoIdObj);
  if(candidates.length===0)throw new Error('Aucun ID vidéo exploitable');
  const minWait=Math.min(VIDEO_FIRST_POLL_DELAY_SEC,Math.max(40,Math.floor(90*0.7)));
  let rem=minWait;
  while(rem>0){if(state.stopRequested)throw new Error('Arrêt demandé');onProgress('Préparation — '+rem+'s');await sleep(1000);rem--}
  let working={builder:state.workingPollUrlBuilder||null,id:null};
  
  // URLs de polling — le model_name est OBLIGATOIRE pour les modes keyframe/reference
  const pollBuilders=[
    {name:'agnesapi',   build:(id)=>POLL_BASE+'?video_id='+encodeURIComponent(id)+'&model_name='+encodeURIComponent(MODEL_VIDEO)},
    {name:'v1-rest',    build:(id)=>API_BASE+'/videos/'+encodeURIComponent(id)},
    {name:'v1-status',  build:(id)=>API_BASE+'/videos/'+encodeURIComponent(id)+'/status'},
    {name:'v1-model',   build:(id)=>API_BASE+'/videos/'+encodeURIComponent(id)+'?model_name='+encodeURIComponent(MODEL_VIDEO)}
  ];
  
  for(let attempt=0;attempt<VIDEO_MAX_POLL_ATTEMPTS;attempt++){
    if(state.stopRequested)throw new Error('Arrêt demandé');
    if(attempt>0){const idx=Math.min(attempt-1,VIDEO_POLL_INTERVALS.length-1);let r=VIDEO_POLL_INTERVALS[idx];while(r>0){if(state.stopRequested)throw new Error('Arrêt demandé');onProgress('Création — '+r+'s');await sleep(1000);r--}}
    const approaches=[];
    if(working.builder&&working.id)approaches.push({builder:working.builder,id:working.id,priority:true});
    for(const b of pollBuilders)for(const c of candidates)if(!approaches.some(a=>a.builder===b&&a.id===c.value))approaches.push({builder:b,id:c.value,idLabel:c.label});
    let got=false,lastError=null;
    for(const ap of approaches){
      if(state.stopRequested)throw new Error('Arrêt demandé');
      const url=ap.builder.build(ap.id);
      try{
        const res=await apiFetch(url,{method:'GET'},'Polling',2);
        const d=await res.json();
        if(!working.builder||!working.id){working.builder=ap.builder;working.id=ap.id;state.workingPollUrlBuilder=ap.builder;debugLog('success','POLLING','Endpoint validé : '+ap.builder.name)}
        got=true;
        const status=d.status||'unknown';const progress=d.progress||0;
        onProgress('Création — '+progress+'%');
        if(status==='completed'||status==='succeeded'||status==='done'){
          // ⚠️ Le champ est "url" (top-level) pour le modèle 2.5
          const u=d.url||(d.metadata&&d.metadata.url)||(d.output&&d.output.url);
          if(!u)throw new Error('Terminé sans URL');
          debugLog('success','POLLING','Vidéo prête : '+u.slice(0,80));
          return u;
        }
        if(status==='failed'||status==='error'||status==='cancelled')throw new Error('Échec ('+status+')');
        break;
      }catch(e){
        if(e.message==='Arrêt demandé')throw e;
        lastError=e;
        if(e.status===404){debugLog('warn','POLLING','404 sur '+ap.builder.name+' → essaie autre endpoint');continue}
        if(e.status===401||e.status===403)continue;
        debugLog('warn','POLLING','Erreur '+ap.builder.name+' : '+e.message);break;
      }
    }
    if(!got&&lastError)debugLog('warn','POLLING','Itération '+attempt+' sans 200');
  }
  throw new Error('Délai maximal dépassé');
}

// ══════════════════════════════════════════════════════════════════
// APPEL TEXTE
// ══════════════════════════════════════════════════════════════════
async function callChatCompletion(systemPrompt,userPrompt,label,maxTokens,temperature){
  const sys=sanitizeForApi(systemPrompt)||'Assistant.';
  const usr=sanitizeForApi(userPrompt);
  if(!usr)throw new Error('userPrompt vide');
  const body={model:MODEL_TEXT,messages:[{role:'system',content:sys},{role:'user',content:usr}],temperature:typeof temperature==='number'?temperature:0.7,max_tokens:maxTokens||16000,reasoning_effort:'none',chat_template_kwargs:{enable_thinking:false}};
  const res=await apiFetch(API_BASE+'/chat/completions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)},label,4);
  const data=await res.json();
  const choice=data.choices&&data.choices[0];
  const msg=choice&&choice.message;
  let content=msg&&msg.content;
  if(!content&&msg&&msg.reasoning_content){debugLog('warn',label,'fallback reasoning_content');content=msg.reasoning_content}
  debugLog('response',label,'finish_reason='+(choice&&choice.finish_reason)+' · len='+((content&&content.length)||0));
  return content;
}

// ══════════════════════════════════════════════════════════════════
// RENDU UI
// ══════════════════════════════════════════════════════════════════
function updateButtons(){
  const gen=document.getElementById('generate-btn');
  const stop=document.getElementById('stop-btn');
  const play=document.getElementById('play-film-btn');
  const replay=document.getElementById('replay-btn');
  const hasKey=hasActiveKey();
  const hasIdea=document.getElementById('idea-input').value.trim().length>10;
  const hasVideos=state.videos.filter(v=>v.status==='done').length>0;
  if(gen){
    gen.disabled=!hasKey||!hasIdea||state.isRunning;
    if(state.isRunning)gen.innerHTML='⏳ Génération en cours…<span style="display:block;font-size:.65rem;letter-spacing:.15em;color:var(--dim);margin-top:.4rem;font-weight:400;text-transform:none;">Ne fermez pas l\'onglet</span>';
    else if(!hasKey)gen.innerHTML='🔑 Ajoutez une clé API (sk- ou cpk-)';
    else if(!hasIdea)gen.innerHTML='💡 Décrivez votre idée (10 caractères min)';
    else gen.innerHTML='▶ Générer le film<span style="display:block;font-size:.65rem;letter-spacing:.15em;color:var(--dim);margin-top:.4rem;font-weight:400;text-transform:none;">'+state.sceneCount+' scènes · '+state.durationSeconds+'s · '+MODEL_VIDEO+'</span>';
  }
  if(stop)stop.classList.toggle('visible',state.isRunning);
  if(play)play.disabled=!hasVideos||state.isPlayingFilm||state.isRunning;
  if(replay)replay.disabled=!hasVideos||state.isPlayingFilm||state.isRunning;
  const pb=document.getElementById('player-badge');
  if(pb)pb.textContent=state.videos.filter(v=>v.status==='done').length;
}

function renderDirectors(){
  const grid=document.getElementById('director-grid');
  if(!grid)return;
  grid.innerHTML=DIRECTORS.map(d=>'<div class="director-card'+(state.directorId===d.id?' selected':'')+'" data-director="'+d.id+'"><div class="dc-emoji">'+d.emoji+'</div><div class="dc-info"><div class="dc-nm">'+esc(d.name)+'</div><div class="dc-ds">'+esc(d.sig.slice(0,60))+'…</div></div></div>').join('');
  grid.querySelectorAll('[data-director]').forEach(el=>{el.addEventListener('click',()=>{state.directorId=el.dataset.director;renderDirectors();updateButtons();debugLog('info','DIRECTOR','Style : '+DIRECTORS.find(d=>d.id===state.directorId).name)})});
}

function renderPalettes(){
  const row=document.getElementById('palette-row');
  if(!row)return;
  row.innerHTML=PALETTES.map(p=>'<button type="button" class="palette-btn'+(state.paletteId===p.id?' active':'')+'" data-palette="'+p.id+'"><span style="display:block;height:12px;border-radius:2px;background:linear-gradient(90deg,'+p.colors.join(',')+');margin-bottom:.3rem;"></span>'+p.label+'</button>').join('');
  row.querySelectorAll('[data-palette]').forEach(btn=>{btn.addEventListener('click',()=>{state.paletteId=btn.dataset.palette;renderPalettes();debugLog('info','PALETTE','Palette : '+PALETTES.find(p=>p.id===state.paletteId).label)})});
}

function renderIdeaPresets(){
  const row=document.getElementById('idea-presets');
  if(!row)return;
  row.innerHTML=IDEA_PRESETS.map(t=>'<div class="preset-chip" data-idea="'+esc(t)+'">'+esc(t.slice(0,42))+'…</div>').join('');
  row.querySelectorAll('[data-idea]').forEach(el=>{el.addEventListener('click',()=>{document.getElementById('idea-input').value=el.dataset.idea;updateButtons()})});
}

function renderModelChoice(){
  const container=document.getElementById('model-choice');
  if(!container)return;
  container.querySelectorAll('.model-opt').forEach(el=>{
    el.classList.toggle('selected',el.dataset.model===USER_MODEL_CHOICE);
  });
  const hint=document.getElementById('model-hint-name');
  if(hint)hint.textContent=MODEL_VIDEO;
  updateModelBadge();
}

function renderScript(){
  const view=document.getElementById('script-view');
  if(!view)return;
  if(!state.script){view.textContent='Le scénario apparaîtra ici…';return}
  const s=state.script;
  const director=DIRECTORS.find(d=>d.id===state.directorId);
  const palette=PALETTES.find(p=>p.id===state.paletteId);
  let html='';
  html+='<div class="script-title">📖 '+esc(s.title||'Sans titre')+'</div>';
  html+='<div class="script-logline">'+esc(s.logline||'')+'</div>';
  html+='<div class="script-meta">🎬 Style : '+esc(director.name)+'<br>🎨 Palette : '+esc(palette.label)+'<br>🎭 Personnages : '+(s.characters||[]).length+' · Scènes : '+(s.scenes||[]).length+' · Modèle vidéo : '+esc(MODEL_VIDEO)+'</div>';
  (s.scenes||[]).forEach((sc,i)=>{
    const ch=sc.character||{};
    html+='<div class="script-scene">';
    html+='<div class="sc-head">SCÈNE '+(sc.scene_number||(i+1))+'</div>';
    if(ch.name)html+='<div class="sc-line sc-character"><span class="sc-label">PERSO</span><strong>'+esc(ch.name)+'</strong> — '+esc(ch.appearance||'')+'</div>';
    if(sc.decor)html+='<div class="sc-line"><span class="sc-label">DÉCOR</span>'+esc(sc.decor)+'</div>';
    if(sc.action)html+='<div class="sc-line"><span class="sc-label">ACTION</span>'+esc(sc.action)+'</div>';
    if(Array.isArray(sc.shots)&&sc.shots.length){
      html+='<div class="sc-shots">🎞️ <strong>Montage — '+sc.shots.length+' plans :</strong><br>';
      sc.shots.forEach((sh,si)=>{const c=sh.camera||{};html+='&nbsp;&nbsp;• Plan '+(si+1)+' : '+(c.type||'?')+' / '+(c.movement||'?')+' / '+(c.framing||'?')+' — '+esc(sh.description||'')+'<br>'});
      html+='</div>';
    }
    if(sc.dialogue&&sc.dialogue.line_fr)html+='<div class="sc-line sc-dialogue"><span class="sc-label">🔊 VOIX</span><strong>'+esc(sc.dialogue.speaker||'')+'</strong> — « '+esc(sc.dialogue.line_fr)+' »</div>';
    html+='</div>';
  });
  view.innerHTML=html;
  const b=document.getElementById('script-badge');if(b)b.textContent=(s.scenes||[]).length+' scènes';
}

function renderCharacters(){
  const grid=document.getElementById('characters-grid');
  if(!grid)return;
  if(state.characters.length===0){grid.innerHTML='';return}
  grid.innerHTML=state.characters.map((c,i)=>{
    const cls=c.status==='done'?'character-card done':c.status==='error'?'character-card error':'character-card';
    const body=c.status==='done'?'<img src="'+esc(c.url)+'" alt=""><div class="ch-label">'+esc(c.name)+'</div>':'<div class="ch-placeholder"><div class="spinner-mini"></div><span>Génération…</span></div>';
    return '<div class="'+cls+'">'+body+'</div>';
  }).join('');
  const b=document.getElementById('characters-badge');if(b)b.textContent=state.characters.filter(c=>c.status==='done').length+'/'+state.characters.length;
}

function renderVideos(){
  const grid=document.getElementById('videos-grid');
  if(!grid)return;
  while(grid.children.length>state.videos.length)grid.removeChild(grid.lastChild);
  for(let i=grid.children.length;i<state.videos.length;i++){
    const card=document.createElement('div');
    card.className='scene-card';card.dataset.index=String(i);
    card.dataset.status='';card.dataset.progress='';card.dataset.url='';
    card.innerHTML='<div class="scene-card-header"><span class="scene-card-title">🎬 Scène '+(i+1)+'</span><span class="scene-card-status"></span></div><div class="scene-card-body"></div>';
    grid.appendChild(card);
  }
  state.videos.forEach((v,i)=>{
    const card=grid.children[i];if(!card)return;
    const titleEl=card.querySelector('.scene-card-title');
    const statusEl=card.querySelector('.scene-card-status');
    const bodyEl=card.querySelector('.scene-card-body');
    const titleText='🎬 Scène '+(i+1);
    if(titleEl.textContent!==titleText)titleEl.textContent=titleText;
    const nc='scene-card '+(v.status==='done'?'done':v.status==='error'?'error':(v.status==='loading'||v.status==='pending')?'generating':'');
    if(card.className!==nc)card.className=nc;
    if(v.status==='done'&&v.url){
      if(card.dataset.url!==v.url||!bodyEl.querySelector('video')){
        statusEl.innerHTML='<span style="color:var(--ok);">✓</span>';
        bodyEl.innerHTML='';
        const video=document.createElement('video');
        video.src=v.url;video.controls=true;video.preload='metadata';video.setAttribute('playsinline','');
        bodyEl.appendChild(video);
        const dl=document.createElement('a');
        dl.className='scene-download';dl.href=v.url;dl.target='_blank';dl.rel='noopener noreferrer';dl.setAttribute('download','scene-'+(i+1)+'.mp4');dl.textContent='⬇ Télécharger';
        bodyEl.appendChild(dl);
        card.dataset.url=v.url;
      }
    }else if(v.status==='error'){
      if(card.dataset.status!=='error'){
        statusEl.innerHTML='<span style="color:var(--err);">✕</span>';
        bodyEl.innerHTML='<div class="scene-placeholder" style="color:var(--err);">Erreur : '+esc(v.error||'inconnue')+'</div>';
      }
    }else{
      statusEl.innerHTML='<span class="spinner-mini"></span>';
      const p=v.progress||'En attente…';
      if(card.dataset.progress!==p||card.dataset.status!==v.status)bodyEl.innerHTML='<div class="scene-placeholder"><div class="spinner-mini"></div><span>'+esc(p)+'</span></div>';
    }
    card.dataset.status=v.status||'';card.dataset.progress=v.progress||'';
  });
  const c=document.getElementById('videos-count');
  if(c)c.textContent=state.videos.filter(v=>v.status==='done').length+'/'+state.videos.length;
}

// ══════════════════════════════════════════════════════════════════
// PROMPT BUILDERS
// ══════════════════════════════════════════════════════════════════
function buildScriptPrompt(){
  const d=DIRECTORS.find(x=>x.id===state.directorId)||DIRECTORS[0];
  const p=PALETTES.find(x=>x.id===state.paletteId)||PALETTES[0];
  const n=state.sceneCount;
  const dur=state.durationSeconds;
  return [
    'You are a screenwriter and visual director. Create a short cinematic film.',
    '',
    'IDEA: '+state.idea,
    '',
    'CONSTRAINTS:',
    '- Style: '+d.name+' — '+d.sig,
    '- Color palette ('+p.label+'): '+p.colors.join(', ')+'.',
    '- '+n+' scenes, each ~'+dur+' seconds.',
    '- Format: '+state.ratio+'.',
    '- NO MUSIC. Only diegetic sound (footsteps, breath, wind, ambient).',
    '',
    'CHARACTERS: define 1 to 3 characters, each with a name and a VERY PRECISE visual description (age, species, clothing, colors, distinctive features). The SAME description must be reused identically across all scenes for consistency.',
    '',
    'MONTAGE: each scene is a MONTAGE of 3 to 5 SHOTS with HARD CUTS. Types of shots: wide symmetric shot, medium shot, close-up, shot-reverse-shot (champ-contrechamp), insert cut. Camera moves: locked-off, slow dolly-in, whip pan, lateral tracking, crane on axis.',
    '',
    'DIALOGUE: each scene must have ONE short French line (6-15 words), spoken by a character. Line 1 opens the film, line N closes it.',
    '',
    'CRITICAL JSON RULES:',
    '- All strings on a SINGLE LINE. No real line breaks inside strings.',
    '- Escape any double quote as \\". No trailing commas. No markdown. No commentary.',
    '',
    'OUTPUT FORMAT (return ONLY this JSON):',
    '{',
    '  "title": "short poetic title",',
    '  "logline": "one-sentence summary",',
    '  "characters": [',
    '    { "id": "c1", "name": "Name", "appearance": "VERY precise visual description (species, age, clothing, colors, features)" }',
    '  ],',
    '  "scenes": [',
    '    {',
    '      "scene_number": 1,',
    '      "character_id": "c1",',
    '      "decor": "detailed english description of the set for this scene",',
    '      "action": "detailed english description of what happens (motion, gestures, atmosphere)",',
    '      "shots": [',
    '        { "shot_number": 1, "camera": { "type": "wide symmetric shot", "movement": "locked-off", "framing": "centered wide" }, "description": "english description of shot 1" },',
    '        { "shot_number": 2, "camera": { "type": "medium shot", "movement": "slow dolly-in", "framing": "centered medium" }, "description": "english description of shot 2" },',
    '        { "shot_number": 3, "camera": { "type": "close-up", "movement": "locked-off", "framing": "centered close-up" }, "description": "english description of shot 3" }',
    '      ],',
    '      "dialogue": { "speaker": "Name", "line_fr": "short French line (6-15 words)" }',
    '    }',
    '    ... exactly '+n+' scenes ...',
    '  ]',
    '}'
  ].join('\n');
}

function buildVideoPromptFromScene(scene,script){
  const d=DIRECTORS.find(x=>x.id===state.directorId)||DIRECTORS[0];
  const p=PALETTES.find(x=>x.id===state.paletteId)||PALETTES[0];
  const ch=(script.characters||[]).find(c=>c.id===scene.character_id)||{};
  const spoken=(scene.dialogue&&scene.dialogue.line_fr)||'';
  const shots=Array.isArray(scene.shots)?scene.shots:[];
  let montageBlock='MONTAGE — '+shots.length+' SHOTS WITH HARD CUTS:\n'+shots.map((sh,i)=>{const c=sh.camera||{};return '  SHOT '+(i+1)+' — '+(c.type||'symmetric shot')+' / '+(c.movement||'locked-off')+' / '+(c.framing||'centered')+' : '+(sh.description||'')}).join('\n');
  if(shots.length===0)montageBlock='MONTAGE — 3 SHOTS WITH HARD CUTS: wide → medium → close-up.';
  return [
    'CINEMATIC SHORT FILM — '+state.durationSeconds+'-SECOND SCENE.',
    'STYLE: '+d.name+' — '+d.sig,
    'PALETTE: '+p.label+' → '+p.colors.join(', ')+'. Every color from this palette.',
    '',
    ch.name?('CHARACTER: '+ch.name+' — '+ch.appearance+'. The character must remain visually IDENTICAL to the reference image (same face, same colors, same outfit).'):'',
    'DECOR: '+(scene.decor||''),
    'ACTION: '+(scene.action||''),
    '',
    montageBlock,
    '',
    spoken?('SPOKEN LINE (French, character speaks to camera): "'+spoken+'"'):'',
    '',
    'AUDIO: NO MUSIC. Only diegetic sound (footsteps, breath, wind, ambience).',
    'FORMAT: '+state.ratio+', 24fps, cinematic, film grain, high detail.',
    'No text, no subtitles, no watermarks.',
    'Perfect continuity between the reference image and the animated scene.'
  ].filter(Boolean).join('\n');
}

// ══════════════════════════════════════════════════════════════════
// PIPELINE
// ══════════════════════════════════════════════════════════════════
async function generateScript(){
  debugLog('state','SCRIPT','Génération du scénario…');
  setStatus('Étape 1/4 — Écriture du scénario…');
  const prompt=buildScriptPrompt();
  const sys='You are a screenwriter and visual director. You ALWAYS return valid JSON exactly matching the requested schema. All strings on single lines. No markdown. No commentary.';
  const content=await callChatCompletion(sys,prompt,'Scénario',16000,0.8);
  if(!content)throw new Error('Pas de contenu scénario');
  const script=extractJson(content);
  if(!script||!script.scenes||!Array.isArray(script.scenes))throw new Error('JSON scénario invalide');
  if(script.scenes.length>state.sceneCount)script.scenes=script.scenes.slice(0,state.sceneCount);
  if(!script.characters||!Array.isArray(script.characters)||script.characters.length===0){
    script.characters=[{id:'c1',name:'Héros',appearance:'a determined protagonist with distinctive features'}];
  }
  script.scenes.forEach((sc,i)=>{
    sc.scene_number=i+1;
    if(!sc.character_id||!script.characters.some(c=>c.id===sc.character_id))sc.character_id=script.characters[0].id;
    if(!Array.isArray(sc.shots)||sc.shots.length===0){
      sc.shots=[
        {shot_number:1,camera:{type:'wide symmetric shot',movement:'locked-off',framing:'centered wide'},description:'wide symmetric tableau'},
        {shot_number:2,camera:{type:'medium shot',movement:'slow dolly-in',framing:'centered medium'},description:'centered medium shot'},
        {shot_number:3,camera:{type:'close-up',movement:'locked-off',framing:'centered close-up'},description:'close-up on the character'}
      ];
    }
    if(!sc.dialogue||!sc.dialogue.line_fr){
      sc.dialogue={speaker:(script.characters.find(c=>c.id===sc.character_id)||{}).name||'Narrateur',line_fr:i===0?'Le film commence ici.':i===state.sceneCount-1?'Et le film se referme.':'Et la scène continue.'};
    }
  });
  state.script=script;
  renderScript();
  document.getElementById('section-script').classList.remove('hidden');
  document.getElementById('section-script').classList.add('open');
  debugLog('success','SCRIPT',script.scenes.length+' scènes, '+script.characters.length+' personnages');
  return script;
}

async function generateCharacters(script){
  debugLog('state','CHARS','Génération des personnages…');
  setStatus('Étape 2/4 — Création des personnages…');
  state.characters=[];
  document.getElementById('section-characters').classList.remove('hidden');
  document.getElementById('section-characters').classList.add('open');
  for(const c of (script.characters||[])){
    state.characters.push({id:c.id,name:c.name,url:null,status:'loading'});
  }
  renderCharacters();

  for(let i=0;i<state.characters.length;i++){
    if(state.stopRequested)return;
    const c=state.characters[i];
    try{
      const prompt='Character reference sheet, full body, neutral pose, plain white background: '+c.name+' — '+((script.characters.find(x=>x.id===c.id)||{}).appearance||'')+'. Style: '+DIRECTORS.find(d=>d.id===state.directorId).name+'. Palette: '+PALETTES.find(p=>p.id===state.paletteId).colors.join(', ')+'. Consistent character design, cinematic, detailed. No text, no watermark.';
      const url=await generateImage(prompt);
      c.url=url;
      c.status='done';
      renderCharacters();
      debugLog('success','CHAR',c.name+' ✓');
    }catch(e){
      if(e.message==='Arrêt demandé')return;
      c.status='error';
      renderCharacters();
      debugLog('error','CHAR',c.name+' : '+e.message);
    }
  }
}

async function generateVideos(script){
  debugLog('state','VIDEOS','Génération des vidéos…');
  setStatus('Étape 3/4 — Génération des scènes vidéo…');
  state.videos=[];
  const scenes=script.scenes||[];
  for(let i=0;i<scenes.length;i++){
    state.videos.push({status:'pending',url:null,prompt:'',progress:'En attente…'});
  }
  renderVideos();
  document.getElementById('section-videos').classList.remove('hidden');
  document.getElementById('section-videos').classList.add('open');

  const workerCount=Math.max(1,state.keyPool.filter(k=>k.active).length);
  debugLog('info','VIDEOS',workerCount+' worker(s) parallèle(s) pour '+scenes.length+' scènes · modèle : '+MODEL_VIDEO+' · '+state.durationSeconds+'s chacune');

  const queue=scenes.map((scene,index)=>({scene,index}));
  const workers=[];
  for(let w=0;w<workerCount;w++)workers.push(videoWorker(w,queue,script));
  await Promise.all(workers);
  debugLog('success','VIDEOS',state.videos.filter(v=>v.status==='done').length+'/'+scenes.length+' vidéos');
}

async function videoWorker(workerId,queue,script){
  while(queue.length>0&&!state.stopRequested){
    const task=queue.shift();
    if(!task)break;
    await generateOneVideo(task.scene,task.index,script,workerId);
  }
}

async function generateOneVideo(scene,index,script,workerId){
  if(state.stopRequested)return;
  const prompt=buildVideoPromptFromScene(scene,script);
  state.videos[index].status='loading';
  state.videos[index].prompt=prompt;
  state.videos[index].progress='Initialisation…';
  renderVideos();

  const ch=(script.characters||[]).find(c=>c.id===scene.character_id)||{};
  const line=(scene.dialogue&&scene.dialogue.line_fr)||'';
  debugLog('info','W'+(workerId+1),'Scène '+(index+1)+' ['+(ch.name||'?')+'] : '+(line?('« '+line.slice(0,40)+'… »'):'(pas de dialogue)'));

  try{
    const charImg=state.characters.find(c=>c.id===scene.character_id&&c.status==='done');
    const anchorUrl=charImg?charImg.url:null;

    let videoIdObj=null;
    try{
      videoIdObj=await createVideoTask(prompt,anchorUrl,state.durationSeconds);
    }catch(e){
      if((e.status===400||/image/i.test(e.message||''))&&anchorUrl){
        debugLog('warn','VIDÉO','Anchor refusé → retry sans image');
        videoIdObj=await createVideoTask(prompt,null,state.durationSeconds);
      }else throw e;
    }

    const videoUrl=await pollVideo(videoIdObj,(prog)=>{state.videos[index].progress=prog;renderVideos()});
    state.videos[index]={status:'done',url:videoUrl,prompt};
    renderVideos();
    debugLog('success','W'+(workerId+1),'Scène '+(index+1)+' ✓');
  }catch(e){
    if(e.message==='Arrêt demandé')return;
    state.videos[index]={status:'error',url:null,prompt,error:e.message};
    renderVideos();
    debugLog('error','W'+(workerId+1),'Scène '+(index+1)+' : '+e.message);
  }
}

async function runPipeline(){
  if(state.isRunning)return;
  if(!hasActiveKey()){showToast('Ajoutez au moins une clé API','error');return}
  const idea=document.getElementById('idea-input').value.trim();
  if(idea.length<10){showToast('Décrivez votre idée (10 caractères min)','error');return}

  state.isRunning=true;
  state.stopRequested=false;
  state.idea=idea;
  state.script=null;
  state.characters=[];
  state.videos=[];
  state.workingPollUrlBuilder=null;
  document.getElementById('section-script').classList.add('hidden');
  document.getElementById('section-characters').classList.add('hidden');
  document.getElementById('section-videos').classList.add('hidden');
  document.getElementById('section-player').classList.add('hidden');
  document.getElementById('script-view').innerHTML='';
  document.getElementById('characters-grid').innerHTML='';
  document.getElementById('videos-grid').innerHTML='';
  updateButtons();
  document.getElementById('stop-btn').classList.add('visible');

  const t0=Date.now();
  try{
    const script=await generateScript();
    if(state.stopRequested)throw new Error('Arrêt demandé');
    await generateCharacters(script);
    if(state.stopRequested)throw new Error('Arrêt demandé');
    await generateVideos(script);
    if(state.stopRequested)throw new Error('Arrêt demandé');
    document.getElementById('section-player').classList.remove('hidden');
    document.getElementById('section-player').classList.add('open');
    const elapsed=((Date.now()-t0)/1000).toFixed(0);
    setStatus('✦ Film prêt — '+state.videos.filter(v=>v.status==='done').length+'/'+state.videos.length+' scènes · '+elapsed+'s');
    showToast('Film prêt !','success',3500);
    await sleep(4500);
    setStatus(null);
  }catch(e){
    if(e.message==='Arrêt demandé'){setStatus('Arrêté');await sleep(1500);setStatus(null)}
    else if(e.message==='MODEL_NOT_AVAILABLE'){
      debugLog('error','MODÈLE','Modèle vidéo indisponible');
      setStatus('Modèle vidéo indisponible');
      showToast('Modèle vidéo indisponible — cliquez sur « Tester les clés »','error',5000);
      await sleep(3500);setStatus(null);
    }
    else{debugLog('error','PIPELINE',e.message);setStatus('Erreur : '+e.message.slice(0,60));showToast('Erreur : '+e.message.slice(0,50),'error',4000);await sleep(3000);setStatus(null)}
  }

  state.isRunning=false;
  state.stopRequested=false;
  document.getElementById('stop-btn').classList.remove('visible');
  updateButtons();
}

// ══════════════════════════════════════════════════════════════════
// PLAYER + TTS
// ══════════════════════════════════════════════════════════════════
let ttsVoice=null;
function pickFrenchVoice(){if(!('speechSynthesis' in window))return null;const v=window.speechSynthesis.getVoices();if(!v||v.length===0)return null;const fr=v.filter(x=>x.lang&&x.lang.toLowerCase().startsWith('fr'));if(fr.length===0)return null;return fr.find(x=>/premium|enhanced|amelie|thomas|audrey|marie/i.test(x.name))||fr[0]}
function initTTS(){if(!('speechSynthesis' in window))return;const u=()=>{ttsVoice=pickFrenchVoice();if(ttsVoice)debugLog('success','TTS','Voix : '+ttsVoice.name)};u();window.speechSynthesis.onvoiceschanged=u}
function speakFR(text){if(!state.voiceEnabled)return;if(!('speechSynthesis' in window))return;if(!text)return;try{window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fr-FR';u.rate=1.0;u.pitch=1.0;u.volume=1.0;if(ttsVoice)u.voice=ttsVoice;window.speechSynthesis.speak(u);state.currentUtterance=u}catch(e){}}
function stopTTS(){try{if('speechSynthesis' in window)window.speechSynthesis.cancel()}catch(e){}state.currentUtterance=null}

async function playFilm(){
  const ready=state.videos.filter(v=>v.status==='done'&&v.url);
  if(ready.length===0){showToast('Aucune vidéo à lire','error');return}
  if(state.isPlayingFilm)return;
  state.isPlayingFilm=true;updateButtons();

  const overlay=document.getElementById('player-overlay');
  const canvas=document.getElementById('player-canvas');
  const hint=document.getElementById('player-hint-overlay');
  if(!overlay||!canvas)return;
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const cssW=window.innerWidth;const cssH=window.innerHeight;
  canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);
  canvas.style.width=cssW+'px';canvas.style.height=cssH+'px';
  const ctx=canvas.getContext('2d');
  overlay.classList.add('visible');
  hint.classList.remove('hidden');setTimeout(()=>hint.classList.add('hidden'),3500);
  try{if('speechSynthesis' in window){const u=new SpeechSynthesisUtterance(' ');u.volume=0;window.speechSynthesis.speak(u)}}catch(e){}

  const scenes=state.script.scenes||[];
  const readyWithScene=ready.map(v=>{const oi=state.videos.indexOf(v);return{video:v,scene:scenes[oi]||{}}});

  for(let i=0;i<readyWithScene.length;i++){
    if(!state.isPlayingFilm)break;
    const{video,scene}=readyWithScene[i];
    await playOneScene(video,scene,ctx,canvas,dpr);
  }
  stopFilmPlayback();
}

function playOneScene(videoObj,scene,ctx,canvas,dpr){
  return new Promise((resolve)=>{
    const video=document.createElement('video');
    video.src=videoObj.url;video.playsInline=true;video.muted=true;
    let ttsFired=false,finished=false;
    const finish=()=>{if(finished)return;finished=true;resolve()};
    const startTTS=()=>{if(ttsFired)return;ttsFired=true;const l=(scene.dialogue&&scene.dialogue.line_fr)||'';if(l)speakFR(l)};
    const ttsGuard=setTimeout(()=>startTTS(),2000);

    const drawOverlay=(w,h)=>{
      const t=video.currentTime||0;const dur=video.duration||6;
      let alpha=1;if(t<0.4)alpha=t/0.4;else if(dur-t<0.5)alpha=Math.max(0,(dur-t)/0.5);
      if(alpha<=0)return;
      const pad=Math.round(Math.min(30*dpr,w*0.03));
      const bandH=Math.round(Math.min(96*dpr,h*0.16));
      const bandY=h-bandH-pad;const bandX=pad;const bandW=w-pad*2;
      ctx.save();ctx.globalAlpha=alpha;
      const grad=ctx.createLinearGradient(bandX,bandY,bandX,bandY+bandH);
      grad.addColorStop(0,'rgba(10,10,18,0.0)');grad.addColorStop(0.35,'rgba(10,10,18,0.85)');grad.addColorStop(1,'rgba(10,10,18,0.95)');
      ctx.fillStyle=grad;ctx.fillRect(bandX,bandY,bandW,bandH);
      ctx.fillStyle='#e5c15a';ctx.fillRect(bandX,bandY+Math.round(bandH*0.15),Math.round(5*dpr),bandH-Math.round(bandH*0.3));
      const name=(scene.dialogue&&scene.dialogue.speaker)||(state.script.characters.find(c=>c.id===scene.character_id)||{}).name||'';
      const nameSize=Math.round(Math.min(15*dpr,h*0.022));
      const textSize=Math.round(Math.min(22*dpr,h*0.032));
      if(name){ctx.fillStyle='#e5c15a';ctx.font='700 '+nameSize+'px -apple-system, sans-serif';ctx.textBaseline='top';ctx.fillText(name.toUpperCase(),bandX+Math.round(bandH*0.22),bandY+Math.round(bandH*0.18))}
      const line=(scene.dialogue&&scene.dialogue.line_fr)||'';
      if(line){ctx.fillStyle='#f5f0e1';ctx.font='500 '+textSize+'px -apple-system, sans-serif';ctx.textBaseline='top';let txt=line;const maxW=bandW-Math.round(bandH*0.4);while(ctx.measureText(txt).width>maxW&&txt.length>4){txt=txt.slice(0,-4)+'…'}ctx.fillText(txt,bandX+Math.round(bandH*0.22),bandY+Math.round(bandH*0.5))}
      ctx.restore();
    };
    const draw=()=>{
      ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);
      const vw=video.videoWidth||720;const vh=video.videoHeight||1280;
      const ar=vw/vh;const car=canvas.width/canvas.height;
      let dw,dh,dx,dy;
      if(ar>car){dw=canvas.width;dh=canvas.width/ar;dx=0;dy=(canvas.height-dh)/2}
      else{dh=canvas.height;dw=canvas.height*ar;dx=(canvas.width-dw)/2;dy=0}
      try{ctx.drawImage(video,dx,dy,dw,dh)}catch(e){}
      drawOverlay(canvas.width,canvas.height);
    };
    const loop=()=>{if(!state.isPlayingFilm){clearTimeout(ttsGuard);finish();return}if(video.paused||video.ended){clearTimeout(ttsGuard);finish();return}draw();state.playRAF=requestAnimationFrame(loop)};
    video.onloadedmetadata=()=>{clearTimeout(ttsGuard);startTTS();video.play().then(()=>loop()).catch(()=>{startTTS();finish()})};
    video.oncanplay=()=>startTTS();
    video.onended=()=>{clearTimeout(ttsGuard);finish()};
    video.onerror=()=>{startTTS();clearTimeout(ttsGuard);finish()};
    video.load();
  });
}

function stopFilmPlayback(){
  state.isPlayingFilm=false;
  if(state.playRAF)cancelAnimationFrame(state.playRAF);
  state.playRAF=null;
  stopTTS();
  const o=document.getElementById('player-overlay');
  if(o)o.classList.remove('visible');
  updateButtons();
}

// ══════════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════════
(function init(){
  document.getElementById('api-save-btn').addEventListener('click',saveKeysFromUI);
  document.getElementById('api-test-btn').addEventListener('click',testKeysAndModels);
  document.getElementById('api-keys-input').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();saveKeysFromUI()}});

  document.querySelectorAll('[data-toggle]').forEach(h=>{h.addEventListener('click',()=>{const el=document.getElementById(h.dataset.toggle);if(el)el.classList.toggle('open')})});

  document.getElementById('idea-input').addEventListener('input',updateButtons);
  document.getElementById('scene-count-select').addEventListener('change',e=>{state.sceneCount=parseInt(e.target.value,10);updateButtons()});
  document.getElementById('duration-select').addEventListener('change',e=>{state.durationSeconds=parseInt(e.target.value,10);updateButtons()});
  document.getElementById('ratio-select').addEventListener('change',e=>{state.ratio=e.target.value;updateButtons()});

  // Choix du modèle
  document.getElementById('model-choice').addEventListener('click',e=>{
    const opt=e.target.closest('.model-opt');
    if(!opt)return;
    USER_MODEL_CHOICE=opt.dataset.model;
    if(USER_MODEL_CHOICE==='auto'){
      if(state.availableModels.length>0){
        const hasFull=state.availableModels.some(m=>m.match(/video-2\.5(?!.*flash)/)&&!m.includes('flash'));
        MODEL_VIDEO=hasFull?'agnes-video-2.5':'agnes-video-2.5-flash';
      }else{
        MODEL_VIDEO='agnes-video-2.5-flash';
      }
    }else{
      MODEL_VIDEO=USER_MODEL_CHOICE;
    }
    document.getElementById('video-model-display').textContent=MODEL_VIDEO;
    renderModelChoice();
    updateButtons();
    debugLog('info','MODÈLE','Choix utilisateur : '+USER_MODEL_CHOICE+' → modèle actif : '+MODEL_VIDEO);
  });

  document.getElementById('generate-btn').addEventListener('click',runPipeline);
  document.getElementById('stop-btn').addEventListener('click',()=>{state.stopRequested=true;stopTTS();debugLog('warn','STOP','Arrêt demandé');setStatus('Arrêt en cours…');showToast('Arrêt — les scènes déjà lancées se termineront (et seront débitées)','warn',5000)});

  document.getElementById('play-film-btn').addEventListener('click',playFilm);
  document.getElementById('replay-btn').addEventListener('click',playFilm);
  document.getElementById('player-overlay').addEventListener('click',stopFilmPlayback);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.isPlayingFilm)stopFilmPlayback()});

  document.getElementById('voice-toggle').addEventListener('change',e=>{state.voiceEnabled=e.target.checked;if(!state.voiceEnabled)stopTTS()});

  document.getElementById('debug-header').addEventListener('click',e=>{if(e.target.tagName==='BUTTON')return;toggleDebugCollapse()});
  document.getElementById('debug-collapse-btn').addEventListener('click',e=>{e.stopPropagation();toggleDebugCollapse()});
  document.getElementById('debug-clear-btn').addEventListener('click',e=>{e.stopPropagation();clearDebug()});
  document.getElementById('debug-copy-btn').addEventListener('click',e=>{e.stopPropagation();copyDebug()});

  refreshKeyPool();
  updateApiPanel();
  renderDirectors();
  renderPalettes();
  renderIdeaPresets();
  renderModelChoice();
  initTTS();
  setInterval(renderKeysStatus,1000);
  updateButtons();

  debugLog('success','INIT','Ciné IA v5 — MODÈLE 2.5 CORRIGÉ + clés sk- et cpk-');
  debugLog('info','INIT','Format vidéo 2.5 : seconds (4-12), mode text/keyframe, size 720P (flash)');
  debugLog('info','INIT','Champs obsolètes SUPPRIMÉS : num_frames, frame_rate, image, height, width');
  debugLog('info','INIT','Utilisez « Tester les clés » pour détecter les modèles disponibles');
})();
