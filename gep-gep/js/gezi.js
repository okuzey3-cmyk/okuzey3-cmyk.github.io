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
  let map = null, mapReady = false, mapMarkers = [], needFit = true;

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
        'kalıntı','harabe','şehitliği','kanal','yalı','yalısı','sarnıç','sarnıcı','hisar','hisarı','kümbet','kümbeti','imaret',
        'heykel','heykeli',' garı','opera','operası','park ','parkı','iskele','iskelesi','bahçe','bahçesi','kütüphane','mezarlığı','fener','feneri','tersane','sanat merkezi','pazarı'],
    en:['mosque','castle','fortress','museum','bridge','tomb','mausoleum','cave','church','cathedral','palace','fountain','madrasa',
        'tower','monument','bath','hammam','caravanserai','waterfall','canyon','lake','national park','ancient','theatre','theater',
        'ruins','mansion','synagogue','square','bazaar','market','monastery','basilica','gate','walls','lighthouse','cistern','castle',
        'statue','opera house','park','garden','pier','library','cemetery','railway terminal']
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

  /* ---------- OpenStreetMap'ten yakın yerler (Vikipedi'de maddesi olmayan cami, anıt, iskele, park...) ---------- */
  const KIND = {
    cami:{tr:'Cami',en:'Mosque'}, ibadet:{tr:'İbadethane',en:'Place of worship'}, tarih:{tr:'Tarihî yapı',en:'Historic site'},
    muze:{tr:'Müze',en:'Museum'}, gezi:{tr:'Gezilecek yer',en:'Attraction'}, manzara:{tr:'Manzara noktası',en:'Viewpoint'},
    park:{tr:'Park',en:'Park'}, iskele:{tr:'İskele',en:'Pier'}, fener:{tr:'Fener',en:'Lighthouse'}, kule:{tr:'Kule',en:'Tower'},
    sanat:{tr:'Sanat eseri',en:'Artwork'}, anit:{tr:'Anıt',en:'Monument'}
  };
  function osmKind(t){
    if(t.amenity==='place_of_worship') return (t.religion==='muslim'||t.building==='mosque') ? 'cami' : 'ibadet';
    if(t.tourism==='museum'||t.tourism==='gallery') return 'muze';
    if(t.tourism==='viewpoint') return 'manzara';
    if(t.tourism==='artwork') return 'sanat';
    if(t.tourism==='attraction') return 'gezi';
    if(t.historic==='monument'||t.historic==='memorial') return 'anit';
    if(t.historic) return 'tarih';
    if(t.leisure==='park'||t.leisure==='garden') return 'park';
    if(t.man_made==='pier') return 'iskele';
    if(t.man_made==='lighthouse') return 'fener';
    if(t.man_made==='tower') return 'kule';
    return '';
  }
  async function osmPlaces(lat, lng){
    try{
      const a = `(around:2500,${lat},${lng})`;
      const q = `[out:json][timeout:12];(nwr${a}["name"]["amenity"="place_of_worship"];nwr${a}["name"]["historic"];`
        + `nwr${a}["name"]["tourism"~"^(attraction|museum|viewpoint|artwork|gallery)$"];nwr${a}["name"]["leisure"~"^(park|garden)$"];`
        + `nwr${a}["name"]["man_made"~"^(pier|lighthouse|tower)$"];);out center tags 150;`;
      const r = await fetch('https://overpass-api.de/api/interpreter', {method:'POST', body:'data='+encodeURIComponent(q), headers:{'Content-Type':'application/x-www-form-urlencoded'}});
      if(!r.ok) return [];
      const seen = new Set();
      return ((await r.json()).elements||[]).map(e=>{
        const t = e.tags||{}, la = e.lat ?? e.center?.lat, lo = e.lon ?? e.center?.lon, k = osmKind(t);
        if(!la || !lo || !k || !t.name) return null;
        if(/^(yes|no)$/i.test(t.name) || seen.has(t.name.toLowerCase())) return null; seen.add(t.name.toLowerCase());
        const strong = !!(t.wikipedia || t.wikidata || (t.historic && k!=='anit') || k==='muze' || k==='gezi' || k==='manzara' || k==='iskele');
        return {id:'o'+e.type[0]+e.id, lat:la, lng:lo, title:t.name, kind:k, wp:t.wikipedia||'', strong};
      }).filter(Boolean);
    }catch(e){ return []; }
  }

  async function loadNear(lat, lng, label){
    if(!GEP.nearWeb){ useGalata(); manual=false; return App.refresh(); }   /* Vikipedi'den yakın yer çekme kapalı (ticari temizlik) */
    if(dist({lat,lng}, GALATA[0]) < 1500){ useGalata(); manual=false; return App.refresh(); }
    loadingNear=true; netErr=false; Voice.stop(); App.refresh();
    try{
      const osmP = osmPlaces(lat, lng);
      const g = await wiki({action:'query', list:'geosearch', gscoord:`${lat}|${lng}`, gsradius:10000, gslimit:200});
      const c = (g.query?.geosearch||[]).filter(x=>isSight(x.title));
      let near = c.filter(x=>x.dist<=3000);
      if(near.length < 4) near = c.filter(x=>x.dist<=6000);
      if(near.length < 3) near = c;
      near = near.slice(0, 8);
      const nearIds = new Set(near.map(x=>x.pageid));
      let farC = c.filter(x=>!nearIds.has(x.pageid)).sort((a,b)=>(weight(b.title)-weight(a.title)) || (a.dist-b.dist)).slice(0,4);
      const osmAll = await osmP;
      if(!near.length && !osmAll.length){ useGalata(); loadingNear=false; toast(T().none, 3200); return App.refresh(); }
      const ids = near.concat(farC).map(x=>x.pageid);
      const d = ids.length ? await wiki({action:'query', pageids:ids.join('|'), prop:'extracts|description|pageimages',
                           exintro:1, explaintext:1, exlimit:'max', piprop:'thumbnail|name', pithumbsize:640}) : {};
      const pages = d.query?.pages||[];
      /* Fotoğraf yalnızca Commons'ta ve uygun lisanslıysa gösterilir; yazar/lisans etiketi eklenir */
      const infos = {}, nmz = n => String(n||'').replace(/^File:/,'').replace(/_/g,' ');
      const names = [...new Set(pages.map(p=>p.pageimage).filter(Boolean))];
      if(names.length){ try{
        const rr = await fetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({action:'query', format:'json', formatversion:'2', origin:'*',
          titles:names.map(n=>'File:'+nmz(n)).join('|'), prop:'imageinfo', iiprop:'url|extmetadata'}));
        ((await rr.json()).query?.pages||[]).forEach(p=>{
          const ii=(p.imageinfo||[])[0]; if(!ii) return; const m=ii.extmetadata||{}, lic=(m.LicenseShortName||{}).value||'';
          if((m.NonFree||{}).value==='true' || /NC|ND/i.test(lic.replace(/CC BY-SA/i,'')) || !LIC_OK.test(lic)) return;
          infos[nmz(p.title)] = {page:ii.descriptionurl, lic, by:plain((m.Artist||{}).value).slice(0,40)||'Wikimedia Commons'};
        });
      }catch(e){} }
      const make = (x, isFar) => {
        const pg = pages.find(p=>p.pageid===x.pageid)||{};
        const t = {ad:x.title, kisa:pg.description||'', metin:cleanExtract(pg.extract)||x.title};
        const inf = pg.thumbnail && infos[nmz(pg.pageimage)];
        return {id:'w'+x.pageid, lat:x.lat, lng:x.lon, img:inf?pg.thumbnail.source:'', pic:inf?{src:pg.thumbnail.source, ...inf}:undefined, wiki:true, far:isFar, title:x.title, [lang]:t};
      };
      center = {lat, lng};
      const wikiStops = near.map(x=>make(x,false));
      /* OpenStreetMap yerleri: Vikipedi'dekilerle çakışanları ele, sıradan camilerden en fazla 3 al */
      const nm = x => x.toLocaleLowerCase('tr').replace(/[^a-zçğıöşü0-9]/g,'');
      const fresh = osmAll.filter(o=>!wikiStops.some(w=>dist(o,w)<25 || nm(w.title).includes(nm(o.title)) || nm(o.title).includes(nm(w.title))))
        .map(o=>({...o, d:dist(o,{lat,lng})})).filter(o=>o.d<=2500).sort((a,b)=>a.d-b.d);
      const pick = [...fresh.filter(o=>o.strong).slice(0,6), ...fresh.filter(o=>!o.strong).slice(0,3)];
      const wpTitle = {};   /* OSM'de wikipedia etiketi olanların metnini Vikipedi'den al */
      await Promise.all(pick.filter(o=>/^(tr|en):/.test(o.wp)).map(async o=>{ try{
        const [pre, ...rest] = o.wp.split(':'), j = await (await fetch(`https://${pre}.wikipedia.org/w/api.php?` + new URLSearchParams({action:'query', format:'json', formatversion:'2', origin:'*',
          titles:rest.join(':'), prop:'extracts', exintro:1, explaintext:1}))).json();
        const ex = cleanExtract(j.query?.pages?.[0]?.extract); if(ex) wpTitle[o.id] = ex; }catch(e){} }));
      const osmStops = pick.map(o=>{
        const k = KIND[o.kind], ex = wpTitle[o.id];
        const where = label || (lang==='tr'?'bu çevrede':'in this area');
        const tr = ex || `${o.title}, ${where} bulunan bir ${k.tr.toLocaleLowerCase('tr')}. Bu yer için ayrıntılı bir anlatım henüz yok; yerindeki bilgi levhasına ya da Vikipedi'ye bakabilirsin.`;
        const en = ex || `${o.title} is a ${k.en.toLowerCase()} ${label?'in '+label:'in this area'}. There is no detailed story for it yet; check the information board on site or Wikipedia.`;
        return {id:o.id, lat:o.lat, lng:o.lng, img:'', osm:true, far:false, title:o.title, [lang]:{ad:o.title, kisa:k[lang], metin: lang==='tr'?tr:en, rehber:!ex}};
      });
      stops = orderRoute([...wikiStops, ...osmStops].slice(0,12), pos || center);
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
    const t = s[lang]; if(!t || t.rehber || guideBusy.has(s.id) || !hasAI()) return;
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
    const rad = s => { let m = 45; stops.forEach(o=>{ if(o!==s) m = Math.min(m, Math.max(15, dist(s,o)*0.6)); }); return m; };
    const hit = stops.filter(s=>!v.has(s.id) && dist(pos,s) <= rad(s)).sort((a,b)=>dist(pos,a)-dist(pos,b))[0];
    for(const s of (hit?[hit]:[])){
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
  const FALLBACK_STYLE = {version:8, sources:{}, layers:[{id:'bg', type:'background', paint:{'background-color':'#14100f'}}]};
  /* OpenFreeMap (anahtarsız, ticari kullanıma açık) "Positron" stilini uygulamanın koyu rengine boyar */
  async function darkStyle(){
    const st = await (await fetch('https://tiles.openfreemap.org/styles/positron')).json();
    st.layers.forEach(l=>{
      const id = l.id||'', p = (l.paint = l.paint||{});
      if(l.type==='background') p['background-color'] = '#14100f';
      else if(l.type==='fill' || l.type==='fill-extrusion'){
        const c = /water/.test(id) ? '#0f1a22' : /park|wood|grass|green|landcover|landuse/.test(id) ? '#171b15' : /build/.test(id) ? '#241d1a' : '#1a1513';
        p[l.type==='fill'?'fill-color':'fill-extrusion-color'] = c;
        if(l.type==='fill') delete p['fill-outline-color'];
      }
      else if(l.type==='line'){
        p['line-color'] = /water/.test(id) ? '#16232d' : /boundary|admin/.test(id) ? '#2a2320' : /rail|transit/.test(id) ? '#2b2420' : '#3d322d';
      }
      else if(l.type==='symbol'){
        p['text-color'] = '#d9cbc1'; p['text-halo-color'] = '#0c090c'; p['text-halo-width'] = 1.2;
        p['icon-opacity'] = 0;
        if(l.layout && l.layout['text-field']){
          const L = (typeof lang!=='undefined' && lang==='en') ? 'en' : 'tr';
          l.layout['text-field'] = L==='en' ? ['coalesce',['get','name_en'],['get','name']] : ['coalesce',['get','name:tr'],['get','name']];
        }
      }
    });
    return st;
  }
  function initMap(){
    if(map || !window.maplibregl) return;
    map = new maplibregl.Map({container:'map', style:FALLBACK_STYLE, center:[28.9741, 41.0256], zoom:15, minZoom:11, maxZoom:18.5,
      attributionControl:false, dragRotate:false, pitchWithRotate:false, fadeDuration:0});
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.AttributionControl({compact:true,
      customAttribution:'<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> · © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}));
    const addLine = () => {
      if(map.getSource('rt')) return;
      map.addSource('rt', {type:'geojson', data:{type:'FeatureCollection', features:[]}});
      map.addLayer({id:'rt', type:'line', source:'rt', layout:{'line-cap':'round','line-join':'round'},
        paint:{'line-color':'#e8794a', 'line-width':3.5, 'line-opacity':.9, 'line-dasharray':[0.4, 2.2]}});
    };
    map.on('load', () => {
      addLine(); mapReady = true; drawMap();
      darkStyle().then(st => { map.setStyle(st); map.once('styledata', ()=>{ const t=setInterval(()=>{ if(map.isStyleLoaded()){ clearInterval(t); addLine(); drawMap(); } }, 60); setTimeout(()=>clearInterval(t), 6000); }); }).catch(()=>{});
    });
  }
  function pinEl(html, cls, onClick){
    const el = document.createElement('div'); el.innerHTML = `<div class="${cls}">${html}</div>`;
    if(onClick) el.addEventListener('click', e=>{ e.stopPropagation(); onClick(); });
    return el;
  }
  function drawMap(){
    if(!map){ initMap(); return; }
    if(!mapReady) return;
    map.resize();
    mapMarkers.forEach(m=>m.remove()); mapMarkers = [];
    const v = visited();
    const line = stops.map(s=>[s.lng, s.lat]);
    const src = map.getSource('rt');
    if(src) src.setData({type:'FeatureCollection', features: line.length>1 ? [{type:'Feature', geometry:{type:'LineString', coordinates:line}}] : []});
    const placed = [];
    const put = (el, lng, lat) => {   /* çok yakın iki durak üst üste binmesin */
      const near = placed.filter(q=>dist({lat,lng},{lat:q[1],lng:q[0]}) < 40).length;
      placed.push([lng,lat]);
      mapMarkers.push(new maplibregl.Marker({element:el, anchor:'center', offset:[near*20, near*-20]}).setLngLat([lng,lat]).addTo(map));
    };
    stops.forEach((s,i)=>{
      const cls = 'pin' + (v.has(s.id)?' visited':'') + (s.id===selected?' sel':'');
      put(pinEl(v.has(s.id)?'✓':i+1, cls, ()=>select(s.id)), s.lng, s.lat);
    });
    far.forEach(s=>{
      const cls = 'pin far' + (v.has(s.id)?' visited':'') + (s.id===selected?' sel':'');
      put(pinEl('★', cls, ()=>select(s.id)), s.lng, s.lat);
    });
    if(pos) put(pinEl('', 'me'), pos.lng, pos.lat);
    if(needFit){
      const pts = line.concat(pos && mode!=='galata' && dist(pos, stops[0]) < 8000 ? [[pos.lng,pos.lat]] : []);
      if(pts.length){
        const bb = pts.reduce((b,p)=>b.extend(p), new maplibregl.LngLatBounds(pts[0], pts[0]));
        map.fitBounds(bb, {padding:{top:46,bottom:46,left:46,right:46}, maxZoom:16, duration:0});
      }
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
If you cannot identify it confidently, set "emin": false, describe what you see and say honestly that you are not sure. Never invent dates or facts. Never identify real people from their faces; if people are in the photo, ignore them and talk only about the place or object.`;
        const r = await AI.ask([{text:prompt},{inline_data:{mime_type:'image/jpeg',data:b64}}], {json:true});
        if(!r.ad || !r.metin) throw new Error('bad');
        r._shot = 'data:image/jpeg;base64,' + b64;
        Journal.addSeen({ad:r.ad, kisa:r.kisa||'', metin:r.metin, emin:r.emin!==false, img:thumb, place:placeName});
        return r;
      },
      onResult: r => {
        const u = T();
        if(r.hata) return `<div class="tag">${esc(u.errTitle)}</div><h2>${esc(u.errTitle)}</h2><div class="story">${esc(r.why==='offline'?u.aiOffline:r.why==='rate'?u.aiBusy:u.aiErr)}</div>`;
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
  let lastKey = '';
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
    $('sample').textContent = !GEP.nearWeb ? '' : (mode==='galata' ? (pos && dist(pos,GALATA[0])>1500 ? u.myPlace : '') : u.sample);
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
    const idx = stops.findIndex(x=>x.id===s.id), fresh = lastKey !== s.id; lastKey = s.id;
    $('now').className = 'card now' + (isHere && !isDone ? ' here' : '') + (isDone ? ' done' : '');
    $('now').innerHTML = `
      <div class="media ${s.img?'':'ph'}" data-k="${esc(s.id)}">
        ${s.img?`<img class="pic ${fresh?'in':''}" src="${esc(s.img)}" alt="" onerror="this.parentNode.classList.add('ph');this.remove()">`:`<span class="mono">${esc(t.ad.charAt(0))}</span>`}
        <div class="shade"></div>
        ${s.img&&s.pic?`<a class="credit" href="${esc(s.pic.page)}" target="_blank" rel="noopener">${esc(u.photoBy)} ${esc(s.pic.by)} · ${esc(s.pic.lic)}</a>`:''}
        <div class="tag">${esc(label)}</div>
        ${idx>=0?`<div class="pos">${idx+1} / ${stops.length}</div>`:''}
        <div class="cap ${fresh?'in':''}"><h2>${esc(t.ad)}</h2>
          <div class="meta">${esc(t.kisa)}${d!==null && !isHere && !s.far ? ' · '+fmt(d) : ''}</div></div>
      </div>
      <div class="row">
        <button class="play" data-play="${esc(s.id)}">${Voice.is(s.id)?ICON.pause:ICON.play}<b>${esc(Voice.is(s.id)?u.stop:u.listen)}</b><span>${minutes(t.metin)} ${esc(String(u.minutes).split(" ")[0])}</span></button>
        ${Share.button('stop')}
        <button class="check ${isDone?'on':''}" id="check" aria-label="${esc(isDone?u.unmark:u.markVisited)}" title="${esc(isDone?u.unmark:u.markVisited)}">${ICON.check}</button>
      </div>
      <div class="story ${storyOpen?'open':''}">${esc(t.metin)}${s.wiki?`<div class="src">${esc(t.rehber?u.srcAi:u.src)}</div>`:''}</div>
      <button class="toggle" id="toggle">${esc(storyOpen?u.hide:u.read)}</button>`;
    $('toggle').onclick = () => { storyOpen=!storyOpen; App.refresh(); };
    $('check').onclick = () => toggleVisited(s.id);

    /* konum düğmesi ve notlar */
    $('locate').style.display = geoState==='on' ? 'none' : 'flex';
    $('locate').innerHTML = ICON.target; $('locate').setAttribute('aria-label', geoState==='wait'?u.locating:u.locate); $('locate').classList.toggle('wait', geoState==='wait');
    $('note').textContent = geoState==='denied' ? u.denied : (netErr ? u.netErr : '');

    /* rota listesi */
    const th = (x, inner) => `<span class="th ${x.img?'has':''}">${x.img?`<img src="${esc(x.img)}" alt="" loading="lazy" onerror="this.remove()">`:''}<b>${inner}</b></span>`;
    $('route').innerHTML = stops.map((x,i)=>{ const tx=txt(x), done=v.has(x.id); return `
      <button class="stop ${x.id===selected?'sel':''} ${done?'visited':''}" data-id="${x.id}">
        ${th(x, done?'✓':i+1)}
        <span class="t"><b>${esc(tx.ad)}</b><span>${esc(tx.kisa || (pos?fmt(dist(pos,x)):''))}</span></span>
        <span class="d">${pos && tx.kisa ? fmt(dist(pos,x)) : ''}</span>
      </button>`; }).join('');

    /* biraz uzakta */
    $('farBlock').style.display = far.length ? 'block' : 'none';
    $('farTitle').textContent = u.farTitle; $('farMeta').textContent = u.farMeta;
    const ref = pos || center;
    $('far').innerHTML = far.map(x=>{ const tx=txt(x), done=v.has(x.id); return `
      <button class="stop ${x.id===selected?'sel':''} ${done?'visited':''}" data-id="${x.id}">
        ${th(x, done?'✓':'★')}
        <span class="t"><b>${esc(tx.ad)}</b><span>${esc(tx.kisa||'')}</span></span>
        <span class="d">${ref?fmt(dist(ref,x)):''}<br>${esc(ref && dist(ref,x)>3000?u.drive:u.walk)}</span>
      </button>`; }).join('');

    document.querySelectorAll('#route .stop, #far .stop').forEach(b=>b.onclick=()=>select(b.dataset.id));
    drawMap();
  }

  /* ---------- Galata durak fotoğrafları: Wikimedia Commons, yalnızca serbest lisanslı olanlar ----------
     Kabul: CC0, kamu malı, CC BY, CC BY-SA. Yazar ve lisans fotoğrafın üstünde gösterilir. */
  /* Her durak için Commons'ta elle seçilmiş KATEGORİ(ler): konu kesin, arama tahmini yok. */
  const GPIC = { kule:['Exterior of Galata Tower'], kamondo:['Camondo Stairs'], banka:['Ottoman Bank Museum','SALT (institution)'],
                 arap:['Arap Mosque'], mevlevi:['Galata Mevlevihanesi'] };
  const GPIN = { banka:['File:Ottoman Banks Archives and Research Centre.jpg'] };
  const LIC_OK = /^(cc0|public domain|pd[- ]|pdm|cc by(-sa)? \d)/i;
  const licRank = l => /^(cc0|public domain|pd|pdm)/i.test(l) ? 0 : /^cc by \d/i.test(l) ? 1 : 2;
  const plain = h => { const d = document.createElement('div'); d.innerHTML = String(h||''); return (d.textContent||'').replace(/\s+/g,' ').trim(); };
  async function loadGalataPics(){
    let changed = false;
    await Promise.all(GALATA.map(async s => {
      const key = 'pic4-'+s.id, hit = Store.get(key, null);
      if(hit){ s.img = hit.src; s.pic = hit; return; }
      const q = GPIC[s.id]; if(!q) return;
      try{
        const lists = await Promise.all(q.map(async cat => {
          const r = await fetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
            action:'query', format:'json', formatversion:'2', origin:'*', generator:'categorymembers', gcmtitle:'Category:'+cat, gcmtype:'file', gcmlimit:'60',
            prop:'imageinfo', iiprop:'url|extmetadata|size|mime', iiurlwidth:'900'}));
          return ((await r.json()).query||{}).pages || [];
        }));
        const pins = await Promise.all((GPIN[s.id]||[]).map(async t => {
          try{ const r = await fetch('https://commons.wikimedia.org/w/api.php?' + new URLSearchParams({
            action:'query', format:'json', formatversion:'2', origin:'*', titles:t, prop:'imageinfo', iiprop:'url|extmetadata|size|mime', iiurlwidth:'900'}));
            return ((await r.json()).query||{}).pages || []; }catch(e){ return []; } }));
        const pinned = new Set([].concat(...pins).map(p=>p.title));
        const pages = [].concat(...pins, ...lists);
        const ok = pages.map(p=>({p, ii:(p.imageinfo||[])[0]})).filter(({p,ii})=>{
          if(!ii || ii.mime!=='image/jpeg' || ii.width<1400) return false;
          if(!pinned.has(p.title) && (ii.width>ii.height*2.2 || ii.height>ii.width*1.9)) return false;
          const m = ii.extmetadata||{}, lic = (m.LicenseShortName||{}).value||'';
          if((m.NonFree||{}).value==='true' || /NC|ND/i.test(lic.replace(/CC BY-SA/i,''))) return false;
          return LIC_OK.test(lic) && !/map|plan|drawing|poster|engraving|painting|logo/i.test(p.title);
        }).map(o=>{ const t=(o.p.title+' '+plain(((o.ii.extmetadata||{}).ImageDescription||{}).value)).toLowerCase();
          o.sc = (/interior|inside|ceiling|spiral|elevator|restaurant|exhibit|detail|origami|library|shop|cemetery|grave|türbe|tomb|statue|night|snow|moon|close-?up|window|clock|plaque|inscription|sign\b|fire|flag|bird|cat\b|dog\b|person|portrait|people|crowd|model|ticket|cafe|menu/.test(t) ? 10 : 0)
               + (/exterior|view|skyline|panoram|sunset|dusk|from|tower of|kulesi|street|facade|mosque|camii|steps|merdiven|building|bina/.test(t) ? -3 : 0)
               + (o.ii.width >= o.ii.height*1.15 ? -2 : (o.ii.width < o.ii.height*0.9 ? 1 : 0));
          return o; })
        .map(o=>{ if(pinned.has(o.p.title)) o.sc = -100; return o; })
        .sort((x,y)=> x.sc-y.sc || licRank(x.ii.extmetadata.LicenseShortName.value)-licRank(y.ii.extmetadata.LicenseShortName.value) || x.p.index-y.p.index);
        const best = ok[0];
        if(best){
          const m = best.ii.extmetadata;
          const pic = {src:best.ii.thumburl||best.ii.url, page:best.ii.descriptionurl, lic:m.LicenseShortName.value,
                       by: plain((m.Artist||{}).value).slice(0,40) || 'Wikimedia Commons'};
          s.img = pic.src; s.pic = pic; Store.set(key, pic); changed = true;
        }
      }catch(e){}
    }));
    if(changed || GALATA.some(s=>s.img)) App.refresh();
  }

  /* ---------- Bağlantılar ---------- */
  function init(){
    if(!GEP.nearWeb){ $('search').hidden = true; $('note').hidden = true; }
    loadGalataPics();
    $('locate').onclick = locate;
    $('camBtn').onclick = openCamera;
    $('search').onsubmit = async e => {
      e.preventDefault(); const q = $('q').value.trim(); if(!q) return; $('q').blur();
      try{
        const j = await wiki({action:'query', generator:'search', gsrsearch:q, gsrlimit:6, prop:'coordinates', colimit:6});
        const hit = (j.query?.pages||[]).filter(p=>p.coordinates&&p.coordinates.length).sort((a,b)=>a.index-b.index)[0];
        if(!hit) return toast(T().notFound);
        loadNear(hit.coordinates[0].lat, hit.coordinates[0].lon, hit.title.replace(/\s*\(.*\)$/,''));
      }catch(err){ toast(T().netErr); }
    };
    $('sample').onclick = () => {
      Voice.stop();
      if(mode==='galata' && pos){ loadNear(pos.lat, pos.lng); }
      else { useGalata(); manual=true; storyOpen=false; App.refresh(); window.scrollTo({top:0, behavior:'smooth'}); }
    };
    $('mapMe').onclick = () => { if(pos && map) map.easeTo({center:[pos.lng,pos.lat], zoom:16, duration:500}); };
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

  return { init, locate, render, play, share, langChanged, openSaved, enter(){ setTimeout(()=>map && map.resize(), 50); },
           get pos(){ return pos; }, toggleVisited };
})();
App.register('gezi', Gezi);
