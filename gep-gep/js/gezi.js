/* =========================================================
   Gep Gep — Gezi bölümü
   Bulunduğun yerin rotası (Vikipedi), harita, gezi takibi,
   "biraz uzakta" yerler, kayıtlı rotalar, Galata örnek turu.
   ========================================================= */

const Gezi = (() => {
  /* ---------- Durum ---------- */
  let stops = GALATA, far = [], mode = 'galata', placeName = 'Galata', center = null;
  let pos = null, selected = GALATA[0].id, manual = false, storyOpen = false;
  let loadingNear = false, netErr = false, geoState = 'idle', watching = false;
  let map = null, layer = null, meMarker = null, needFit = true;

  const all = () => stops.concat(far);
  const routeKey = () => mode==='galata' ? 'galata' : `r-${center.lat.toFixed(3)},${center.lng.toFixed(3)}`;
  const visited = () => new Set(Store.get('done-'+routeKey(), []));
  const setVisited = s => Store.set('done-'+routeKey(), [...s]);
  const txt = s => s[lang] || s.tr || s.en;

  /* ---------- Vikipedi'den gezilecek yer bulma ---------- */
  const KEYS = {
    tr:['cami','camii','mescit','kale','kalesi','müze','müzesi',' han',' hanı','hamam','hamamı','köprü','köprüsü','türbe','türbesi',
        'mağara','mağarası','kilise','kilisesi','saray','sarayı','çeşme','çeşmesi','medrese','medresesi','külliye','külliyesi','bedesten',
        'kule','kulesi','anıt','anıtı','tekke','dergâh','dergahı','kervansaray','şelale','şelalesi','kanyon','kanyonu','gölü',
        'tabiat parkı','milli park','millî park','antik','tiyatro','tiyatrosu','ören','höyük','höyüğü','konak','konağı','köşk','köşkü','kasrı',
        'sinagog','surları','suru','kemeri','meydanı','çarşı','çarşısı','arasta','manastır','manastırı','şapel','tuz mağara','kaya mezar',
        'kalıntı','harabe','şehitliği','kanal','yalı','yalısı','sarnıç','sarnıcı','hisar','hisarı','kümbet','kümbeti','imaret'],
    en:['mosque','castle','fortress','museum','bridge','tomb','mausoleum','cave','church','cathedral','palace','fountain','madrasa',
        'tower','monument','bath','hammam','caravanserai','waterfall','canyon','lake','national park','ancient','theatre','theater',
        'ruins','mansion','synagogue','square','bazaar','market','monastery','basilica','gate','walls','lighthouse','cistern','castle']
  };
  // uzaktaki yerlerde öne çıksın diye ağırlık
  const STRONG = ['mağara','kanyon','şelale','milli park','millî park','tabiat parkı','antik','ören','kale','gölü','höyük','kaya mezar',
                  'cave','canyon','waterfall','national park','ancient','ruins','castle','fortress','lake'];
  const SKIP = ['mahallesi','köyü','ilçesi','lisesi','okulu','ilkokulu','ortaokulu','üniversitesi','fakültesi','istasyonu','durağı',
                'hastanesi','stadyumu','spor','kulübü','belediyesi','seçim','barajı','havalimanı','otoyol','caddesi','sokağı','apartmanı',
                'neighbourhood','district','school','university','station','hospital','stadium','club','airport','street'];

  function isSight(title){
    const t = ' '+title.toLocaleLowerCase(lang==='tr'?'tr':'en');
    if(SKIP.some(w=>t.includes(' '+w))) return false;
    return KEYS.tr.some(w=>t.includes(w)) || KEYS.en.some(w=>t.includes(' '+w));
  }
  const weight = title => { const t = title.toLocaleLowerCase('tr'); return STRONG.some(w=>t.includes(w)) ? 1 : 0; };

  async function wiki(params){
    const u = `https://${lang}.wikipedia.org/w/api.php?format=json&formatversion=2&origin=*&` + new URLSearchParams(params);
    const r = await fetch(u); if(!r.ok) throw new Error(r.status); return r.json();
  }
  async function placeLabel(lat, lng){
    try{
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=12&lat=${lat}&lon=${lng}&accept-language=${lang}`);
      const a = (await r.json()).address || {};
      return a.town || a.city_district || a.city || a.county || a.province || a.state || '';
    }catch(e){ return ''; }
  }
  function cleanExtract(s){
    let m = String(s||'').replace(/\s*\([^()]*\)/g,'').replace(/\s*\([^()]*\)/g,'').replace(/\s+/g,' ').trim();
    const w = m.split(' '); if(w.length>140) m = w.slice(0,140).join(' ').replace(/[,;:]$/,'') + '…';
    return m;
  }
  function orderRoute(list, start){
    const rest=[...list], out=[]; let cur=start;
    while(rest.length){ rest.sort((a,b)=>dist(cur,a)-dist(cur,b)); cur=rest.shift(); out.push(cur); }
    return out;
  }
  function routeLength(){
    if(!stops.length) return 0; let m=0, cur=(center||pos||stops[0]);
    for(const x of stops){ m+=dist(cur,x); cur=x; } return m;
  }
  function mapsLink(){
    if(!stops.length) return '#';
    const v = visited(), left = stops.filter(x=>!v.has(x.id)); const list = left.length ? left : stops;
    const ll = x => `${x.lat.toFixed(6)},${x.lng.toFixed(6)}`;
    const start = pos || center, last = list[list.length-1], mids = list.slice(0,-1).slice(0,8);
    const walk = routeLength() < 6000;
    return 'https://www.google.com/maps/dir/?api=1' + (start?`&origin=${ll(start)}`:'') + `&destination=${ll(last)}`
         + (mids.length?`&waypoints=${encodeURIComponent(mids.map(ll).join('|'))}`:'') + `&travelmode=${walk?'walking':'driving'}`;
  }

  function useGalata(){ stops=GALATA; far=[]; mode='galata'; placeName='Galata'; center=null; selected=GALATA[0].id; needFit=true; }

  async function loadNear(lat, lng, label){
    if(dist({lat,lng}, GALATA[0]) < 1500){ useGalata(); manual=false; return App.refresh(); }
    loadingNear=true; netErr=false; Voice.stop(); App.refresh();
    try{
      const g = await wiki({action:'query', list:'geosearch', gscoord:`${lat}|${lng}`, gsradius:10000, gslimit:200});
      const c = (g.query?.geosearch||[]).filter(x=>isSight(x.title));
      let near = c.filter(x=>x.dist<=3000);
      if(near.length < 4) near = c.filter(x=>x.dist<=6000);
      if(near.length < 3) near = c;
      near = near.slice(0, 8);
      const nearIds = new Set(near.map(x=>x.pageid));
      let farC = c.filter(x=>!nearIds.has(x.pageid)).sort((a,b)=>(weight(b.title)-weight(a.title)) || (a.dist-b.dist)).slice(0,4);
      if(!near.length){ useGalata(); loadingNear=false; toast(T().none, 3200); return App.refresh(); }
      const ids = near.concat(farC).map(x=>x.pageid);
      const d = await wiki({action:'query', pageids:ids.join('|'), prop:'extracts|description|pageimages',
                           exintro:1, explaintext:1, exlimit:'max', piprop:'thumbnail', pithumbsize:640});
      const pages = d.query?.pages||[];
      const make = (x, isFar) => {
        const pg = pages.find(p=>p.pageid===x.pageid)||{};
        const t = {ad:x.title, kisa:pg.description||'', metin:cleanExtract(pg.extract)||x.title};
        return {id:'w'+x.pageid, lat:x.lat, lng:x.lon, img:pg.thumbnail?.source||'', wiki:true, far:isFar, title:x.title, [lang]:t};
      };
      center = {lat, lng};
      stops = orderRoute(near.map(x=>make(x,false)), pos || center);
      far = farC.map(x=>make(x,true));
      mode = 'near'; manual = false; storyOpen = false; needFit = true;
      selected = autoPick();
      placeName = label || await placeLabel(lat, lng) || (lang==='tr'?'Yakınındakiler':'Nearby');
    }catch(e){
      netErr = true;
      // internet yoksa yakındaki kayıtlı rotayı aç
      const r = Journal.routes().find(r=>dist(r.center,{lat,lng}) < 15000 && r.lang===lang);
      if(r){ openSaved(r, true); toast(T().offlineRoute, 3000); }
    }
    loadingNear=false; App.refresh();
  }

  function openSaved(r, silent){
    stops = r.stops; far = r.far||[]; center = r.center; placeName = r.place; mode = r.mode||'near';
    if(mode==='galata'){ useGalata(); }
    manual = false; storyOpen = false; needFit = true; netErr = false; selected = autoPick();
    if(!silent){ App.show('gezi'); App.refresh(); }
  }

  /* ---------- Rehber anlatımı (Gemini; anahtar varsa) ---------- */
  const guideBusy = new Set();
  function ensureGuide(s){
    const t = s[lang]; if(!t || t.rehber || guideBusy.has(s.id) || !getKey()) return;
    const ck = 'g-'+lang+'-'+s.id, cached = Store.get(ck, null);
    if(cached){ t.metin = cached; t.rehber = true; return; }
    guideBusy.add(s.id);
    const dil = lang==='tr' ? 'Türkçe' : 'English';
    const prompt = `Aşağıdaki ansiklopedi bilgisini, yerinde duran bir gezgine anlatan samimi bir tur rehberi gibi ${dil} olarak yeniden yaz. 90-120 kelime. SADECE verilen bilgileri kullan; yeni tarih, sayı ya da olay uydurma. Başlık, liste, emoji yok; düz metin döndür.\n\nYer: ${s.title}\nBilgi: ${t.metin}`;
    AI.ask([{text:prompt}], {temperature:.5})
      .then(out=>{ if(out.length>80){ t.metin=out; t.rehber=true; Store.set(ck,out); if(!Voice.id) App.refresh(); } })
      .catch(()=>{}).finally(()=>guideBusy.delete(s.id));
  }

  /* ---------- Hangi durak öne çıksın ---------- */
  function autoPick(){
    const v = visited(), left = stops.filter(x=>!v.has(x.id));
    const pool = left.length ? left : stops;
    if(pos) return pool.reduce((a,b)=>dist(pos,a)<dist(pos,b)?a:b).id;
    return pool[0].id;
  }

  /* ---------- Konum ---------- */
  function locate(){
    if(!navigator.geolocation){ geoState='denied'; return App.refresh(); }
    if(watching) return;
    geoState='wait'; App.refresh(); watching = true;
    let first = true;
    navigator.geolocation.watchPosition(p=>{
      pos = {lat:p.coords.latitude, lng:p.coords.longitude}; geoState='on';
      Sky.setLocation && Sky.setLocation(pos);
      if(first){ first=false; if(!center || mode==='galata') loadNear(pos.lat, pos.lng); }
      checkArrival();
      if(!manual && !Voice.id && !loadingNear) selected = autoPick();
      if(App.tab==='gezi') App.refresh();
    }, ()=>{ geoState='denied'; watching=false; App.refresh(); }, {enableHighAccuracy:true, maximumAge:10000, timeout:20000});
  }

  function checkArrival(){
    if(!pos || loadingNear) return;
    const v = visited();
    for(const s of stops){
      if(v.has(s.id) || dist(pos,s) > 45) continue;
      v.add(s.id); setVisited(v); logVisit(s);
      if(navigator.vibrate) navigator.vibrate([120,60,120]);
      toast(T().arrived(txt(s).ad), 3000);
      if(!Voice.id){ selected = s.id; manual = false; storyOpen = false; }
      if(v.size === stops.length) setTimeout(()=>toast(T().routeDone, 3500), 3200);
    }
  }
  function logVisit(s){ Journal.addVisit({id:s.id, ad:txt(s).ad, place:placeName, lat:s.lat, lng:s.lng, img:s.img||''}); }

  function toggleVisited(id){
    const v = visited(), s = all().find(x=>x.id===id); if(!s) return;
    if(v.has(id)){ v.delete(id); Journal.removeVisit(id); }
    else { v.add(id); logVisit(s); if(!s.far && v.size>=stops.length) toast(T().routeDone, 3000); }
    setVisited(v); App.refresh();
  }

  /* ---------- Harita ---------- */
  function initMap(){
    if(map || !window.L) return;
    const dark = matchMedia('(prefers-color-scheme: dark)').matches;
    map = L.map('map', {zoomControl:false, attributionControl:true});
    L.tileLayer(`https://{s}.basemap.cartocdn.com/${dark?'dark_all':'light_all'}/{z}/{x}/{y}{r}.png`,
      {maxZoom:19, subdomains:'abcd', attribution:'© OpenStreetMap · © CARTO'}).addTo(map);
    layer = L.layerGroup().addTo(map);
    map.setView([41.0256, 28.9741], 15);
  }
  function drawMap(){
    if(!map){ initMap(); if(!map) return; }
    setTimeout(()=>map.invalidateSize(), 0);
    layer.clearLayers();
    const v = visited();
    const line = stops.map(s=>[s.lat, s.lng]);
    if(line.length>1) L.polyline(line, {color:'#c4552d', weight:3, opacity:.75, dashArray:'2 8', lineCap:'round'}).addTo(layer);
    stops.forEach((s,i)=>{
      const cls = 'pin' + (v.has(s.id)?' visited':'') + (s.id===selected?' sel':'');
      L.marker([s.lat,s.lng], {icon:L.divIcon({className:'', html:`<div class="${cls}">${v.has(s.id)?'✓':i+1}</div>`, iconSize:[28,28], iconAnchor:[14,14]})})
        .on('click', ()=>select(s.id)).addTo(layer);
    });
    far.forEach(s=>{
      const cls = 'pin far' + (v.has(s.id)?' visited':'') + (s.id===selected?' sel':'');
      L.marker([s.lat,s.lng], {icon:L.divIcon({className:'', html:`<div class="${cls}">★</div>`, iconSize:[28,28], iconAnchor:[14,14]})})
        .on('click', ()=>select(s.id)).addTo(layer);
    });
    if(pos){
      meMarker = L.marker([pos.lat,pos.lng], {icon:L.divIcon({className:'', html:'<div class="me"></div>', iconSize:[18,18], iconAnchor:[9,9]}), zIndexOffset:1000}).addTo(layer);
    }
    if(needFit){
      const pts = line.concat(pos && mode!=='galata' && dist(pos, stops[0]) < 8000 ? [[pos.lat,pos.lng]] : []);
      if(pts.length) map.fitBounds(L.latLngBounds(pts).pad(0.25), {maxZoom:16, animate:false});
      needFit = false;
    }
  }

  function select(id){
    if(id!==selected){ Voice.stop(); storyOpen=false; }
    selected = id; manual = true; App.refresh(); window.scrollTo({top:0, behavior:'smooth'});
  }

  /* ---------- Kamera ile tanıma ---------- */
  function openCamera(){
    Cam.open('gezi', {
      onShot: async (b64, thumb) => {
        const near = pos ? `The user is at latitude ${pos.lat.toFixed(5)}, longitude ${pos.lng.toFixed(5)}${placeName?` (${placeName})`:''}.` : 'The user is probably in Türkiye.';
        const dil = lang==='tr' ? 'Türkçe' : 'English';
        const prompt = `${near} Look at the photo and identify the main thing in it: a landmark, building, street, monument, sign, plant, animal or object.
Write in ${dil}. Return ONLY JSON: {"ad": "short name", "kisa": "one short line", "metin": "about 90-120 words told like a friendly tour guide: what it is and its history or the most interesting facts", "emin": true/false}.
If you cannot identify it confidently, set "emin": false, describe what you see and say honestly that you are not sure. Never invent dates or facts.`;
        const r = await AI.ask([{text:prompt},{inline_data:{mime_type:'image/jpeg',data:b64}}], {json:true});
        if(!r.ad || !r.metin) throw new Error('bad');
        r._shot = 'data:image/jpeg;base64,' + b64;
        Journal.addSeen({ad:r.ad, kisa:r.kisa||'', metin:r.metin, emin:r.emin!==false, img:thumb, place:placeName});
        return r;
      },
      onResult: r => {
        const u = T();
        if(r.hata) return `<div class="tag">${esc(u.unsure)}</div><h2>${esc(u.unsure)}</h2><div class="story">${esc(u.aiErr)}</div>`;
        return `<div class="tag">${esc(r.emin===false?u.unsure:u.seen)}</div><h2>${esc(r.ad)}</h2>
          ${r.kisa?`<div class="meta" style="color:var(--ink3);font-size:14px">${esc(r.kisa)}</div>`:''}
          ${playButton('cam', r.metin, Share.button('cam'))}<div class="story">${esc(r.metin)}</div>`;
      },
      onShare: r => {
        if(r.hata) return;
        const u = T();
        Share.go({text:u.shSeen(r.ad), cardOpts:{eyebrow:u.cardSeen + (placeName&&mode!=='galata'?' · '+placeName:''), title:r.ad, line:r.kisa||'', img:r._shot}});
      }
    });
  }

  /* ---------- Çizim ---------- */
  function render(){
    const u = T(), v = visited();
    $('place').textContent = placeName;
    $('eyebrow').textContent = mode==='galata' ? u.eyebrow : u.eyebrowNear;
    const km = routeLength();
    $('intro').textContent = mode==='galata' ? u.intro : u.introNear(stops.length, fmt(km), km < 6000);
    $('routeTitle').textContent = u.route; $('routeMeta').textContent = u.stopsN(stops.length);
    $('mapTitle').textContent = u.mapTitle; $('mapMe').textContent = pos ? u.mapMe : '';
    $('q').placeholder = u.searchPh; $('qBtn').textContent = u.searchBtn;
    $('camBtn').innerHTML = ICON.camera + esc(u.cam);
    $('mapBtn').innerHTML = ICON.nav + esc(u.mapBtn); $('mapBtn').href = mapsLink();
    $('sample').textContent = mode==='galata' ? (pos && dist(pos,GALATA[0])>1500 ? u.myPlace : '') : u.sample;
    $('resetRoute').textContent = u.resetRoute;
    const isSaved = Journal.routes().some(r=>r.key===routeKey()+'-'+lang);
    $('saveRoute').textContent = isSaved ? u.saved : u.saveRoute; $('saveRoute').classList.toggle('done', isSaved);

    if(loadingNear){
      $('now').className='card now'; $('now').innerHTML=`<div class="loading"><i></i>${esc(u.searching)}</div>`;
      $('route').innerHTML=''; $('far').innerHTML=''; $('farBlock').style.display='none';
      $('progress').className='progress'; $('locate').style.display='none'; $('note').textContent='';
      return;
    }

    /* ilerleme */
    const doneN = stops.filter(s=>v.has(s.id)).length;
    $('progress').className = 'progress' + (doneN ? ' on' : '');
    $('progress').innerHTML = `<div class="bar"><i style="width:${Math.round(doneN/stops.length*100)}%"></i></div>
      <div class="txt"><span>${esc(u.progress(doneN, stops.length))}</span>${doneN===stops.length?`<b>${esc(u.progressDone)}</b>`:''}</div>
      ${doneN===stops.length?`<button class="donebtn" data-share="route">${ICON.share}${esc(u.shareDoneBtn)}</button>`:''}`;

    /* durak kartı */
    const s = all().find(x=>x.id===selected) || stops[0], t = txt(s);
    if(s.wiki) ensureGuide(s);
    const d = pos ? dist(pos, s) : null, isHere = d!==null && d < 60, isDone = v.has(s.id);
    const firstLeft = stops.find(x=>!v.has(x.id));
    let label;
    if(isDone) label = u.visitedTag;
    else if(isHere) label = u.here;
    else if(s.far) label = `${u.farTitle} · ${fmt(d!==null?d:dist(center||s, s))}`;
    else if(pos && !manual) label = u.nearest;
    else if(pos) label = fmt(d)+' '+u.away;
    else label = (firstLeft && firstLeft.id===s.id && doneN) ? u.next : (stops[0].id===s.id ? u.first : u.next);
    $('now').className = 'card now' + (isHere && !isDone ? ' here' : '') + (isDone ? ' done' : '');
    $('now').innerHTML = `
      ${s.img?`<img class="pic" src="${esc(s.img)}" alt="">`:''}
      <div class="tag">${esc(label)}</div>
      <h2>${esc(t.ad)}</h2>
      <div class="meta">${esc(t.kisa)}${d!==null && !isHere && !s.far ? ' · '+fmt(d) : ''}</div>
      <div class="row">
        <button class="play" data-play="${esc(s.id)}">${Voice.is(s.id)?ICON.pause:ICON.play}</button>
        <div class="lbl"><b>${esc(Voice.is(s.id)?u.stop:u.listen)}</b><span>${minutes(t.metin)} ${esc(u.minutes)}</span></div>
        ${Share.button('stop')}
        <button class="check ${isDone?'on':''}" id="check" aria-label="${esc(isDone?u.unmark:u.markVisited)}" title="${esc(isDone?u.unmark:u.markVisited)}">${ICON.check}</button>
      </div>
      <div class="story ${storyOpen?'open':''}">${esc(t.metin)}${s.wiki?`<div class="src">${esc(t.rehber?u.srcAi:u.src)}</div>`:''}</div>
      <button class="toggle" id="toggle">${esc(storyOpen?u.hide:u.read)}</button>`;
    $('toggle').onclick = () => { storyOpen=!storyOpen; App.refresh(); };
    $('check').onclick = () => toggleVisited(s.id);

    /* konum düğmesi ve notlar */
    $('locate').style.display = geoState==='on' ? 'none' : 'flex';
    $('locate').innerHTML = ICON.target + esc(geoState==='wait'?u.locating:u.locate);
    $('note').textContent = geoState==='denied' ? u.denied : (netErr ? u.netErr : '');

    /* rota listesi */
    $('route').innerHTML = stops.map((x,i)=>{ const tx=txt(x), done=v.has(x.id); return `
      <button class="stop ${x.id===selected?'sel':''} ${done?'visited':''}" data-id="${x.id}">
        <span class="n">${done?'✓':i+1}</span>
        <span class="t"><b>${esc(tx.ad)}</b><span>${esc(tx.kisa || (pos?fmt(dist(pos,x)):''))}</span></span>
        ${x.img?`<img class="ph" src="${esc(x.img)}" alt="" loading="lazy">`:`<span class="d">${pos?fmt(dist(pos,x)):''}</span>`}
      </button>`; }).join('');

    /* biraz uzakta */
    $('farBlock').style.display = far.length ? 'block' : 'none';
    $('farTitle').textContent = u.farTitle; $('farMeta').textContent = u.farMeta;
    const ref = pos || center;
    $('far').innerHTML = far.map(x=>{ const tx=txt(x), done=v.has(x.id); return `
      <button class="stop ${x.id===selected?'sel':''} ${done?'visited':''}" data-id="${x.id}">
        ${x.img?`<img class="ph" src="${esc(x.img)}" alt="" loading="lazy">`:`<span class="n">★</span>`}
        <span class="t"><b>${esc(tx.ad)}</b><span>${esc(tx.kisa||'')}</span></span>
        <span class="d">${ref?fmt(dist(ref,x)):''}<br>${esc(ref && dist(ref,x)>3000?u.drive:u.walk)}</span>
      </button>`; }).join('');

    document.querySelectorAll('#route .stop, #far .stop').forEach(b=>b.onclick=()=>select(b.dataset.id));
    drawMap();
  }

  /* ---------- Bağlantılar ---------- */
  function init(){
    $('locate').onclick = locate;
    $('camBtn').onclick = openCamera;
    $('search').onsubmit = async e => {
      e.preventDefault(); const q = $('q').value.trim(); if(!q) return; $('q').blur();
      try{
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=${lang}&q=${encodeURIComponent(q)}`);
        const j = await r.json(); if(!j.length) return toast(T().notFound);
        loadNear(+j[0].lat, +j[0].lon, (j[0].display_name||q).split(',')[0]);
      }catch(err){ toast(T().netErr); }
    };
    $('sample').onclick = () => {
      Voice.stop();
      if(mode==='galata' && pos){ loadNear(pos.lat, pos.lng); }
      else { useGalata(); manual=true; storyOpen=false; App.refresh(); window.scrollTo({top:0, behavior:'smooth'}); }
    };
    $('mapMe').onclick = () => { if(pos && map) map.setView([pos.lat,pos.lng], 16); };
    $('saveRoute').onclick = () => {
      Journal.saveRoute({key:routeKey()+'-'+lang, place:placeName, center:center||{lat:GALATA[0].lat,lng:GALATA[0].lng},
                         stops, far, lang, mode});
      // fotoğrafları da önbelleğe al (internetsiz açılsın)
      if('caches' in window) caches.open('gepgep-img').then(c=>all().forEach(s=>s.img && c.add(new Request(s.img,{mode:'no-cors'})).catch(()=>{})));
      toast(T().savedToast, 2600); App.refresh();
    };
    $('resetRoute').onclick = () => { setVisited(new Set()); manual=false; selected=autoPick(); toast(T().resetToast); App.refresh(); };
  }

  function firstSentence(t){ const m = String(t||'').match(/^(.{20,160}?[.!?])\s/); return m ? m[1] : String(t||'').slice(0,140); }
  function share(id){
    const u = T();
    if(id==='route'){
      const cover = stops.find(x=>x.img)?.img || '';
      Share.go({text:u.shRoute(placeName, stops.length), fileName:'gepgep-rota.png',
        cardOpts:{eyebrow:u.cardRoute, title:placeName, badge:u.doneBadge(stops.length, stops.length),
                  line:stops.map(x=>txt(x).ad).join(' · '), img:cover}});
      return;
    }
    const s = all().find(x=>x.id===selected) || stops[0], t = txt(s);
    Share.go({text:u.shStop(t.ad, mode==='galata' ? 'Galata' : placeName),
      cardOpts:{eyebrow:`${u.cardStop} · ${mode==='galata'?'Galata':placeName}`, title:t.ad, line:t.kisa || firstSentence(t.metin), img:s.img,
                badge: visited().has(s.id) ? '✓ '+u.visitedTag : ''}});
  }

  function play(id){
    const s = all().find(x=>x.id===id); if(!s) return;
    Voice.toggle(id, txt(s).metin);
  }

  function langChanged(){
    if(mode==='near' && center) loadNear(center.lat, center.lng);
  }

  return { init, render, play, share, langChanged, openSaved, enter(){ setTimeout(()=>map && map.invalidateSize(), 50); },
           get pos(){ return pos; }, toggleVisited };
})();
App.register('gezi', Gezi);
