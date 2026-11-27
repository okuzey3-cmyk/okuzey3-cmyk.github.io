/* =========================================================
   Gep Gep — Günlük bölümü
   Gezilen duraklar, kayıtlı (internetsiz) rotalar, kamera tanımaları,
   özet sayılar ve ayarlar. Her şey sadece bu telefonda saklanır.
   ========================================================= */

const LEGAL = {
  tr:{btn:'Gizlilik ve kaynaklar', sub:'Verilerin nereye gittiği, kullanılan kaynaklar', title:'Gizlilik ve kaynaklar', close:'Kapat',
    sec:[
     ['Verilerin nerede?','Günlüğün, kayıtlı rotaların ve ayarların yalnızca bu telefonda saklanır. Gep Gep’in kullanıcı hesabı ya da sunucusunda tutulan verin yoktur. “Sil” düğmesi hepsini kaldırır.'],
     ['Kamera fotoğrafları','Kameranla bir şeye tuttuğunda çektiğin fotoğraf, ne olduğunu anlatabilmek için Google Gemini yapay zekâsına gönderilir. Fotoğraf bizde saklanmaz. Başkalarının yüzü ya da kişisel bilgisi görünen fotoğraf çekmemeye özen göster.'],
     ['Konum','Konumun yalnızca yakındaki duraklar ve gökyüzü hesabı için kullanılır. Haritadan şehir adı bulmak için koordinat Nominatim (OpenStreetMap) hizmetine gönderilir.'],
     ['Yapay zekâ uyarısı','Anlatımlar ve ürün yorumları yapay zekâ ile üretilir, yanılabilir. Alerji, sağlık ve güvenlik konularında her zaman ürünün etiketine ve resmî kaynaklara bak.'],
     ['Kullanım koşulları','Gep Gep bilgilendirme amaçlıdır. Anlatımlar, ürün yorumları ve gökyüzü konumları yaklaşıktır; hatalı ya da eksik olabilir. Uygulamayı kullanırken trafik, güvenlik ve yasalar sana aittir; yürürken ekrana değil çevrene dikkat et. Alerji, sağlık, hukuk ve para konularında verilen bilgi tavsiye yerine geçmez. Uygulamayı kötüye kullanmaya çalışmamayı (aşırı istek göndermek gibi) kabul edersin; gerekirse erişim sınırlanabilir.'],
     ['KVKK aydınlatma (6698)','Veri sorumlusu: Gep Gep geliştiricisi. İşlenen veriler: kamerayla çektiğin fotoğraf (yorumlanmak üzere, anlık), yaklaşık konum (yakındaki duraklar için), yazdığın arama metni. Amaç: istediğin anlatımı sana göstermek. Hukuki sebep: hizmetin sunulması ve ilk kullanımda verdiğin onay. Aktarım: fotoğraf Google’a (Gemini), arama Nominatim’e, ürün barkodu Open Food Facts’e gider; bu hizmetler yurt dışındadır. Günlük, rota ve ayarların yalnızca telefonunda durur; “Sil” ile kaldırırsın. KVKK madde 11 kapsamındaki haklarını kullanmak için iletişim bölümündeki adresi kullanabilirsin.'],
     ['Kaynaklar','Yer bilgileri ve fotoğrafları: Wikipedia (CC BY-SA, yazarları ilgili sayfalarda). Harita: OpenFreeMap, © OpenMapTiles, veri © OpenStreetMap katkıcıları. Barkodlu ürün bilgisi: Open Food Facts (ODbL). Gök cisimleri: Astronomy Engine (MIT). Harita aracı: MapLibre GL (BSD). Aracı sunucu: Cloudflare. Yapay zekâ: Google Gemini.']
    ]},
  en:{btn:'Privacy & sources', sub:'Where your data goes, and what we use', title:'Privacy & sources', close:'Close',
    sec:[
     ['Where is your data?','Your journal, saved routes and settings stay on this phone only. Gep Gep has no accounts or servers holding your data. “Delete” removes everything.'],
     ['Camera photos','When you point the camera at something, the photo is sent to Google Gemini so it can tell you what it is. We do not keep the photo. Please avoid photographing other people’s faces or personal information.'],
     ['Location','Your location is used only for nearby stops and the sky. To find a city name, coordinates are sent to Nominatim (OpenStreetMap).'],
     ['AI notice','Stories and product comments are AI-generated and can be wrong. For allergies, health and safety always check the product label and official sources.'],
     ['Terms of use','Gep Gep is for information only. Stories, product comments and sky positions are approximate and may be wrong or incomplete. You are responsible for your own safety and for obeying the law; watch your surroundings, not the screen, while walking. Information about allergies, health, law or money is not advice. Do not abuse the service (for example by sending excessive requests); access may be limited.'],
     ['Privacy notice (KVKK/GDPR)','Controller: the Gep Gep developer. Data processed: the photo you take (instantly, to be interpreted), approximate location (for nearby stops), the search text you type. Purpose: to show you the story you asked for. Legal basis: providing the service and your consent on first use. Transfers: photos go to Google (Gemini), searches to Nominatim, product barcodes to Open Food Facts; these services are abroad. Your journal, routes and settings stay on your phone; “Delete” removes them. To exercise your data rights use the contact below.'],
     ['Sources','Places and photos: Wikipedia (CC BY-SA, authors on each page). Map: OpenFreeMap, © OpenMapTiles, data © OpenStreetMap contributors. Barcode data: Open Food Facts (ODbL). Sky: Astronomy Engine (MIT). Map tool: MapLibre GL (BSD). Relay: Cloudflare. AI: Google Gemini.']
    ]}
};
const LEGAL_SKY = {
  tr:{title:'Gizlilik ve kaynaklar', close:'Kapat', sec:[
    ['Verilerin nerede?','Gökyüzü hesabı tamamen telefonunda yapılır. Konumun ve sensör bilgilerin telefondan dışarı çıkmaz, hiçbir sunucuya gönderilmez. Hesap, kayıt ya da takip yoktur.'],
    ['Konum','Doğru gökyüzünü hesaplamak için telefonunun konumu kullanılır. İstemezsen reddedebilirsin; uygulama İstanbul’a göre çalışmaya devam eder.'],
    ['Hareket ve yön sensörleri','Telefonu göğe tuttuğunda pusula ve eğim sensörleri o yönü bulmak için kullanılır. iPhone’da bunun için izin sorulur.'],
    ['Kullanım koşulları','Gep Gep bilgilendirme amaçlıdır. Gök cisimlerinin konumları yaklaşık değerlerdir. Güneş’e asla doğrudan ya da kamerayla bakma. Geceleri gökyüzüne bakarken çevrene, zemine ve trafiğe dikkat et.'],
    ['Kaynaklar','Gök cisimlerinin konum hesabı: Astronomy Engine (MIT lisansı). Yıldız ve gezegen bilgileri genel astronomi bilgisidir; açıklama metinleri bu uygulamaya özgü yazılmıştır.']]},
  en:{title:'Privacy & sources', close:'Close', sec:[
    ['Where is your data?','The sky is calculated entirely on your phone. Your location and sensor data never leave it and are never sent to any server. There are no accounts, logs or tracking.'],
    ['Location','Your phone’s location is used to calculate the right sky. You can decline; the app keeps working for Istanbul.'],
    ['Motion and orientation sensors','When you hold your phone up, the compass and tilt sensors find that direction. On iPhone you are asked for permission.'],
    ['Terms of use','Gep Gep is for information only. Positions of sky objects are approximate. Never look at the Sun directly or through a camera. Watch your surroundings and the ground while stargazing.'],
    ['Sources','Sky position maths: Astronomy Engine (MIT licence). Star and planet facts are general astronomy knowledge; the descriptions are original to this app.']]}
};
const LEGAL_GS = {
  tr:{title:'Gizlilik ve kaynaklar', close:'Kapat', sec:[
    ['Verilerin nerede?','Gezildi işaretlerin, kayıtlı rotaların ve ayarların yalnızca bu telefonda saklanır. Gep Gep’in hesap, kayıt ya da takip sistemi yoktur. Gökyüzü hesabı ve en yakın durağın bulunması telefonun içinde yapılır.'],
    ['Kamera fotoğrafları','“Kameraya tut” dediğinde çekilen fotoğraf, ne olduğunu anlatabilmek için yapay zekâ servisine (Google Gemini) gönderilir. Fotoğraf bizde saklanmaz. Başkalarının yüzü ya da kişisel bilgisi görünen fotoğraf çekmemeye özen göster.'],
    ['Konum ve sensörler','Konum, en yakın durağı ve doğru gökyüzünü bulmak için kullanılır. Bulunduğun yerin yakınındaki gezilecek yerleri listelemek için yaklaşık koordinatın Vikipedi’ye ve OpenStreetMap’in Overpass hizmetine, semt adını yazmak için Nominatim’e gönderilir; yazdığın arama metni de Vikipedi’ye gider. Pusula ve eğim sensörleri telefonu göğe tuttuğunda yönü bulur. İzinleri istersen reddedebilirsin.'],
    ['Yol tarifi','“Rotayı haritada başlat” düğmesine bastığında Google Haritalar açılır; durakların koordinatları ve konum izni verdiysen bulunduğun nokta oraya gider. Basmazsan hiçbir şey gönderilmez.'],
    ['Yapay zekâ uyarısı','Kamerayla yapılan tanıma ve anlatımlar yapay zekâ ile üretilir, yanılabilir. Seçme rota anlatımları bu uygulamaya özgü yazılmıştır, yakındaki yerlerin anlatımı Vikipedi’den özetlenir; yine de önemli bilgileri resmî kaynaklardan doğrula.'],
    ['Kullanım koşulları','Gep Gep bilgilendirme amaçlıdır. Anlatımlar, gök cisimlerinin konumları ve yol bilgileri yaklaşık değerlerdir. Güneş’e asla doğrudan ya da kamerayla bakma. Yürürken ekrana değil çevrene ve trafiğe dikkat et. Uygulamayı kötüye kullanmaya çalışmamayı (aşırı istek göndermek gibi) kabul edersin; gerekirse erişim sınırlanabilir.'],
    ['KVKK aydınlatma (6698)','Veri sorumlusu: Gep Gep geliştiricisi. İşlenen veriler: kamerayla çektiğin fotoğraf (yalnızca o anda yorumlanmak üzere), yaklaşık konum (yakındaki yerler için), yazdığın arama metni. Amaç: istediğin anlatımı göstermek. Hukuki sebep: hizmetin sunulması ve ilk kullanımda verdiğin onay. Aktarım: fotoğraf Google’a (Gemini), konum ve arama Vikipedi’ye, OpenStreetMap’e (Overpass, Nominatim) gider; bu servisler yurt dışındadır. Diğer her şey (gezildi işaretleri, kayıtlı rotalar, ayarlar) yalnızca telefonunda kalır; bu sayfanın altındaki “Verilerimi sil” düğmesiyle kaldırırsın. KVKK madde 11 haklarını kullanmak için iletişim bölümündeki adresi kullanabilirsin.'],
    ['Kaynaklar','Yakındaki yerlerin bilgileri: Vikipedi (CC BY-SA) ve © OpenStreetMap katkıcıları (ODbL). Durak fotoğrafları: Wikimedia Commons; yalnızca serbest lisanslı (CC0, kamu malı, CC BY, CC BY-SA) fotoğraflar gösterilir, yazar ve lisans her fotoğrafın üstünde yazar. Harita: OpenFreeMap, © OpenMapTiles, veri © OpenStreetMap katkıcıları. Gök cisimleri hesabı: Astronomy Engine (MIT). Harita aracı: MapLibre GL (BSD). Aracı sunucu: Cloudflare. Yapay zekâ: Google Gemini. Seçme rotadaki (Galata) anlatımlar bu uygulamaya özgü yazılmıştır; yakındaki yerlerin anlatımı Vikipedi metninden özetlenir.']]},
  en:{title:'Privacy & sources', close:'Close', sec:[
    ['Where is your data?','Your visited marks, saved routes and settings stay on this phone only. Gep Gep has no accounts, logs or tracking. The sky maths and finding the nearest stop happen on your phone.'],
    ['Camera photos','When you point the camera, the photo is sent to an AI service (Google Gemini) so it can tell you what it is. We do not keep it. Please avoid photographing other people’s faces or personal information.'],
    ['Location and sensors','Location is used to find the nearest stop and the right sky. To list places to visit near you, your approximate coordinates are sent to Wikipedia and OpenStreetMap’s Overpass service, and to Nominatim to name the area; the text you search for also goes to Wikipedia. The compass and tilt sensors find direction when you hold the phone up. You can decline any permission.'],
    ['Directions','When you tap “Start route in Maps”, Google Maps opens and the stop coordinates, plus your current position if you allowed location, go to it. If you do not tap, nothing is sent.'],
    ['AI notice','Camera recognition and stories are AI-generated and can be wrong. The stories for the selected route are written for this app; nearby places are summarised from Wikipedia. Verify important facts with official sources.'],
    ['Terms of use','Gep Gep is for information only. Stories, sky positions and route details are approximate. Never look at the Sun directly or through a camera. Watch your surroundings and traffic while walking. Do not abuse the service (for example by sending excessive requests); access may be limited.'],
    ['Privacy notice (KVKK/GDPR)','Controller: the Gep Gep developer. Data processed: the photo you take (only to be interpreted at that moment), approximate location (for nearby places), the search text you type. Purpose: to show the story you asked for. Legal basis: providing the service and your consent on first use. Transfers: the photo goes to Google (Gemini), location and searches to Wikipedia and OpenStreetMap (Overpass, Nominatim); these services are abroad. Everything else (visited marks, saved routes, settings) stays on your phone; the “Delete my data” button at the bottom of this page removes it. To exercise your data rights use the contact below.'],
    ['Sources','Nearby places: Wikipedia (CC BY-SA) and © OpenStreetMap contributors (ODbL). Stop photos: Wikimedia Commons; only freely licensed (CC0, public domain, CC BY, CC BY-SA) photos are shown, with author and licence on each photo. Map: OpenFreeMap, © OpenMapTiles, data © OpenStreetMap contributors. Sky maths: Astronomy Engine (MIT). Map tool: MapLibre GL (BSD). Relay: Cloudflare. AI: Google Gemini. Selected-route stories are original to this app; nearby places are summarised from Wikipedia.']]}
};
function openLegal(){
  const f = (GEP.features||[]).join();
  const only = f === 'sky';
  const L = only ? LEGAL_SKY[lang] : (f==='gezi,sky' ? LEGAL_GS[lang] : LEGAL[lang]); let el = document.getElementById('legal');
  if(!el){ el = document.createElement('div'); el.id='legal'; el.className='legal'; document.body.appendChild(el); }
  el.innerHTML = `<div class="legal-in"><div class="grab"></div><h2>${esc(L.title)}</h2>`+
    L.sec.map(([h,t])=>`<h4>${esc(h)}</h4><p>${esc(t)}</p>`).join('')+
    (GEP.contact?`<h4>${lang==='tr'?'İletişim':'Contact'}</h4><p><a href="mailto:${esc(GEP.contact)}">${esc(GEP.contact)}</a></p>`:'')+
    `<button class="again" id="legalDel" style="margin-bottom:8px;background:rgba(255,255,255,.07);color:var(--ink)">${lang==='tr'?'Verilerimi sil':'Delete my data'}</button>`+
    `<button class="again" id="legalX">${esc(L.close)}</button></div>`;
  requestAnimationFrame(()=>el.classList.add('on'));
  const close=()=>{ el.classList.remove('on'); };
  document.getElementById('legalX').onclick=close;
  document.getElementById('legalDel').onclick=()=>{
    if(!confirm(lang==='tr'?'Bu telefondaki tüm Gep Gep verileri (gezildi işaretleri, kayıtlı rotalar, ayarlar) silinsin mi?':'Delete all Gep Gep data on this phone (visited marks, saved routes, settings)?')) return;
    Store.clearAll(); toast(lang==='tr'?'Veriler silindi':'Data deleted'); close(); setTimeout(()=>location.reload(), 700);
  }; el.onclick=e=>{ if(e.target===el) close(); };
}

