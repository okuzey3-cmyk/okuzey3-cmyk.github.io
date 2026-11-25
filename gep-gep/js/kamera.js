/* =========================================================
   Gep Gep — kamera katmanı
   Gezi (yapı tanıma) ve Alışveriş (etiket okuma) aynı kamerayı kullanır.
   ========================================================= */

const Cam = {
  stream: null,
  mode: null,          // 'gezi' | 'shop'
  onShot: null,        // (base64) => Promise
  onResult: null,      // sonucu alttaki kartta çizer

  open(mode, {onShot, onResult, onShare}){
    if(!hasAI()) return this.keySheet(()=>this.open(mode, {onShot, onResult, onShare}));
    if(!Store.get('ai-ok', false)) return this.consentSheet(()=>this.open(mode, {onShot, onResult, onShare}));
    this.mode = mode; this.onShot = onShot; this.onResult = onResult; this.onShare = onShare;
    const u = T();
    $('cam').className = 'cam open' + (mode==='shop' ? ' label' : '');
    $('sheet').className = 'sheet';
    $('camHint').textContent = mode==='shop' ? u.camHintLabel : u.camHint;
    $('scanTxt').textContent = u.scanning;
    if(!navigator.mediaDevices?.getUserMedia){ this.close(); return toast(u.camErr); }
    navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}, width:{ideal:1920}}, audio:false})
      .then(st=>{ this.stream = st; $('video').srcObject = st; })
      .catch(()=>{ this.close(); toast(u.camErr, 3200); });
  },

  stopStream(){ if(this.stream){ this.stream.getTracks().forEach(t=>t.stop()); this.stream = null; } },

  close(){ Voice.stop(); this.stopStream(); $('cam').className = 'cam'; App.refresh(); },

  shoot(){
    const v = $('video'); if(!v.videoWidth) return;
    const W = 1024, H = Math.round(v.videoHeight*W/v.videoWidth), c = document.createElement('canvas');
    c.width = W; c.height = H; c.getContext('2d').drawImage(v, 0, 0, W, H);
    const url = c.toDataURL('image/jpeg', 0.82); $('shot').src = url;
    $('cam').className = 'cam open frozen busy' + (this.mode==='shop' ? ' label' : '');
    const b64 = url.split(',')[1];
    // küçük önizleme günlüğe kaydedilsin diye
    const t = document.createElement('canvas'); t.width = 160; t.height = Math.round(H*160/W);
    t.getContext('2d').drawImage(c, 0, 0, t.width, t.height);
    const thumb = t.toDataURL('image/jpeg', 0.6);
    this.onShot(b64, thumb)
      .then(r => this.showSheet(r))
      .catch(e => this.showSheet({hata:true, why: !navigator.onLine ? 'offline' : (e && e.message==='rate' ? 'rate' : '')}));
  },

  showSheet(result){
    $('cam').className = 'cam open frozen' + (this.mode==='shop' ? ' label' : '');
    $('sheet').innerHTML = '<div class="grab"></div>' + this.onResult(result) +
      `<button class="again" id="again">${esc(T().again)}</button>`;
    requestAnimationFrame(()=>$('sheet').classList.add('up'));
    $('again').onclick = () => { Voice.stop(); $('sheet').className = 'sheet'; $('cam').className = 'cam open' + (this.mode==='shop' ? ' label' : ''); };
    this.last = result;
  },

  consentSheet(then){
    const tr = lang==='tr';
    $('cam').className = 'cam open frozen';
    $('shot').removeAttribute('src');
    $('sheet').innerHTML = `<div class="grab"></div>
      <div class="tag">${tr?'Başlamadan önce':'Before you start'}</div>
      <h2>${tr?'Fotoğrafın yapay zekâya gider':'Your photo goes to an AI'}</h2>
      <p class="small">${tr?'Kameranla çektiğin fotoğraf, ne olduğunu anlatabilmek için Google Gemini’ye gönderilir. Bizde saklanmaz. Başkalarının yüzünü ya da kişisel bilgisini çekmemeye özen göster. Anlatımlar yapay zekâ ile üretilir ve yanılabilir; önemli bilgileri resmî kaynaklardan doğrula.':'The photo you take is sent to Google Gemini so it can tell you what it is. We do not keep it. Please avoid photographing other people’s faces or personal information. Answers are AI-generated and can be wrong; check important facts with official sources.'}</p>
      <p class="small"><a href="#" id="consentMore">${tr?'Gizlilik ve kaynaklar':'Privacy & sources'}</a></p>
      <button class="save" id="consentOk">${tr?'Anladım, devam et':'Got it, continue'}</button>
      <button class="again" id="consentNo">${tr?'Vazgeç':'Cancel'}</button>`;
    requestAnimationFrame(()=>$('sheet').classList.add('up'));
    $('consentMore').onclick = e => { e.preventDefault(); openLegal(); };
    $('consentNo').onclick = () => { $('sheet').className='sheet'; $('cam').className='cam'; App.refresh(); };
    $('consentOk').onclick = () => { Store.set('ai-ok', true); $('sheet').className='sheet'; $('cam').className='cam'; if(then) setTimeout(then, 200); };
  },

  keySheet(then){
    const u = T();
    this.stopStream();
    $('cam').className = 'cam open frozen';
    $('shot').removeAttribute('src');
    $('sheet').innerHTML = `<div class="grab"></div>
      <div class="tag">${esc(u.keyTitle)}</div>
      <p class="small">${esc(u.keyText)}</p>
      <p class="small"><a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">${esc(u.keyLink)} ↗</a></p>
      <input id="keyIn" type="password" autocomplete="off" placeholder="${esc(u.keyPh)}" value="${esc(getKey())}">
      <button class="save" id="keySave">${esc(u.save)}</button>`;
    requestAnimationFrame(()=>$('sheet').classList.add('up'));
    $('keySave').onclick = () => {
      const k = $('keyIn').value.trim(); if(!k) return;
      Store.set('key', k); toast(u.keySaved);
      $('cam').className = 'cam'; App.refresh();
      if(then) setTimeout(then, 250);
    };
  },

  init(){
    if(GEP.proxy) $('camKey').style.display = 'none';   /* herkese açık sürümde kişisel anahtar düğmesi gerekmez */
    $('camClose').onclick = () => this.close();
    $('shutter').onclick = () => this.shoot();
    $('camKey').onclick = () => this.keySheet(this.mode ? () => this.open(this.mode, {onShot:this.onShot, onResult:this.onResult, onShare:this.onShare}) : null);
    /* Alttaki kartta oynat düğmesi */
    $('sheet').addEventListener('click', e=>{
      const sh = e.target.closest('[data-share]');
      if(sh && this.last){ e.stopPropagation(); this.onShare && this.onShare(this.last); return; }
      const b = e.target.closest('[data-play]'); if(!b || !this.last) return;
      e.stopPropagation();
      const text = this.last.metin || this.last.ozet || '';
      Voice.toggle(b.dataset.play, text, () => { if($('cam').classList.contains('open')) this.showSheet(this.last); });
      this.showSheet(this.last);
    });
  }
};
Cam.init();
