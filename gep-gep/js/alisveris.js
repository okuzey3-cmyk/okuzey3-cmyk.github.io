/* =========================================================
   Gep Gep — Alışveriş bölümü
   Etiketin fotoğrafı Gemini'ye sorulur: ürün ne, artısı eksisi, içerik notu.
   Fotoğrafta barkod okunursa Open Food Facts'ten besin notu da eklenir.
   ========================================================= */

const Shop = (() => {
  let current = null;    // son taranan ürün

  const NUTRI_COLORS = {a:'#038141', b:'#85bb2f', c:'#fecb02', d:'#ee8100', e:'#e63e11'};
  const NOVA_TXT = {
    tr:{1:'İşlenmemiş', 2:'İşlenmiş mutfak malzemesi', 3:'İşlenmiş gıda', 4:'Çok işlenmiş gıda'},
    en:{1:'Unprocessed', 2:'Processed culinary ingredient', 3:'Processed food', 4:'Ultra-processed food'}
  };

  async function openFoodFacts(code){
    if(!/^\d{8,14}$/.test(code||'')) return null;
    try{
      const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,brands,nutriscore_grade,nova_group,image_front_small_url`);
      const j = await r.json(); if(j.status!==1) return null;
      return j.product;
    }catch(e){ return null; }
  }

  /* Model kodunu Google'da arar; teknik değerleri oradan toplar */
  async function specs(r){
    const dil = lang==='tr' ? 'Türkçe' : 'English';
    const q = `Google'da ara: "${r.marka} ${r.model}" (${r.urun}). Bu modelin resmi teknik özelliklerini bul ve ${dil} yaz. SADECE şu JSON'u döndür:
{"teknik":[{"ad":"Kapasite","deger":"örn. 8 kg"}], "bulundu": true/false}
En fazla 9 satır; varsa şunları sırayla ver: kapasite, boyutlar (YxGxD cm), ağırlık, enerji sınıfı, program sayısı ve öne çıkan programlar, ses seviyesi, su ya da enerji tüketimi, devir/güç, renk ya da malzeme. Sadece aramada gerçekten bulduğun değerleri yaz, bulamadığını yazma, UYDURMA. Model bulunamazsa {"teknik":[],"bulundu":false} döndür.`;
    const j = await AI.ask([{text:q}], {json:true, search:true, temperature:.1});
    const a = (j.teknik||[]).filter(x=>x && x.ad && x.deger).slice(0,9);
    return a.length ? a : null;
  }

  async function analyse(b64, thumb){
    const dil = lang==='tr' ? 'Türkçe' : 'English';
    const prompt = `Bu fotoğrafta mağazada ya da evde bir ürünün etiketi, fiyat kartı veya ambalajı var. Ürün gıda, beyaz eşya, elektronik, giyim, kozmetik, temizlik ya da başka bir şey olabilir. ${dil} yaz. SADECE şu JSON'u döndür:
{"urun": "ürünün adı (örn. Solo Bulaşık Makinesi)", "marka": "marka ya da boş", "model": "model kodu varsa aynen yaz, yoksa boş", "kategori": "kısa kategori",
 "fiyat": "etikette yazan fiyat bilgisi aynen (örn. Peşin 36.600 TL · 4 taksit 39.190 TL), yoksa boş",
 "barkod": "fotoğrafta okunabiliyorsa barkod rakamları, yoksa boş",
 "ozet": "ürünün ne olduğunu ve kimlere uygun olduğunu sade, gündelik dille anlat, 2-3 cümle",
 "ozellikler": ["etiketteki ya da modelin bilinen her önemli özelliği için '<özellik adı>: ne işe yaradığını bilmeyen birine anlatır gibi tek cümle' (en fazla 6 madde; örn. 'ExtraDry: yıkama sonrası kurutmayı güçlendirir, bardaklar daha az ıslak çıkar')"],
 "artilar": ["etikette yazan ya da genel olarak bilinen en fazla 3 güçlü yan"], "eksiler": ["en fazla 3 dikkat edilecek nokta; gıdada şeker, tuz, katkı, alerjen; cihazda enerji sınıfı, boyut, eksik özellik gibi"],
 "icerik_notu": "gıdada içerik notu 1-2 cümle; diğer ürünlerde boş bırak",
 "kullanici_gorusu": "bu ürün ya da model hakkında yaygın ve bilinen genel kullanıcı görüşü varsa 1-2 cümle; bilmiyorsan boş bırak, UYDURMA",
 "emin": true/false}
Etiketi sadece okuyup tekrar etme: özellikleri senin açıklamanı bekleyen bir müşteriye anlatır gibi, ne işe yaradığını ve günlük hayatta ne fark yarattığını açıkla. Marka ya da model hakkında kesin bilmediğin teknik değer (watt, litre, dB vb.) UYDURMA; bilmiyorsan söyleme. Etiketteki yazıları dikkatle oku; eğilmiş, parlak ya da bulanık olsa da okunabilen her bilgiyi kullan. Piyasa fiyatı ya da indirim konusunda tahmin yürütme, sadece etikette yazanı aktar. Sağlık iddiasında bulunma. Ürünü tam tanıyamıyorsan bile etiketten okuduklarınla yanıt ver ve "emin": false yap.`;
    const r = await AI.ask([{text:prompt},{inline_data:{mime_type:'image/jpeg',data:b64}}], {json:true});
    if(!r.urun) r.urun = [r.marka, r.model, r.kategori].filter(Boolean).join(' ');
    if(!r.urun) throw new Error('bad');
    let tech = null;
    if(r.model && r.marka && !/gıda|food|içecek|beverage/i.test(r.kategori||'')){
      try{ tech = await specs(r); }catch(e){ tech = null; }
    }
    const off = await openFoodFacts(String(r.barkod||'').replace(/\D/g,''));
    const p = {...r, teknik: tech, off: off ? {nutri:off.nutriscore_grade||'', nova:off.nova_group||'', name:off.product_name||''} : null,
               img: thumb, lang, metin: [r.ozet, (tech||[]).map(x=>x.ad+': '+x.deger).join('. '), (r.ozellikler||[]).join('. '), r.icerik_notu].filter(Boolean).join(' ')};
    p.ts = Date.now(); Journal.addProduct(p);
    current = {...p, _shot:'data:image/jpeg;base64,'+b64};
    return current;
  }

  function productHTML(p, withPlay){
    const u = T();
    if(p.hata) return `<div class="tag">${esc(u.unsure)}</div><h2>${esc(u.unsure)}</h2><p class="sum">${esc(u.aiErr)}</p>`;
    const chips = [];
    if(p.off?.nutri && NUTRI_COLORS[p.off.nutri]) chips.push(`<span class="chip"><b style="background:${NUTRI_COLORS[p.off.nutri]}">${esc(p.off.nutri.toUpperCase())}</b>${esc(u.nutri)}</span>`);
    if(p.off?.nova) chips.push(`<span class="chip"><b style="background:${['','#038141','#fecb02','#ee8100','#e63e11'][p.off.nova]||'#999'}">${esc(p.off.nova)}</b>${esc(NOVA_TXT[lang][p.off.nova]||u.nova)}</span>`);
    if(p.fiyat) chips.push(`<span class="chip">${esc(p.fiyat)}</span>`);
    if(p.model) chips.push(`<span class="chip">${esc(p.model)}</span>`);
    if(p.barkod) chips.push(`<span class="chip">${esc(u.barcode)} ${esc(p.barkod)}</span>`);
    const list = (arr, cls, sign) => (arr||[]).filter(Boolean).map(x=>`<i class="${cls}">${sign}</i><span>${esc(x)}</span>`).join('');
    return `<div class="tag">${esc(p.emin===false ? u.unsure : (p.kategori || u.shopEyebrow))}</div>
      <h2>${esc(p.urun)}</h2>${p.marka?`<div class="brand">${esc(p.marka)}</div>`:''}
      ${withPlay ? playButton('shop-'+(p.ts||'now'), p.metin, Share.button('product')) : ''}
      <p class="sum">${esc(p.ozet||'')}</p>
      ${(p.artilar?.length||p.eksiler?.length) ? `<div class="pros">${list(p.artilar,'p','+')}${list(p.eksiler,'m','−')}</div>` : ''}
      ${(p.ozellikler||[]).filter(Boolean).length?`<div class="sub"><h4>${esc(u.features)}</h4>${p.ozellikler.filter(Boolean).map(x=>{const i=x.indexOf(':');return i>0&&i<40?`<p class="feat"><b>${esc(x.slice(0,i))}</b> ${esc(x.slice(i+1).trim())}</p>`:`<p class="feat">${esc(x)}</p>`}).join('')}</div>`:''}
      ${(p.teknik||[]).length?`<div class="sub"><h4>${esc(u.tech)}</h4><div class="spec">${p.teknik.map(x=>`<div><span>${esc(x.ad)}</span><b>${esc(x.deger)}</b></div>`).join('')}</div><p class="src">${esc(u.techSrc)}</p></div>`:''}
      ${chips.length?`<div class="chips">${chips.join('')}</div>`:''}
      ${p.icerik_notu?`<div class="sub"><h4>${esc(u.ingredients)}</h4><p>${esc(p.icerik_notu)}</p></div>`:''}
      ${p.kullanici_gorusu?`<div class="sub"><h4>${esc(u.users)}</h4><p>${esc(p.kullanici_gorusu)}</p></div>`:''}
      ${p.off?`<p class="src" style="margin-top:12px">${esc(u.offSrc)}</p>`:''}`;
  }

  function scan(){
    Cam.open('shop', {
      onShot: (b64, thumb) => analyse(b64, thumb),
      onResult: p => `<div class="product">${productHTML(p, !p.hata)}</div>`,
      onShare: p => share(p)
    });
  }

  function share(p){
    p = p || current; if(!p || p.hata) return;
    const u = T();
    Share.go({text:u.shProduct(p.urun), fileName:'gepgep-urun.png',
      cardOpts:{eyebrow:u.cardProduct + (p.kategori?' · '+p.kategori:''), title:p.urun,
                line:p.ozet||'', img:p._shot||p.img, badge:p.off?.nutri ? (lang==='tr'?'Besin notu ':'Nutri-Score ')+p.off.nutri.toUpperCase() : ''}});
  }

  function render(){
    const u = T(), hist = Journal.products();
    $('shopEyebrow').textContent = u.shopEyebrow; $('shopTitle').textContent = u.shopTitle; $('shopIntro').textContent = u.shopIntro;
    $('shopScan').innerHTML = ICON.tag + esc(u.shopScan);
    $('shopFine').textContent = u.shopFine;
    $('shopResult').innerHTML = current ? `<div class="card product">${productHTML(current, true)}</div>` : '';
    $('shopHistBlock').style.display = hist.length ? 'block' : 'none';
    $('shopHistTitle').textContent = u.shopHistTitle; $('shopHistMeta').textContent = u.shopHistMeta(hist.length);
    $('shopHist').innerHTML = hist.slice(0,20).map(p=>`
      <button class="stop ${current&&current.ts===p.ts?'sel':''}" data-ts="${p.ts}">
        ${p.img?`<img class="ph" src="${esc(p.img)}" alt="">`:`<span class="ic">🏷</span>`}
        <span class="t"><b>${esc(p.urun)}</b><span>${esc([p.marka, dateStr(p.ts)].filter(Boolean).join(' · '))}</span></span>
        ${p.off?.nutri && NUTRI_COLORS[p.off.nutri] ? `<span class="chip" style="padding:4px"><b style="background:${NUTRI_COLORS[p.off.nutri]}">${esc(p.off.nutri.toUpperCase())}</b></span>` : ''}
      </button>`).join('');
    document.querySelectorAll('#shopHist [data-ts]').forEach(b=>b.onclick=()=>{
      current = Journal.products().find(p=>String(p.ts)===b.dataset.ts); Voice.stop(); render(); window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  return {
    init(){ $('shopScan').onclick = scan; },
    render,
    share(){ share(current); },
    play(id){ const p = current; if(p) Voice.toggle(id, p.metin || p.ozet); },
    enter(){ if(!current){ const h = Journal.products(); current = h[0] || null; } },
    set current(p){ current = p; }
  };
})();
App.register('shop', Shop);