const Log = (() => {
  let openSeen = null;   // açılan tanıma kaydı

  function stats(){
    const v = Journal.visits(), places = new Set(v.map(x=>x.place).filter(Boolean));
    Journal.routes().forEach(r=>places.add(r.place));
    const u = T();
    return [[places.size, u.statCity], [v.length, u.statStop], [Journal.products().length, u.statProduct], [Journal.seen().length, u.statSeen]];
  }

  function render(){
    const u = T();
    $('logEyebrow').textContent = u.logEyebrow; $('logTitle').textContent = u.logTitle; $('logIntro').textContent = u.logIntro;
    $('stats').innerHTML = stats().map(([n,l])=>`<div class="stat"><b>${n}</b><span>${esc(l)}</span></div>`).join('');

    /* kayıtlı rotalar */
    const routes = Journal.routes();
    $('savedTitle').textContent = u.savedTitle; $('savedMeta').textContent = u.savedMeta;
    $('saved').innerHTML = routes.length ? routes.map(r=>{
      const done = Store.get('done-'+r.key.replace(/-(tr|en)$/,''), []).length;
      const cover = r.stops.find(s=>s.img)?.img;
      return `<div class="stop" data-route="${esc(r.key)}">
        ${cover?`<img class="ph" src="${esc(cover)}" alt="">`:`<span class="ic">🗺</span>`}
        <span class="t"><b>${esc(r.place)}</b><span>${esc(u.stopsN(r.stops.length))} · ${done}/${r.stops.length} · ${esc(dateStr(r.ts))}</span></span>
        <button class="del" data-delroute="${esc(r.key)}" aria-label="sil">${ICON.x}</button>
      </div>`; }).join('') : `<div class="empty">${esc(u.savedEmpty)}</div>`;
    document.querySelectorAll('[data-route]').forEach(el=>el.onclick=e=>{
      if(e.target.closest('[data-delroute]')) return;
      const r = Journal.routes().find(x=>x.key===el.dataset.route); if(r) Gezi.openSaved(r);
    });
    document.querySelectorAll('[data-delroute]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); Journal.removeRoute(b.dataset.delroute); render(); });

    /* gezilen duraklar — yere göre grupla */
    const visits = Journal.visits();
    $('visitTitle').textContent = u.visitTitle; $('visitMeta').textContent = visits.length ? u.stopsN(visits.length) : '';
    $('visits').innerHTML = visits.length ? visits.slice(0,40).map(x=>`
      <div class="stop">
        ${x.img?`<img class="ph" src="${esc(x.img)}" alt="" loading="lazy">`:`<span class="n" style="background:var(--ok);border-color:var(--ok);color:#fff">✓</span>`}
        <span class="t"><b>${esc(x.ad)}</b><span>${esc([x.place, dateStr(x.ts)].filter(Boolean).join(' · '))}</span></span>
        <a class="del" href="https://www.google.com/maps/search/?api=1&query=${x.lat},${x.lng}" target="_blank" rel="noopener" aria-label="harita">↗</a>
      </div>`).join('') : `<div class="empty">${esc(u.visitEmpty)}</div>`;

    /* kamera tanımaları */
    const seen = Journal.seen();
    $('seenTitle').textContent = u.seenTitle; $('seenMeta').textContent = seen.length ? String(seen.length) : '';
    $('seen').innerHTML = seen.length ? seen.slice(0,30).map((s,i)=>`
      <button class="stop ${openSeen===i?'sel':''}" data-seen="${i}" style="flex-wrap:wrap">
        ${s.img?`<img class="ph" src="${esc(s.img)}" alt="">`:`<span class="ic">📷</span>`}
        <span class="t"><b>${esc(s.ad)}</b><span>${esc([s.place, dateStr(s.ts)].filter(Boolean).join(' · '))}</span></span>
        ${openSeen===i?`<span style="flex-basis:100%;font-family:var(--serif);font-size:16px;line-height:1.55;margin-top:10px;color:var(--ink)">${esc(s.metin)}</span>`:''}
      </button>`).join('') : `<div class="empty">${esc(u.seenEmpty)}</div>`;
    document.querySelectorAll('[data-seen]').forEach(b=>b.onclick=()=>{ const i=+b.dataset.seen; openSeen = openSeen===i ? null : i; render(); });

    /* ayarlar */
    const rate = Store.get('rate', 0.96), key = getKey();
    $('setTitle').textContent = u.setTitle;
    $('settings').innerHTML = `
      <div class="set"><div><b>${esc(u.setKey)}</b><span>${esc(key?u.setKeyOn+' · ••••'+key.slice(-4):u.setKeyOff)}</span></div>
        <button id="setKeyBtn">${esc(key?u.change:u.add)}</button></div>
      <div class="set"><div><b>${esc(u.setRate)}</b><span>${esc(u.setRateSub)} · ${rate.toFixed(2).replace('.', lang==='tr'?',':'.')}×</span></div>
        <input type="range" id="rate" min="0.75" max="1.25" step="0.05" value="${rate}"></div>
      <div class="set"><div><b>${esc(u.setClear)}</b><span>${esc(u.setClearSub)}</span></div>
        <button class="danger" id="clearBtn">${esc(u.delBtn)}</button></div>
      <div class="set"><div><b>${esc(LEGAL[lang].btn)}</b><span>${esc(LEGAL[lang].sub)}</span></div>
        <button id="legalBtn">${esc(u.open||(lang==='tr'?'Aç':'Open'))}</button></div>`;
    $('legalBtn').onclick = openLegal;
    $('setKeyBtn').onclick = () => Cam.keySheet(()=>render());
    $('rate').oninput = e => { Store.set('rate', +e.target.value); };
    $('rate').onchange = () => { render(); Voice.speak('rate-test', lang==='tr' ? 'Anlatım hızı böyle olacak.' : 'This is how fast the story will be told.'); };
    $('clearBtn').onclick = () => { if(confirm(u.clearConfirm)){ Store.clearAll(); toast(u.cleared); render(); } };
  }

  return { render, play(){} };
})();
App.register('log', Log);
