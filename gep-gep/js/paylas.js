/* =========================================================
   Gep Gep — paylaşma
   Instagram hikayesi boyutunda (1080×1920) görsel kart çizer ve
   telefonun kendi paylaş menüsünü açar (WhatsApp, Instagram, Mesajlar…).
   ========================================================= */

const Share = (() => {
  const W = 1080, H = 1920;
  const APP_URL = location.origin + location.pathname.replace(/index\.html$/, '');
  const SERIF = 'ui-serif, "New York", "Iowan Old Style", Georgia, serif';
  const SANS = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif';

  function loadImg(src){
    return new Promise(res=>{
      if(!src) return res(null);
      const im = new Image(); im.crossOrigin = 'anonymous';
      im.onload = () => res(im); im.onerror = () => res(null);
      im.src = src;
    });
  }

  function wrap(c, text, maxW, maxLines){
    const words = String(text||'').split(/\s+/), lines = []; let line = '';
    for(const w of words){
      const t = line ? line+' '+w : w;
      if(c.measureText(t).width > maxW && line){ lines.push(line); line = w; if(lines.length===maxLines) break; }
      else line = t;
    }
    if(lines.length < maxLines && line) lines.push(line);
    if(lines.length===maxLines && words.join(' ').length > lines.join(' ').length){
      let l = lines[maxLines-1]; while(c.measureText(l+'…').width > maxW && l.length) l = l.slice(0,-1);
      lines[maxLines-1] = l.replace(/[\s,.;:]+$/,'') + '…';
    }
    return lines;
  }

  function cover(c, im, x, y, w, h){
    const r = Math.max(w/im.width, h/im.height), iw = im.width*r, ih = im.height*r;
    c.drawImage(im, x+(w-iw)/2, y+(h-ih)/2, iw, ih);
  }

  function logo(c, x, y, light){
    c.fillStyle = '#c4552d'; roundRect(c, x, y, 64, 64, 18); c.fill();
    c.strokeStyle = light ? '#fffcf7' : '#f4efe6'; c.lineWidth = 7;
    c.beginPath(); c.arc(x+32, y+32, 15, 0, 7); c.stroke();
    c.fillStyle = light ? '#fffcf7' : '#f4efe6'; c.beginPath(); c.arc(x+32, y+32, 6, 0, 7); c.fill();
    c.fillStyle = light ? '#fff' : '#1c1916'; c.font = `700 46px ${SANS}`; c.textBaseline = 'middle';
    c.fillText('gep gep', x+84, y+34);
  }
  function roundRect(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }

  /* opts: {eyebrow, title, line, img, theme:'day'|'night', badge} */
  async function card(opts){
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c = cv.getContext('2d'), night = opts.theme === 'night';
    const bg = night ? '#0b1022' : '#f4efe6', ink = night ? '#ffffff' : '#1c1916', ink2 = night ? 'rgba(255,255,255,.72)' : '#5d564d';

    // arka plan
    c.fillStyle = bg; c.fillRect(0,0,W,H);
    const im = await loadImg(opts.img);
    const photoH = 1180;
    if(im){
      cover(c, im, 0, 0, W, photoH);
      const g = c.createLinearGradient(0, photoH-520, 0, photoH); g.addColorStop(0, bg+'00'); g.addColorStop(1, bg);
      c.fillStyle = g; c.fillRect(0, photoH-520, W, 520);
    } else if(night){
      const g = c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#05081a'); g.addColorStop(.6,'#16203a'); g.addColorStop(1,'#0b1022');
      c.fillStyle = g; c.fillRect(0,0,W,H);
      let s = 7; const rnd = () => (s = (s*16807) % 2147483647) / 2147483647;
      for(let i=0;i<260;i++){ const x=rnd()*W, y=rnd()*1300, r=rnd()*2.6+.4; c.globalAlpha=.25+rnd()*.75; c.fillStyle='#fff'; c.beginPath(); c.arc(x,y,r,0,7); c.fill(); }
      c.globalAlpha = 1;
      if(opts.glow){ const gg = c.createRadialGradient(W/2,560,0,W/2,560,260); gg.addColorStop(0,opts.glow); gg.addColorStop(.25,opts.glow+'88'); gg.addColorStop(1,'transparent');
        c.fillStyle = gg; c.beginPath(); c.arc(W/2,560,260,0,7); c.fill(); c.fillStyle = opts.glow; c.beginPath(); c.arc(W/2,560,46,0,7); c.fill(); }
    } else {
      const g = c.createLinearGradient(0,0,W,photoH); g.addColorStop(0,'#c4552d'); g.addColorStop(1,'#e8a067');
      c.fillStyle = g; c.fillRect(0,0,W,photoH);
      c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 3;
      for(let r=120; r<900; r+=110){ c.beginPath(); c.arc(W*0.78, 380, r, 0, 7); c.stroke(); }
      const g2 = c.createLinearGradient(0, photoH-420, 0, photoH); g2.addColorStop(0, bg+'00'); g2.addColorStop(1, bg);
      c.fillStyle = g2; c.fillRect(0, photoH-420, W, 420);
    }

    // metinler
    const X = 90, maxW = W - 180; let y = 1120;
    c.textBaseline = 'alphabetic';
    if(opts.badge){
      c.font = `700 38px ${SANS}`; const bw = c.measureText(opts.badge).width + 64;
      c.fillStyle = night ? 'rgba(255,255,255,.14)' : '#5f8a4a'; roundRect(c, X, y-100, bw, 76, 38); c.fill();
      c.fillStyle = '#fff'; c.fillText(opts.badge, X+32, y-49);
      y += 20;
    }
    if(opts.eyebrow){
      c.fillStyle = night ? 'rgba(255,255,255,.65)' : '#c4552d'; c.font = `700 34px ${SANS}`;
      c.fillText(opts.eyebrow.toLocaleUpperCase(lang==='tr'?'tr':'en').split('').join(String.fromCharCode(8202)), X, y+30); y += 70;
    }
    c.fillStyle = ink; c.font = `600 112px ${SERIF}`;
    let size = 112, lines = wrap(c, opts.title, maxW, 3);
    if(lines.length===3){ size = 92; c.font = `600 ${size}px ${SERIF}`; lines = wrap(c, opts.title, maxW, 3); }
    for(const l of lines){ y += size*1.08; c.fillText(l, X, y); }
    if(opts.line){
      y += 50; c.fillStyle = ink2; c.font = `400 44px ${SANS}`;
      for(const l of wrap(c, opts.line, maxW, 4)){ y += 62; c.fillText(l, X, y); }
    }

    // alt bilgi
    c.strokeStyle = night ? 'rgba(255,255,255,.15)' : '#e7dfd2'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(X, H-210); c.lineTo(W-X, H-210); c.stroke();
    logo(c, X, H-160, night);
    c.fillStyle = night ? 'rgba(255,255,255,.55)' : '#9a9185'; c.font = `500 30px ${SANS}`; c.textAlign = 'right';
    c.fillText(APP_URL.replace(/^https?:\/\//,'').replace(/\/$/,''), W-X, H-118);
    c.textAlign = 'left';

    return new Promise(res => cv.toBlob(b => res(b), 'image/png'));
  }

  /* Paylaş menüsünü aç: önce görselli, olmazsa yazılı, o da olmazsa linki kopyala */
  async function go({text, cardOpts, fileName='gepgep.png'}){
    const u = T();
    toast(u.sharePrep, 1500);
    let file = null;
    try{ const blob = await card(cardOpts); if(blob) file = new File([blob], fileName, {type:'image/png'}); }catch(e){}
    const full = `${text}\n${APP_URL}`;
    try{
      if(file && navigator.canShare && navigator.canShare({files:[file]})){
        await navigator.share({files:[file], text:full}); return;
      }
      if(navigator.share){ await navigator.share({title:'Gep Gep', text, url:APP_URL}); return; }
    }catch(e){ if(e && e.name==='AbortError') return; }
    // yedek: linki kopyala, görseli yeni sekmede aç
    try{ await navigator.clipboard.writeText(full); toast(u.shareCopied, 2600); }catch(e){}
    if(file){ const a = document.createElement('a'); a.href = URL.createObjectURL(file); a.download = fileName; a.click(); }
  }

  const button = id => `<button class="share" data-share="${esc(id)}" aria-label="${esc(T().share)}" title="${esc(T().share)}">${ICON.share}</button>`;

  return { card, go, button, APP_URL };
})();
