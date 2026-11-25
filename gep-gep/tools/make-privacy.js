/* Gizlilik sayfasını (gizlilik.html) uygulamanın içindeki metinlerden üretir.
   Çalıştır: node tools/make-privacy.js   (js/gunluk.js veya js/config.js değişince yeniden üretilir) */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const g = fs.readFileSync(path.join(root, 'js/gunluk.js'), 'utf8');
const cfg = fs.readFileSync(path.join(root, 'js/config.js'), 'utf8');
const block = g.slice(g.indexOf('const LEGAL_GS'), g.indexOf('function openLegal'));
const LEGAL_GS = new Function(block + '; return LEGAL_GS;')();
const contact = (cfg.match(/contact:\s*'([^']*)'/) || [])[1] || '';
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const date = new Date().toISOString().slice(0,10);
const sec = L => L.sec.map(([h,t]) => `<h2>${esc(h)}</h2><p>${esc(t)}</p>`).join('') +
  (contact ? `<h2>${L===LEGAL_GS.tr?'İletişim':'Contact'}</h2><p><a href="mailto:${esc(contact)}">${esc(contact)}</a></p>` : '');
const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0c090c"><title>Gep Gep · Gizlilik / Privacy</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}
body{margin:0;background:#0c090c;color:#d9cfc8;font:17px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif}
main{max-width:680px;margin:0 auto;padding:28px 22px 80px}
header{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px}
header b{font:600 20px Georgia,serif;color:#f4efe6}
.sw button{font:inherit;font-size:14px;color:#9a8f88;background:#1d1719;border:0;padding:7px 14px;cursor:pointer}
.sw button:first-child{border-radius:99px 0 0 99px}.sw button:last-child{border-radius:0 99px 99px 0}
.sw button.on{background:#f4efe6;color:#0c090c}
h1{font:600 38px/1.15 Georgia,serif;color:#f4efe6;margin:0 0 6px;letter-spacing:-.01em}
h2{font:600 17px/1.3 -apple-system,sans-serif;color:#e8794a;margin:30px 0 6px}
p{margin:0}a{color:#e8794a}.d{color:#8c817a;font-size:14px;margin-bottom:8px}
[lang=en]{display:none}body.en [lang=tr]{display:none}body.en [lang=en]{display:block}
</style></head><body><main>
<header><b>gep gep</b><div class="sw"><button class="on" data-l="tr">TR</button><button data-l="en">EN</button></div></header>
<section lang="tr"><h1>${esc(LEGAL_GS.tr.title)}</h1><div class="d">Son güncelleme: ${date}</div>${sec(LEGAL_GS.tr)}</section>
<section lang="en"><h1>${esc(LEGAL_GS.en.title)}</h1><div class="d">Last updated: ${date}</div>${sec(LEGAL_GS.en)}</section>
</main><script>
var q=document.querySelectorAll('.sw button');function s(l){document.body.classList.toggle('en',l==='en');document.documentElement.lang=l;q.forEach(function(b){b.classList.toggle('on',b.dataset.l===l)})}
q.forEach(function(b){b.onclick=function(){s(b.dataset.l)}});if((navigator.language||'').toLowerCase().indexOf('tr')!==0)s('en');
</script></body></html>`;
fs.writeFileSync(path.join(root, 'gizlilik.html'), html);
console.log('gizlilik.html üretildi; iletişim:', contact || '(henüz yok)');
