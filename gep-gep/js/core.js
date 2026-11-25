/* =========================================================
   Gep Gep — çekirdek: dil, metinler, yardımcılar, ses, yapay zeka, sekmeler
   ========================================================= */

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- Kalıcı kayıt (sadece bu telefonda) ---------- */
const Store = {
  get(k, d){ try{ const v = localStorage.getItem('gep-'+k); return v===null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('gep-'+k, JSON.stringify(v)); }catch(e){} },
  del(k){ try{ localStorage.removeItem('gep-'+k); }catch(e){} },
  clearAll(){ try{ Object.keys(localStorage).filter(k=>k.startsWith('gep-')).forEach(k=>localStorage.removeItem(k)); }catch(e){} }
};

/* Eski sürümden kalan düz metin anahtarı taşı */
(function migrate(){
  try{
    const old = localStorage.getItem('gep-key');
    if(old && !old.startsWith('"')) localStorage.setItem('gep-key', JSON.stringify(old));
    const l = localStorage.getItem('gep-lang');
    if(l && !l.startsWith('"')) localStorage.setItem('gep-lang', JSON.stringify(l));
  }catch(e){}
})();

let lang = Store.get('lang', (navigator.language||'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en');
const getKey = () => Store.get('key', '');
const hasAI = () => !!getKey() || !!GEP.proxy;

/* ---------- Metinler ---------- */
const UI = {
  tr:{
    tabGezi:"Gezi", tabSky:"Gökyüzü", tabShop:"Alışveriş", tabLog:"Günlük",
    // Gezi
    eyebrow:"Gezi · İstanbul", intro:"Beş durak, yaklaşık bir saatlik yürüyüş. Durağa gel, dinle.",
    eyebrowNear:"Gezi · bulunduğun yer",
    introNear:(n,km,yuru)=>`${n} durak, toplam yaklaşık ${km}${yuru?' yürüyüş':' yol'}. Durağa gel, dinle.`,
    nearest:"En yakın durak", next:"Sıradaki durak", here:"Buradasın", first:"İlk durak", visitedTag:"Gezildi",
    listen:"Dinle", stop:"Durdur", minutes:"dk dinleme", read:"Yazısını oku", hide:"Yazıyı gizle",
    markVisited:"Gittim olarak işaretle", unmark:"İşareti kaldır",
    locate:"Konumumu bul", locating:"Konum aranıyor…", away:"uzakta",
    denied:"Konum izni verilmedi; durağı listeden ya da aramadan seçebilirsin.",
    route:"Rota", stopsN:n=>`${n} durak`, mapBtn:"Rotayı haritada başlat",
    mapTitle:"Harita", mapMe:"Beni göster",
    searching:"Yakındaki gezilecek yerler aranıyor…",
    none:"Bu çevrede kayıtlı gezilecek yer bulunamadı. Galata örnek turu gösteriliyor.",
    netErr:"Yerler yüklenemedi. İnternetini kontrol et.",
    offlineRoute:"İnternet yok; kayıtlı rota açıldı.",
    searchPh:"Şehir ya da semt ara", searchBtn:"Ara", notFound:"Bu yer bulunamadı",
    sample:"Örnek tur: Galata", myPlace:"Bulunduğum yere dön",
    photoCredit:"Fotoğraf: Wikipedia", src:"Kaynak: Vikipedi", srcAi:"Kaynak: Vikipedi · anlatım yapay zekâ (Gemini), hata içerebilir",
    farTitle:"Biraz uzakta", farMeta:"görülmeye değer",
    progress:(a,b)=>`${a}/${b} durak gezildi`, progressDone:"Rota tamamlandı",
    arrived:n=>`${n} durağına vardın`, routeDone:"Tebrikler, rotayı tamamladın!",
    saveRoute:"Rotayı kaydet", saved:"Kaydedildi ✓", savedToast:"Rota kaydedildi; internet olmadan da açılır",
    resetRoute:"Baştan başla", resetToast:"İşaretler sıfırlandı",
    drive:"araçla", walk:"yürüyerek",
    // Kamera
    cam:"Kameraya tut", camHint:"Bir yapıya ya da tabelaya tut", camHintLabel:"Ürün etiketini çerçeveye al",
    scanning:"İnceleniyor…", seen:"Kameranın gördüğü", again:"Tekrar çek", unsure:"Emin olamadım",
    camErr:"Kamera açılamadı. Ayarlar'dan Safari'ye kamera izni ver.",
    aiErr:"Cevap alınamadı. İnternetini ya da anahtarını kontrol et.",
    keyTitle:"Kamera için tek seferlik ayar",
    keyText:"Kamera, gördüğünü Google'ın Gemini yapay zekasına sorarak tanıyor. Bunun için ücretsiz bir Gemini anahtarı gerekiyor. Anahtar sadece bu telefonda saklanır.",
    keyLink:"Anahtarı buradan al", keyPh:"Gemini anahtarını yapıştır", save:"Kaydet ve devam et", keySaved:"Anahtar kaydedildi",
    // Gökyüzü
    skyEyebrow:"Gökyüzü · şu an", skyTitle:"Gökyüzü", skyIntro:"Telefonu göğe tut; Ay'ı, gezegenleri ve parlak yıldızları göstersin.",
    skyStart:"Telefonu göğe tut", skyStarted:"Pusula açık", skyHint:"Parmağınla kaydırarak da gezebilirsin",
    skyNeedLoc:"Doğru gökyüzü için konum izni ver; şimdilik İstanbul'a göre hesaplanıyor.",
    skyListTitle:"Şu an görülebilenler", skyListMeta:n=>`${n} gök cismi`, skyNone:"Şu an ufkun üstünde parlak bir gök cismi yok.",
    moonTitle:"Ay'ın hali", below:"ufkun altında", up:"yukarıda",
    skyAim:"Bir gök cismini dairenin içine getir",
    dirs:["Kuzey","Kuzeydoğu","Doğu","Güneydoğu","Güney","Güneybatı","Batı","Kuzeybatı"],
    types:{star:"Yıldız", planet:"Gezegen", moon:"Uydu", sun:"Yıldız (Güneş)"},
    sunWarn:"Güneş'e asla doğrudan ya da kamerayla bakma.",
    phases:["Yeni Ay","Hilal","İlk dördün","Şişkin Ay","Dolunay","Şişkin Ay","Son dördün","Hilal"],
    lit:p=>`Yüzde ${p}'i aydınlık`, nextFull:d=>`Dolunaya ${d} gün`, nextNew:d=>`Yeni Ay'a ${d} gün`,
    mag:m=>`Parlaklık ${m}`, compassErr:"Bu cihazda pusula kullanılamıyor; parmağınla kaydır.",
    // Alışveriş
    shopEyebrow:"Alışveriş", shopTitle:"Etiketi oku", shopIntro:"Ürün etiketini ya da paketini kameraya tut; ne olduğunu, artısını eksisini söylesin.",
    shopScan:"Etiketi tara", shopHistTitle:"Son taradıkların", shopHistMeta:n=>`${n} ürün`,
    pros:"Artıları", cons:"Dikkat edilecekler", ingredients:"İçerik notu", features:"Ürün özellikleri", tech:"Teknik bilgiler", techSrc:"Google aramasından derlendi; satın almadan önce satıcıdan doğrula.", price:"Fiyat yorumu", users:"Kullanıcıların genel görüşü",
    nutri:"Besin notu", nova:"İşlenmişlik", offSrc:"Kaynak: Open Food Facts", barcode:"Barkod",
    shopFine:"Yorumlar yapay zekanın genel bilgisidir; alerji ve sağlık konularında her zaman etiketin kendisine bak.",
    noProduct:"Ürünü tanıyamadım. Etiketi daha yakından ve net çekmeyi dene.",
    // Günlük
    logEyebrow:"Günlük", logTitle:"Gezi defterim", logIntro:"Gittiğin yerler, kaydettiğin rotalar ve kamerayla tanıdıkların burada.",
    statCity:"şehir", statStop:"durak", statProduct:"ürün", statSeen:"tanıma",
    savedTitle:"Kayıtlı rotalar", savedMeta:"internetsiz açılır", savedEmpty:"Gezi'de \"Rotayı kaydet\"e basınca burada görünür.",
    visitTitle:"Gezdiğin duraklar", visitEmpty:"Henüz işaretlenmiş durak yok.",
    seenTitle:"Kamerayla tanıdıkların", seenEmpty:"Kamerayla bir şey tanıttığında burada görünür.",
    setTitle:"Ayarlar", setKey:"Gemini anahtarı", setKeyOn:"Kayıtlı", setKeyOff:"Girilmedi", change:"Değiştir", add:"Ekle",
    setRate:"Anlatım hızı", setRateSub:"Sesli okuma hızı", setClear:"Tüm verileri sil", setClearSub:"Günlük, rotalar ve anahtar silinir", delBtn:"Sil",
    clearConfirm:"Günlük, kayıtlı rotalar ve anahtar bu telefondan silinsin mi?", cleared:"Veriler silindi", open:"Aç",
    soon:"Bu bölüm yakında geliyor",
    share:"Paylaş", sharePrep:"Paylaşım kartı hazırlanıyor…", shareCopied:"Link kopyalandı; görsel indirildi",
    shareDoneBtn:"Başarını paylaş", doneBadge:(a,b)=>`✓ ${a}/${b} durak`,
    shStop:(ad,place)=>`${place ? place+' gezimde' : 'Gezimde'} dinledim: ${ad}`,
    shRoute:(place,n)=>`${place} rotamı tamamladım: ${n}/${n} durak!`,
    shSky:ad=>`Bu gece gökyüzünde buldum: ${ad}`, shProduct:ad=>`Etiketini okuttum: ${ad}`, shSeen:ad=>`Kameramla tanıdım: ${ad}`,
    cardStop:"Gezi", cardRoute:"Rota tamamlandı", cardSky:"Bu gece gökyüzünde", cardProduct:"Etiketi okudum", cardSeen:"Kameranın gördüğü"
  },
  en:{
    tabGezi:"Walk", tabSky:"Sky", tabShop:"Shopping", tabLog:"Journal",
    eyebrow:"Walk · Istanbul", intro:"Five stops, about an hour's walk. Reach a stop, press play.",
    eyebrowNear:"Walk · where you are",
    introNear:(n,km,yuru)=>`${n} stops, about ${km}${yuru?' on foot':' in total'}. Reach a stop, press play.`,
    nearest:"Nearest stop", next:"Next stop", here:"You are here", first:"First stop", visitedTag:"Visited",
    listen:"Listen", stop:"Stop", minutes:"min listen", read:"Read the text", hide:"Hide the text",
    markVisited:"Mark as visited", unmark:"Unmark",
    locate:"Find my location", locating:"Finding you…", away:"away",
    denied:"Location wasn't allowed; pick a stop from the list or search.",
    route:"Route", stopsN:n=>`${n} stops`, mapBtn:"Start the route in Maps",
    mapTitle:"Map", mapMe:"Show me",
    searching:"Looking for places to see nearby…",
    none:"No listed sights around here. Showing the Galata sample tour.",
    netErr:"Couldn't load places. Check your connection.",
    offlineRoute:"You're offline; opened the saved route.",
    searchPh:"Search a city or area", searchBtn:"Go", notFound:"Place not found",
    sample:"Sample tour: Galata", myPlace:"Back to where I am",
    photoCredit:"Photo: Wikipedia", src:"Source: Wikipedia", srcAi:"Source: Wikipedia · told by AI (Gemini), may contain errors",
    farTitle:"A little further", farMeta:"worth the trip",
    progress:(a,b)=>`${a} of ${b} stops visited`, progressDone:"Route complete",
    arrived:n=>`You've reached ${n}`, routeDone:"Well done, you finished the route!",
    saveRoute:"Save route", saved:"Saved ✓", savedToast:"Route saved; it opens without internet too",
    resetRoute:"Start over", resetToast:"Marks cleared",
    drive:"by car", walk:"on foot",
    cam:"Point the camera", camHint:"Point at a building or a sign", camHintLabel:"Frame the product label",
    scanning:"Looking…", seen:"What the camera sees", again:"Take another", unsure:"Not sure",
    camErr:"Couldn't open the camera. Allow camera access for Safari in Settings.",
    aiErr:"No answer came back. Check your connection or your key.",
    keyTitle:"One-time setup for the camera",
    keyText:"The camera recognises things by asking Google's Gemini AI. That needs a free Gemini key, which is stored only on this phone.",
    keyLink:"Get a key here", keyPh:"Paste your Gemini key", save:"Save and continue", keySaved:"Key saved",
    skyEyebrow:"Sky · right now", skyTitle:"Sky", skyIntro:"Hold your phone up to the sky to find the Moon, the planets and the brightest stars.",
    skyStart:"Point at the sky", skyStarted:"Compass on", skyHint:"You can also drag with your finger",
    skyNeedLoc:"Allow location for an accurate sky; for now it's calculated for Istanbul.",
    skyListTitle:"Visible right now", skyListMeta:n=>`${n} objects`, skyNone:"No bright objects above the horizon right now.",
    moonTitle:"The Moon tonight", below:"below the horizon", up:"up",
    skyAim:"Bring an object inside the circle",
    dirs:["North","Northeast","East","Southeast","South","Southwest","West","Northwest"],
    types:{star:"Star", planet:"Planet", moon:"Moon", sun:"Star (the Sun)"},
    sunWarn:"Never look at the Sun directly or through the camera.",
    phases:["New Moon","Waxing crescent","First quarter","Waxing gibbous","Full Moon","Waning gibbous","Last quarter","Waning crescent"],
    lit:p=>`${p}% lit`, nextFull:d=>`${d} days to full Moon`, nextNew:d=>`${d} days to new Moon`,
    mag:m=>`Brightness ${m}`, compassErr:"No compass on this device; drag with your finger.",
    shopEyebrow:"Shopping", shopTitle:"Read the label", shopIntro:"Point the camera at a product label or package to hear what it is, with its pros and cons.",
    shopScan:"Scan a label", shopHistTitle:"Recently scanned", shopHistMeta:n=>`${n} products`,
    pros:"Pros", cons:"Watch out for", ingredients:"Ingredients note", features:"Product features", tech:"Specifications", techSrc:"Compiled from a Google search; verify with the seller before buying.", price:"Price note", users:"What people generally say",
    nutri:"Nutri-Score", nova:"Processing", offSrc:"Source: Open Food Facts", barcode:"Barcode",
    shopFine:"Comments are the AI's general knowledge; for allergies and health always check the label itself.",
    noProduct:"Couldn't recognise the product. Try a closer, sharper photo of the label.",
    logEyebrow:"Journal", logTitle:"My travel notes", logIntro:"Places you've been, routes you've saved and things you've recognised.",
    statCity:"places", statStop:"stops", statProduct:"products", statSeen:"scans",
    savedTitle:"Saved routes", savedMeta:"work offline", savedEmpty:"Tap \"Save route\" on the Walk tab to keep one here.",
    visitTitle:"Stops you've visited", visitEmpty:"No stops marked yet.",
    seenTitle:"Recognised by camera", seenEmpty:"Things you identify with the camera appear here.",
    setTitle:"Settings", setKey:"Gemini key", setKeyOn:"Saved", setKeyOff:"Not set", change:"Change", add:"Add",
    setRate:"Narration speed", setRateSub:"Speed of the spoken story", setClear:"Delete all data", setClearSub:"Journal, routes and key are removed", delBtn:"Delete",
    clearConfirm:"Delete the journal, saved routes and key from this phone?", cleared:"Data deleted", open:"Open",
    soon:"This section is coming soon",
    share:"Share", sharePrep:"Preparing your share card…", shareCopied:"Link copied; image downloaded",
    shareDoneBtn:"Share your achievement", doneBadge:(a,b)=>`✓ ${a}/${b} stops`,
    shStop:(ad,place)=>`Listened to the story of ${ad}${place?' in '+place:''} with Gep Gep`,
    shRoute:(place,n)=>`Finished my ${place} route: ${n}/${n} stops!`,
    shSky:ad=>`Found ${ad} in tonight's sky`, shProduct:ad=>`Scanned the label: ${ad}`, shSeen:ad=>`My camera recognised: ${ad}`,
    cardStop:"Walk", cardRoute:"Route complete", cardSky:"Tonight's sky", cardProduct:"Label read", cardSeen:"What the camera saw"
  }
};
const T = () => UI[lang];

/* ---------- Mesafe ve biçim ---------- */
function dist(a, b){ const R=6371000, r=Math.PI/180;
  const dLat=(b.lat-a.lat)*r, dLng=(b.lng-a.lng)*r;
  const h=Math.sin(dLat/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(h)); }
function fmt(m){ return m<1000 ? Math.round(m/10)*10+' m' : (m/1000).toFixed(m<10000?1:0).replace('.', lang==='tr'?',':'.')+' km'; }
function minutes(t){ return Math.max(1, Math.round(String(t||'').split(/\s+/).length/130)); }
function dateStr(ts){ return new Date(ts).toLocaleDateString(lang==='tr'?'tr-TR':'en-GB', {day:'numeric', month:'short', year:'numeric'}); }

function toast(m, ms=2000){ const t=$('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'), ms); }

