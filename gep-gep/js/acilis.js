/* =========================================================
   Gep Gep — ilk açılış: karşılama, ne yapar, izinler (bir kez gösterilir)
   ========================================================= */
const Onb = (() => {
  const TXT = {
    tr:{ skip:'Atla', next:'Devam', go:'Başla',
      h1:'Tutmasını bilene<br><em>her şeyi anlatır.</em>', p1:'Kamerayı bir şeye tut, hikâyesini dinle.',
      h2:'Bir uygulama,<br><em>üç iş.</em>',
      rows:[['Gezi','Tarihî bir yere kamerayı tut, hikâyesini dinle.'],
            ['Gökyüzü','Telefonu göğe tut; Ay’ı, gezegenleri ve parlak yıldızları göstersin.'],
            ['Alışveriş','Ürün etiketini tara; ne olduğunu, artısını eksisini öğren.']],
      h3:'Başlamadan<br><em>önce.</em>', p3:'İki izin isteyeceğiz. İkisi de yalnızca işine yaradığında.',
      perm:[['Kamera','Sen “Kameraya tut” dediğinde açılır. Çektiğin kare, ne olduğunu anlamak için yapay zekaya gönderilir.'],
            ['Konum','Yakındaki durakları ve doğru gökyüzünü göstermek için. İstemezsen reddet, uygulama yine çalışır.']],
      note:'Telefon, izinleri ilk kullandığında soracak.' },
    en:{ skip:'Skip', next:'Continue', go:'Get started',
      h1:'Point at anything.<br><em>Hear its story.</em>', p1:'Hold the camera up to a place and listen.',
      h2:'One app,<br><em>three things.</em>',
      rows:[['Walk','Point at a landmark and hear its story.'],
            ['Sky','Hold your phone up to find the Moon, the planets and the brightest stars.'],
            ['Shopping','Scan a label to see what it is, with its pros and cons.']],
      h3:'Before<br><em>you start.</em>', p3:'We’ll ask for two permissions, only when they help you.',
      perm:[['Camera','Opens only when you tap “Point the camera”. The frame you take is sent to an AI to work out what it is.'],
            ['Location','To show nearby stops and the right sky. You can say no, the app still works.']],
      note:'Your phone will ask the first time you use each one.' }
  };
  if((GEP.features||[]).join()==='sky'){
    Object.assign(TXT.tr,{ p1:'Telefonu göğe tut, gökyüzünü tanı.', h2:'Gökyüzünü<br><em>cebinde taşı.</em>',
      rows:[['Ay ve gezegenler','Şu an nerede olduklarını yönüyle birlikte gör.'],['Parlak yıldızlar','Birine dokun, hikâyesini dinle.'],['İnternet gerekmez','Hesaplar telefonunun içinde yapılır.']],
      h3:'Başlamadan<br><em>önce.</em>', p3:'İki izin isteyeceğiz. İkisi de yalnızca işine yaradığında.',
      perm:[['Konum','Doğru gökyüzünü hesaplamak için. Dışarı gönderilmez. İstemezsen reddet, uygulama yine çalışır.'],['Hareket sensörü','Telefonu göğe tuttuğunda yönü bulmak için. iPhone bir kez soracak.']], note:'Hiçbir verin telefonundan çıkmaz.' });
    Object.assign(TXT.en,{ p1:'Hold your phone up and get to know the sky.', h2:'Carry the sky<br><em>in your pocket.</em>',
      rows:[['Moon and planets','See where they are right now, with direction.'],['Bright stars','Tap one to hear its story.'],['No internet needed','All maths happens inside your phone.']],
      h3:'Before<br><em>you start.</em>', p3:'We’ll ask for two permissions, only when they help you.',
      perm:[['Location','To calculate the right sky. It never leaves your phone. You can say no, the app still works.'],['Motion sensor','To find the direction when you hold the phone up. iPhone will ask once.']], note:'None of your data leaves your phone.' });
  }
  if((GEP.features||[]).join()==='gezi,sky'){
    Object.assign(TXT.tr,{ h2:'Bir uygulama,<br><em>iki iş.</em>',
      rows:[['Gezi','Tarihî bir yere kamerayı tut, hikâyesini dinle.'],['Gökyüzü','Telefonu göğe tut; Ay’ı, gezegenleri ve parlak yıldızları göstersin.']] });
    Object.assign(TXT.en,{ h2:'One app,<br><em>two things.</em>',
      rows:[['Walk','Point at a landmark and hear its story.'],['Sky','Hold your phone up to find the Moon, the planets and the brightest stars.']] });
  }
  const I = {
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'
  };
  const MARK = '<svg class="ob-mark" viewBox="0 0 512 512" aria-hidden="true"><rect class="bg" width="512" height="512" rx="112" fill="#c4552d"/><circle class="ring" pathLength="1" cx="256" cy="212" r="94" fill="none" stroke="#f4efe6" stroke-width="32" stroke-linecap="round" transform="rotate(-90 256 212)"/><path class="tail" pathLength="1" d="M350 118V318C350 372 312 398 262 398C232 398 208 388 190 370" fill="none" stroke="#f4efe6" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/><circle class="dot" cx="256" cy="212" r="30" fill="#f4efe6"/></svg>';
  let page = 0, el, track, done = false;

  function row(ic, b, s, i){ return `<div class="ob-row rise" style="--i:${i}"><div class="ob-ic">${ic}</div><div><b>${esc(b)}</b><span>${esc(s)}</span></div></div>`; }
  function build(){
    const t = TXT[lang] || TXT.tr, icons = [I.moon, I.moon, I.moon].map((x,i)=>(GEP.features||[]).join()==='sky' ? x : [I.pin, I.moon, ICON.tag][i]), pic = (GEP.features||[]).join()==='sky' ? [ICON.nav, ICON.nav] : [ICON.camera, ICON.nav];
    el.innerHTML = `
      <div class="ob-top"><div class="ob-lang"><button data-l="tr">TR</button><button data-l="en">EN</button></div><button class="ob-skip" id="obSkip">${esc(t.skip)}</button></div>
      <div class="ob-track" id="obTrack">
        <section class="ob-slide"><div class="ob-in ob-hero">${MARK}
          <h1 class="ob-h rise" style="--i:3">${t.h1}</h1><p class="ob-p rise" style="--i:4">${esc(t.p1)}</p></div></section>
        <section class="ob-slide"><div class="ob-in">
          <h1 class="ob-h rise" style="--i:0">${t.h2}</h1>
          <div class="ob-rows">${t.rows.map((r,i)=>row(icons[i], r[0], r[1], i+1)).join('')}</div></div></section>
        <section class="ob-slide"><div class="ob-in">
          <h1 class="ob-h rise" style="--i:0">${t.h3}</h1><p class="ob-p rise" style="--i:1">${esc(t.p3)}</p>
          <div class="ob-rows">${t.perm.map((r,i)=>row(pic[i], r[0], r[1], i+2)).join('')}</div>
          <p class="ob-note rise" style="--i:4">${esc(t.note)}</p></div></section>
      </div>
      <div class="ob-foot"><div class="ob-dots"><i></i><i></i><i></i></div><button class="ob-btn" id="obNext"></button></div>`;
    track = $('obTrack');
    el.querySelectorAll('.ob-lang button').forEach(b => b.onclick = () => {
      if(lang === b.dataset.l) return;
      const h = document.querySelector(`.lang button[data-l="${b.dataset.l}"]`); h && h.click();
      const p = page; build(); go(p, true);
    });
    $('obSkip').onclick = finish; $('obNext').onclick = () => page < 2 ? go(page + 1) : finish();
  }
  function go(n, instant){
    page = Math.max(0, Math.min(2, n));
    const t = TXT[lang] || TXT.tr;
    if(instant) track.style.transition = 'none';
    track.style.transform = `translateX(${-page * 100 / 3}%)`;
    if(instant){ void track.offsetWidth; track.style.transition = ''; }
    track.querySelectorAll('.ob-slide').forEach((s, i) => s.classList.toggle('on', i === page));
    el.querySelectorAll('.ob-dots i').forEach((d, i) => d.classList.toggle('on', i === page));
    el.querySelectorAll('.ob-lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    $('obNext').textContent = page < 2 ? t.next : t.go;
    $('obSkip').classList.toggle('hide', page === 2);
  }
  function finish(){
    if(done) return; done = true; Store.set('onb', 1);
    el.classList.add('out'); setTimeout(() => { el.hidden = true; document.body.style.overflow = ''; }, 380);
  }
  function swipe(){
    let x0 = null, y0 = null;
    el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, {passive:true});
    el.addEventListener('touchend', e => {
      if(x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if(Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(page + (dx < 0 ? 1 : -1));
    }, {passive:true});
  }
  return {
    start(){
      const force = /[?&]onb=1/.test(location.search);
      if(!force && Store.get('onb', 0)) return;
      el = $('ob'); el.hidden = false; document.body.style.overflow = 'hidden';
      build(); swipe(); go(0, true);
    }
  };
})();