const ICON = {
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.4-2h5l1.4 2h1.6A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"/><circle cx="12" cy="12.5" r="3.4"/></svg>',
  target:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  nav:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8z"/></svg>',
  compass:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
  tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="7.5" r="1.3"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.5"/></svg>',
  x:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};

/* ---------- Sesli anlatım ---------- */
const Voice = {
  id: null,                       // şu an okunan metnin kimliği
  rate(){ return Store.get('rate', 0.96); },
  pick(){
    if(!('speechSynthesis' in window)) return null;
    const vs = speechSynthesis.getVoices(); const want = lang==='tr' ? 'tr' : 'en';
    return vs.find(v=>v.lang.toLowerCase().startsWith(want) && /enhanced|premium|yelda|samantha|ava|siri/i.test(v.name))
        || vs.find(v=>v.lang.toLowerCase().startsWith(want));
  },
  speak(id, text, onEnd){
    if(!('speechSynthesis' in window)){ toast('Ses desteklenmiyor'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang==='tr' ? 'tr-TR' : 'en-US'; const v = this.pick(); if(v) u.voice = v; u.rate = this.rate();
    u.onend = () => { if(this.id===id){ this.id=null; onEnd && onEnd(true); App.refresh(); } };
    u.onerror = () => { if(this.id===id){ this.id=null; App.refresh(); } };
    this.id = id; speechSynthesis.speak(u); App.refresh();
  },
  stop(){ if('speechSynthesis' in window) speechSynthesis.cancel(); this.id = null; },
  is(id){ return this.id === id; },
  toggle(id, text, onEnd){ if(this.is(id)){ this.stop(); App.refresh(); } else this.speak(id, text, onEnd); }
};
if('speechSynthesis' in window) speechSynthesis.onvoiceschanged = ()=>{};

function playButton(id, text, extra=''){
  const on = Voice.is(id), u = T();
  return `<div class="row"><button class="play" data-play="${esc(id)}">${on?ICON.pause:ICON.play}</button>
    <div class="lbl"><b>${esc(on?u.stop:u.listen)}</b><span>${minutes(text)} ${esc(u.minutes)}</span></div>${extra}</div>`;
}

/* ---------- Gemini ---------- */
const AI = {
  models: ['gemini-flash-latest', 'gemini-flash-lite-latest'],
  async ask(parts, {json=false, temperature=0.4, search=false}={}){
    const key = getKey(); if(!key && !GEP.proxy) throw new Error('nokey');
    const body = {contents:[{parts}], generationConfig:{temperature}};
    if(json && !search) body.generationConfig.responseMimeType = 'application/json';
    if(search) body.tools = [{google_search:{}}];
    let last;
    for(const m of this.models){
      try{
        const r = key
          ? await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(key)}`,
              {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)})
          : await fetch(GEP.proxy, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({model:m, body})});
        if(r.status===429 && !key){ last = new Error('rate'); break; }
        if(!r.ok){ last = new Error('http '+r.status); continue; }
        const j = await r.json();
        const txt = (j.candidates?.[0]?.content?.parts||[]).filter(p=>!p.thought).map(p=>p.text||'').join('').trim();
        if(!txt){ last = new Error('empty'); continue; }
        if(!json) return txt;
        return JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}')+1));
      }catch(e){ last = e; }
    }
    throw last || new Error('no answer');
  }
};

/* ---------- Günlük kaydı (diğer modüller buraya yazar) ---------- */
const Journal = {
  visits(){ return Store.get('visits', []); },             // [{id, ad, place, lat, lng, ts}]
  addVisit(v){ const a=this.visits().filter(x=>x.id!==v.id); a.unshift({...v, ts:Date.now()}); Store.set('visits', a.slice(0,300)); },
  removeVisit(id){ Store.set('visits', this.visits().filter(x=>x.id!==id)); },
  seen(){ return Store.get('seen', []); },                  // kamera tanımaları
  addSeen(s){ const a=this.seen(); a.unshift({...s, ts:Date.now()}); Store.set('seen', a.slice(0,100)); },
  products(){ return Store.get('products', []); },
  addProduct(p){ const a=this.products(); a.unshift({ts:Date.now(), ...p}); Store.set('products', a.slice(0,100)); },
  routes(){ return Store.get('routes', []); },              // kayıtlı rotalar
  saveRoute(r){ const a=this.routes().filter(x=>x.key!==r.key); a.unshift({...r, ts:Date.now()}); Store.set('routes', a.slice(0,30)); },
  removeRoute(key){ Store.set('routes', this.routes().filter(x=>x.key!==key)); }
};

/* ---------- Uygulama iskeleti: sekmeler ve dil ---------- */
const App = {
  tab: 'gezi',
  modules: {},
  register(name, mod){ this.modules[name] = mod; },
  refresh(){
    const u = T();
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on', b.dataset.l===lang));
    $('tabGezi').textContent=u.tabGezi; $('tabSky').textContent=u.tabSky; $('tabShop').textContent=u.tabShop; $('tabLog').textContent=u.tabLog;
    const m = this.modules[this.tab]; m && m.render && m.render();
  },
  show(tab){
    if(tab===this.tab) return;
    Voice.stop();
    const prev = this.modules[this.tab]; prev && prev.leave && prev.leave();
    this.tab = tab; Store.set('tab', tab);
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on', v.id==='v-'+tab));
    document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on', b.dataset.tab===tab));
    const m = this.modules[tab]; m && m.enter && m.enter();
    this.refresh(); window.scrollTo({top:0});
  },
  start(){
    document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>this.show(b.dataset.tab));
    document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>{
      if(lang===b.dataset.l) return;
      Voice.stop(); lang=b.dataset.l; Store.set('lang', lang);
      Object.values(this.modules).forEach(m=>m.langChanged && m.langChanged());
      this.refresh();
    });
    /* Oynat düğmeleri her yerde aynı şekilde çalışır */
    document.addEventListener('click', e=>{
      const sh = e.target.closest('[data-share]');
      if(sh && !sh.closest('#sheet')){ const m = this.modules[this.tab]; m && m.share && m.share(sh.dataset.share); return; }
      const b = e.target.closest('[data-play]'); if(!b) return;
      const m = this.modules[this.tab]; m && m.play && m.play(b.dataset.play);
    });
    Object.values(this.modules).forEach(m=>m.init && m.init());
    const saved = Store.get('tab', 'gezi');
    const first = this.modules[saved] ? saved : 'gezi';
    this.tab = null; this.show(first);
    if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
};
