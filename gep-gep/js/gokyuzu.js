/* =========================================================
   Gep Gep — Gökyüzü bölümü
   Ay, Güneş, gezegenler ve parlak yıldızların şu anki yerleri
   telefonun içinde hesaplanır (astronomy-engine). İnternet gerekmez.
   Telefonu göğe tutunca pusula + eğim ile o yönü gösterir.
   ========================================================= */

const SKY_BODIES = [
  {id:'Sun', type:'sun', color:'#ffd27a',
   tr:{ad:"Güneş", metin:"Güneş, Dünya'ya en yakın yıldızdır ve yaklaşık 150 milyon kilometre uzaklıktadır. Işığı bize yaklaşık sekiz dakikada ulaşır. Güneş Sistemi'ndeki toplam kütlenin neredeyse tamamı ondadır. Güneş'e asla doğrudan ya da kamerayla bakma; gözüne kalıcı zarar verebilir."},
   en:{ad:"Sun", metin:"The Sun is the closest star to Earth, about 150 million kilometres away. Its light takes roughly eight minutes to reach us. It holds almost all the mass of the Solar System. Never look at the Sun directly or through the camera; it can permanently damage your eyes."}},
  {id:'Moon', type:'moon', color:'#f3efe3',
   tr:{ad:"Ay", metin:"Ay, Dünya'nın tek doğal uydusudur ve ortalama 384 bin kilometre uzaklıktadır. Kendi ekseni etrafında dönüşü Dünya çevresindeki dönüşüyle aynı sürede tamamlandığı için bize hep aynı yüzünü gösterir. Gördüğümüz evreler, Güneş'in Ay'ın hangi kısmını aydınlattığına göre değişir. Gelgitlerin asıl sebebi de Ay'ın çekim kuvvetidir."},
   en:{ad:"Moon", metin:"The Moon is Earth's only natural satellite, on average 384 thousand kilometres away. It turns once on its axis in the same time it takes to orbit Earth, so it always shows us the same face. Its phases depend on how much of the side facing us is lit by the Sun. The Moon's pull is also the main cause of the tides."}},
  {id:'Mercury', type:'planet', color:'#c9b8a6',
   tr:{ad:"Merkür", metin:"Merkür, Güneş'e en yakın ve Güneş Sistemi'nin en küçük gezegenidir. Güneş'e çok yakın olduğu için onu ancak gün doğmadan hemen önce ya da gün battıktan hemen sonra, ufka yakın bir yerde görebilirsin. Bir yılı yalnızca 88 gün sürer."},
   en:{ad:"Mercury", metin:"Mercury is the closest planet to the Sun and the smallest in the Solar System. Because it stays so close to the Sun, you can only see it low on the horizon just before sunrise or just after sunset. A year there lasts only 88 days."}},
  {id:'Venus', type:'planet', color:'#fff3c4',
   tr:{ad:"Venüs", metin:"Venüs, halk arasında Çoban Yıldızı ya da Akşam Yıldızı diye bilinir ama aslında bir gezegendir. Ay'dan sonra gece gökyüzünün en parlak cismidir. Kalın bulut örtüsü ısıyı hapsettiği için yüzeyi yaklaşık 460 derecedir; bu da onu Güneş Sistemi'nin en sıcak gezegeni yapar."},
   en:{ad:"Venus", metin:"Venus is often called the Morning Star or Evening Star, but it is a planet. After the Moon it is the brightest object in the night sky. Its thick clouds trap heat, so its surface is about 460 degrees Celsius, making it the hottest planet in the Solar System."}},
  {id:'Mars', type:'planet', color:'#ff8a5c',
   tr:{ad:"Mars", metin:"Mars, kızılımsı rengiyle tanınan Kızıl Gezegen'dir. Bu renk, yüzeyindeki demir oksitten, yani bir çeşit pastan gelir. Phobos ve Deimos adında iki küçük uydusu vardır. Güneş Sistemi'nin en yüksek yanardağı Olympus Mons da Mars'tadır."},
   en:{ad:"Mars", metin:"Mars is the Red Planet, known for its rusty colour. That colour comes from iron oxide, a kind of rust, on its surface. It has two small moons, Phobos and Deimos. The tallest volcano in the Solar System, Olympus Mons, is also on Mars."}},
  {id:'Jupiter', type:'planet', color:'#f5dcb4',
   tr:{ad:"Jüpiter", metin:"Jüpiter, Güneş Sistemi'nin en büyük gezegenidir; içine binden fazla Dünya sığabilir. Sıradan bir dürbünle bile yanındaki dört büyük uydusunu küçük noktalar halinde görebilirsin. Bunlar 1610'da Galileo tarafından keşfedildi. Ünlü Büyük Kırmızı Leke, yüzyıllardır süren dev bir fırtınadır."},
   en:{ad:"Jupiter", metin:"Jupiter is the largest planet in the Solar System; more than a thousand Earths could fit inside it. Even with ordinary binoculars you can see its four large moons as tiny dots beside it. Galileo discovered them in 1610. Its famous Great Red Spot is a giant storm that has lasted for centuries."}},
  {id:'Saturn', type:'planet', color:'#ecd9a0',
   tr:{ad:"Satürn", metin:"Satürn, buz ve kaya parçalarından oluşan muhteşem halkalarıyla tanınır. Çıplak gözle sarımsı bir yıldız gibi görünür; halkalarını görmek için küçük bir teleskop yeterlidir. Yoğunluğu o kadar düşüktür ki, yeterince büyük bir su havuzu olsa üzerinde yüzebilirdi."},
   en:{ad:"Saturn", metin:"Saturn is famous for its magnificent rings of ice and rock. To the naked eye it looks like a yellowish star; a small telescope is enough to see the rings. Its density is so low that it would float in a large enough pool of water."}}
];

/* Parlak yıldızlar: sağ açıklık (saat), dik açıklık (derece), parlaklık */
const SKY_STARS = [
  {id:'Sirius', ra:6.7525, dec:-16.716, mag:-1.46,
   tr:{ad:"Sirius", kisa:"Büyük Köpek", metin:"Sirius, gece gökyüzünün en parlak yıldızıdır. Büyük Köpek takımyıldızında yer alır ve yaklaşık 8,6 ışık yılı uzaklıktadır; yani gördüğün ışık yola sekiz yılı aşkın süre önce çıktı. Yanında, çıplak gözle görülmeyen küçük bir beyaz cüce eşi vardır."},
   en:{ad:"Sirius", kisa:"Canis Major", metin:"Sirius is the brightest star in the night sky. It sits in the constellation Canis Major, about 8.6 light years away, so the light you see left it more than eight years ago. It has a small white dwarf companion that you cannot see with the naked eye."}},
  {id:'Arcturus', ra:14.2610, dec:19.182, mag:-0.05,
   tr:{ad:"Arktürüs", kisa:"Çoban", metin:"Arktürüs, gökyüzünün kuzey yarısındaki en parlak yıldızdır. Turuncu renkli bir dev yıldızdır ve yaklaşık 37 ışık yılı uzaklıktadır. Büyükayı'nın kuyruğundaki kavisi takip ederek kolayca bulunabilir."},
   en:{ad:"Arcturus", kisa:"Boötes", metin:"Arcturus is the brightest star in the northern half of the sky. It is an orange giant about 37 light years away. You can find it by following the curve of the Big Dipper's handle."}},
  {id:'Vega', ra:18.6156, dec:38.784, mag:0.03,
   tr:{ad:"Vega", kisa:"Çalgı", metin:"Vega, Çalgı takımyıldızının parlak mavimsi beyaz yıldızıdır ve yaklaşık 25 ışık yılı uzaklıktadır. Deneb ve Altair ile birlikte yaz gecelerinin ünlü Yaz Üçgeni'ni oluşturur. Yaklaşık on iki bin yıl sonra kutup yıldızı olacaktır."},
   en:{ad:"Vega", kisa:"Lyra", metin:"Vega is the bright blue-white star of Lyra, about 25 light years away. Together with Deneb and Altair it forms the famous Summer Triangle. In about twelve thousand years it will become the pole star."}},
  {id:'Capella', ra:5.2782, dec:45.998, mag:0.08,
   tr:{ad:"Kapella", kisa:"Arabacı", metin:"Kapella, Arabacı takımyıldızının en parlak yıldızıdır ve yaklaşık 43 ışık yılı uzaklıktadır. Tek bir yıldız gibi görünse de aslında birbirinin çevresinde dönen birden fazla yıldızdan oluşur. Kış gecelerinde başın üstüne yakın parlar."},
   en:{ad:"Capella", kisa:"Auriga", metin:"Capella is the brightest star in Auriga, about 43 light years away. It looks like a single star but is actually several stars orbiting each other. On winter nights it shines high overhead."}},
  {id:'Rigel', ra:5.2423, dec:-8.202, mag:0.13,
   tr:{ad:"Rigel", kisa:"Avcı", metin:"Rigel, Avcı takımyıldızının ayağındaki mavi beyaz süperdevdir. Yaklaşık 860 ışık yılı uzaklıkta olmasına rağmen bu kadar parlak görünmesi, Güneş'ten on binlerce kat daha fazla ışık saçmasındandır."},
   en:{ad:"Rigel", kisa:"Orion", metin:"Rigel is the blue-white supergiant at Orion's foot. It is about 860 light years away, yet it looks this bright because it gives off tens of thousands of times more light than the Sun."}},
  {id:'Procyon', ra:7.6550, dec:5.225, mag:0.34,
   tr:{ad:"Procyon", kisa:"Küçük Köpek", metin:"Procyon, Küçük Köpek takımyıldızının en parlak yıldızıdır ve yaklaşık 11,5 ışık yılı uzaklığıyla bize en yakın yıldızlardan biridir. Sirius ve Betelgeuse ile birlikte Kış Üçgeni'ni oluşturur."},
   en:{ad:"Procyon", kisa:"Canis Minor", metin:"Procyon is the brightest star in Canis Minor and, at about 11.5 light years, one of our nearest stellar neighbours. With Sirius and Betelgeuse it forms the Winter Triangle."}},
  {id:'Betelgeuse', ra:5.9195, dec:7.407, mag:0.50,
   tr:{ad:"Betelgeuse", kisa:"Avcı", metin:"Betelgeuse, Avcı'nın omzundaki kırmızımsı süperdevdir. O kadar büyüktür ki Güneş'in yerine koysak, Mars'ın yörüngesini aşabilirdi. Yıldız ömrünün sonuna yaklaşmıştır ve bir gün süpernova olarak patlayacaktır; ama bu, yüz bin yıl sonra da olabilir."},
   en:{ad:"Betelgeuse", kisa:"Orion", metin:"Betelgeuse is the reddish supergiant on Orion's shoulder. It is so large that, placed where the Sun is, it could reach beyond the orbit of Mars. It is near the end of its life and will one day explode as a supernova, though that may be a hundred thousand years away."}},
  {id:'Altair', ra:19.8464, dec:8.868, mag:0.76,
   tr:{ad:"Altair", kisa:"Kartal", metin:"Altair, Kartal takımyıldızının en parlak yıldızıdır ve yaklaşık 17 ışık yılı uzaklıktadır. Kendi çevresinde o kadar hızlı döner ki ekvatoru şişkin, basık bir top gibidir. Yaz Üçgeni'nin üç köşesinden biridir."},
   en:{ad:"Altair", kisa:"Aquila", metin:"Altair is the brightest star in Aquila, about 17 light years away. It spins so fast that its equator bulges out like a flattened ball. It is one of the three corners of the Summer Triangle."}},
  {id:'Aldebaran', ra:4.5987, dec:16.509, mag:0.86,
   tr:{ad:"Aldebaran", kisa:"Boğa", metin:"Aldebaran, Boğa takımyıldızının turuncu gözüdür ve yaklaşık 65 ışık yılı uzaklıktadır. Hemen yakınında Ülker yıldız kümesini görebilirsin. Adı Arapçada takip eden anlamına gelir; çünkü gökyüzünde Ülker'in peşinden gider gibi görünür."},
   en:{ad:"Aldebaran", kisa:"Taurus", metin:"Aldebaran is the orange eye of Taurus, about 65 light years away. The Pleiades star cluster is close by. Its name means the follower in Arabic, because it seems to chase the Pleiades across the sky."}},
  {id:'Antares', ra:16.4901, dec:-26.432, mag:0.96,
   tr:{ad:"Antares", kisa:"Akrep", metin:"Antares, Akrep takımyıldızının kırmızı kalbidir. Adı Mars'ın rakibi anlamına gelir; çünkü kızıl rengi gezegen Mars'a çok benzer. Dev bir kırmızı süperdevdir ve yaklaşık 550 ışık yılı uzaklıktadır."},
   en:{ad:"Antares", kisa:"Scorpius", metin:"Antares is the red heart of Scorpius. Its name means rival of Mars, because its colour looks so much like the planet. It is a huge red supergiant about 550 light years away."}},
  {id:'Spica', ra:13.4199, dec:-11.161, mag:0.97,
   tr:{ad:"Spika", kisa:"Başak", metin:"Spika, Başak takımyıldızının mavi beyaz en parlak yıldızıdır ve yaklaşık 250 ışık yılı uzaklıktadır. Aslında birbirine çok yakın dönen iki yıldızdan oluşur. Bahar akşamlarında güney gökyüzünde parlar."},
   en:{ad:"Spica", kisa:"Virgo", metin:"Spica is the blue-white brightest star of Virgo, about 250 light years away. It is really two stars orbiting very close to each other. It shines in the southern sky on spring evenings."}},
  {id:'Pollux', ra:7.7553, dec:28.026, mag:1.14,
   tr:{ad:"Polluks", kisa:"İkizler", metin:"Polluks, İkizler takımyıldızının iki parlak yıldızından turuncu olanıdır ve yaklaşık 34 ışık yılı uzaklıktadır. Çevresinde dönen bir gezegen keşfedilmiştir. Hemen yanındaki ikizi Kastor'dur."},
   en:{ad:"Pollux", kisa:"Gemini", metin:"Pollux is the orange one of Gemini's two bright stars, about 34 light years away. A planet has been found orbiting it. Its twin, Castor, is right next to it."}},
  {id:'Fomalhaut', ra:22.9608, dec:-29.622, mag:1.16,
   tr:{ad:"Fomalhaut", kisa:"Güney Balığı", metin:"Fomalhaut, sonbahar akşamlarında güney ufkunun üzerinde tek başına parlayan bir yıldızdır. Yaklaşık 25 ışık yılı uzaklıktadır ve çevresinde dev bir toz ve buz halkası bulunur."},
   en:{ad:"Fomalhaut", kisa:"Piscis Austrinus", metin:"Fomalhaut shines alone above the southern horizon on autumn evenings. It is about 25 light years away and is surrounded by a huge ring of dust and ice."}},
  {id:'Deneb', ra:20.6905, dec:45.280, mag:1.25,
   tr:{ad:"Deneb", kisa:"Kuğu", metin:"Deneb, Kuğu takımyıldızının kuyruğundadır ve Yaz Üçgeni'nin bir köşesidir. Bilinen en parlak yıldızlardan biridir; bu kadar uzak olmasına rağmen çıplak gözle rahatça görünür. Uzaklığı tam bilinmese de binlerce ışık yılı olduğu tahmin edilir."},
   en:{ad:"Deneb", kisa:"Cygnus", metin:"Deneb marks the tail of Cygnus, the Swan, and is a corner of the Summer Triangle. It is one of the most luminous stars known, easily visible despite being so far away. Its exact distance is uncertain, but it is thought to be thousands of light years."}},
  {id:'Regulus', ra:10.1395, dec:11.967, mag:1.35,
   tr:{ad:"Regulus", kisa:"Aslan", metin:"Regulus, Aslan takımyıldızının kalbidir ve yaklaşık 79 ışık yılı uzaklıktadır. Adı Latincede küçük kral anlamına gelir. Çok hızlı döndüğü için o da basık bir şekle sahiptir."},
   en:{ad:"Regulus", kisa:"Leo", metin:"Regulus is the heart of Leo, about 79 light years away. Its name means little king in Latin. It spins very fast, which gives it a flattened shape."}},
  {id:'Castor', ra:7.5767, dec:31.888, mag:1.58,
   tr:{ad:"Kastor", kisa:"İkizler", metin:"Kastor, İkizler takımyıldızının beyaz yıldızıdır. Çıplak gözle tek bir yıldız gibi görünür ama aslında altı yıldızdan oluşan bir ailedir. Yaklaşık 51 ışık yılı uzaklıktadır."},
   en:{ad:"Castor", kisa:"Gemini", metin:"Castor is the white star of Gemini. To the naked eye it looks like one star, but it is actually a family of six stars. It is about 51 light years away."}},
  {id:'Dubhe', ra:11.0621, dec:61.751, mag:1.79,
   tr:{ad:"Dubhe", kisa:"Büyükayı", metin:"Dubhe, Büyükayı'nın kepçe kısmının uç yıldızıdır. Yanındaki Merak yıldızından Dubhe'ye doğru çizilen çizgiyi beş kat uzatırsan Kutup Yıldızı'na ulaşırsın. Yön bulmanın en eski yollarından biri budur."},
   en:{ad:"Dubhe", kisa:"Ursa Major", metin:"Dubhe is the pointer star at the end of the Big Dipper's bowl. Extend the line from Merak through Dubhe about five times and you reach Polaris. It is one of the oldest ways of finding north."}},
  {id:'Alioth', ra:12.9005, dec:55.960, mag:1.77,
   tr:{ad:"Alioth", kisa:"Büyükayı", metin:"Alioth, Büyükayı takımyıldızının en parlak yıldızıdır ve kepçenin sapında yer alır. Yaklaşık 83 ışık yılı uzaklıktadır. Büyükayı, Türkiye'den bakıldığında yıl boyunca hiç batmaz."},
   en:{ad:"Alioth", kisa:"Ursa Major", metin:"Alioth is the brightest star of Ursa Major, in the handle of the Big Dipper. It is about 83 light years away. Seen from Türkiye, the Big Dipper never sets."}},
  {id:'Polaris', ra:2.5303, dec:89.264, mag:1.98,
   tr:{ad:"Kutup Yıldızı", kisa:"Küçükayı", metin:"Kutup Yıldızı, neredeyse tam kuzey yönünü gösterdiği için yüzyıllardır yolcuların rehberi olmuştur. Gökyüzü dönerken o hemen hemen yerinden kımıldamaz. Sanıldığı kadar parlak değildir; ufuktan yüksekliği, bulunduğun yerin enlemine yaklaşık olarak eşittir."},
   en:{ad:"Polaris", kisa:"Ursa Minor", metin:"Polaris has guided travellers for centuries because it sits almost exactly due north. As the sky turns, it barely moves. It is not as bright as people expect; its height above the horizon roughly equals your latitude."}}
];

const Sky = (() => {
  let loc = {lat:41.0082, lng:28.9784}, hasLoc = false;
  let az0 = 180, alt0 = 30, fov = 70;          // bakılan yön
  let compass = false, target = null, picked = null;
  let objs = [], timer = null, raf = null, drag = null;
  let sm = {az:null, alt:null};                 // yumuşatma

  const DIRS = () => T().dirs;
  const dirName = az => DIRS()[Math.round(((az%360)+360)%360/45)%8];
  const wrap = d => ((d+540)%360)-180;

  /* ---------- Hesap ---------- */
  function compute(){
    if(!window.Astronomy) return;
    const A = Astronomy, t = new Date(), ob = new A.Observer(loc.lat, loc.lng, 0);
    const out = [];
    for(const b of SKY_BODIES){
      const eq = A.Equator(b.id, t, ob, true, true), h = A.Horizon(t, ob, eq.ra, eq.dec, 'normal');
      let mag = -1;
      if(b.id==='Sun') mag = -26.7;
      else { try{ mag = A.Illumination(b.id, t).mag; }catch(e){} }
      out.push({...b, az:h.azimuth, alt:h.altitude, mag});
    }
    for(const s of SKY_STARS){
      const h = A.Horizon(t, ob, s.ra, s.dec, 'normal');
      out.push({...s, type:'star', color: s.id==='Betelgeuse'||s.id==='Antares'||s.id==='Aldebaran'||s.id==='Arcturus' ? '#ffc29a' : '#eaf1ff',
                az:h.azimuth, alt:h.altitude});
    }
    objs = out;
  }
  const sun = () => objs.find(o=>o.id==='Sun');
  const visible = () => objs.filter(o=>o.alt>0).sort((a,b)=>a.mag-b.mag);

  /* ---------- Çizim ---------- */
  function draw(){
    const cv = $('sky'); if(!cv) return;
    const W = cv.clientWidth, H = cv.clientHeight, dpr = window.devicePixelRatio||1;
    if(cv.width !== W*dpr){ cv.width = W*dpr; cv.height = H*dpr; }
    const c = cv.getContext('2d'); c.setTransform(dpr,0,0,dpr,0,0);
    const k = W / fov;                              // derece başına piksel
    const P = (az, alt) => [W/2 + wrap(az-az0)*Math.cos(alt*Math.PI/180)*k, H/2 - (alt-alt0)*k];
    const day = sun() && sun().alt > -6;

    // gökyüzü
    const g = c.createLinearGradient(0,0,0,H);
    if(day){ g.addColorStop(0,'#2b4f86'); g.addColorStop(1,'#6f93c4'); }
    else { g.addColorStop(0,'#070b18'); g.addColorStop(1,'#16203a'); }
    c.fillStyle = g; c.fillRect(0,0,W,H);

    // yükseklik çizgileri
    c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 1;
    for(let a=30; a<90; a+=30){ const y = H/2 - (a-alt0)*k; c.beginPath(); c.moveTo(0,y); c.lineTo(W,y); c.stroke(); }

    // ufuk ve yer
    const hy = H/2 + alt0*k;
    if(hy < H){
      c.fillStyle = day ? 'rgba(20,28,40,.92)' : 'rgba(4,6,12,.94)'; c.fillRect(0, Math.max(0,hy), W, H-hy);
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(0,hy); c.lineTo(W,hy); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.7)'; c.font = '600 12px -apple-system, sans-serif'; c.textAlign='center';
      for(let a=0; a<360; a+=45){ const x = W/2 + wrap(a-az0)*k; if(x>-20 && x<W+20) c.fillText(dirName(a), x, Math.min(H-8, hy+18)); }
    }

    // gök cisimleri
    for(const o of objs){
      const [x,y] = P(o.az, o.alt); if(x<-30||x>W+30||y<-30||y>H+30) continue;
      const below = o.alt < 0;
      let r = o.type==='moon' ? 11 : o.type==='sun' ? 13 : Math.max(1.6, 4.4 - o.mag*1.1);
      c.globalAlpha = below ? .35 : (day && o.type==='star' ? .45 : 1);
      const glow = c.createRadialGradient(x,y,0,x,y,r*3.2);
      glow.addColorStop(0, o.color); glow.addColorStop(.35, o.color+'66'); glow.addColorStop(1, 'transparent');
      c.fillStyle = glow; c.beginPath(); c.arc(x,y,r*3.2,0,7); c.fill();
      c.fillStyle = o.color; c.beginPath(); c.arc(x,y,r,0,7); c.fill();
      if(o.type!=='star' || o.mag < 0.6 || o===target || o===picked){
        c.fillStyle = 'rgba(255,255,255,.85)'; c.font = (o===target?'700 ':'500 ')+'12px -apple-system, sans-serif'; c.textAlign='left';
        c.fillText((o[lang]||o.tr).ad, x + r + 6, y + 4);
      }
      c.globalAlpha = 1;
    }
  }

  /* hedef: dairenin içindeki en yakın cisim */
  function findTarget(){
    let best = null, bd = 9;
    for(const o of objs){
      const d = Math.hypot(wrap(o.az-az0)*Math.cos(o.alt*Math.PI/180), o.alt-alt0);
      if(d < bd){ bd = d; best = o; }
    }
    if(best !== target){ target = best; if(target && compass && navigator.vibrate) navigator.vibrate(30); renderCard(); }
  }

  function loop(){ draw(); raf = requestAnimationFrame(loop); }

  /* ---------- Pusula ---------- */
  function onOrient(e){
    let heading = null;
    if(typeof e.webkitCompassHeading === 'number') heading = e.webkitCompassHeading;
    else if(e.absolute && e.alpha!=null) heading = 360 - e.alpha;
    if(heading==null || e.beta==null) return;
    const alt = Math.max(-30, Math.min(90, e.beta - 90));
    if(sm.az===null){ sm.az = heading; sm.alt = alt; }
    sm.az = (sm.az + wrap(heading - sm.az)*0.2 + 360) % 360;
    sm.alt = sm.alt + (alt - sm.alt)*0.2;
    az0 = sm.az; alt0 = sm.alt; findTarget(); updateDir();
  }
  async function startCompass(){
    const u = T();
    try{
      if(typeof DeviceOrientationEvent!=='undefined' && typeof DeviceOrientationEvent.requestPermission==='function'){
        const r = await DeviceOrientationEvent.requestPermission(); if(r!=='granted') throw new Error('denied');
      }
      if(!('ondeviceorientation' in window) && !('ondeviceorientationabsolute' in window)) throw new Error('none');
      window.addEventListener('deviceorientationabsolute', onOrient, true);
      window.addEventListener('deviceorientation', onOrient, true);
      compass = true; toast(u.skyStarted);
      setTimeout(()=>{ if(sm.az===null){ compass=false; toast(u.compassErr, 3200); render(); } }, 2500);
    }catch(e){ compass = false; toast(u.compassErr, 3200); }
    if(!hasLoc && navigator.geolocation) navigator.geolocation.getCurrentPosition(p=>setLocation({lat:p.coords.latitude,lng:p.coords.longitude}), ()=>{}, {timeout:15000});
    render();
  }
  function stopCompass(){
    window.removeEventListener('deviceorientationabsolute', onOrient, true);
    window.removeEventListener('deviceorientation', onOrient, true);
  }

  function updateDir(){ $('skyDir').textContent = `${dirName(az0)} · ${Math.round(az0)}° · ${Math.round(alt0)}° ${T().up}`; }

  /* ---------- Parmakla kaydırma ---------- */
  function bindDrag(){
    const cv = $('sky');
    cv.addEventListener('pointerdown', e=>{ drag = {x:e.clientX, y:e.clientY, az:az0, alt:alt0}; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e=>{
      if(!drag || compass) return;
      const k = cv.clientWidth / fov;
      az0 = (drag.az - (e.clientX-drag.x)/k + 360) % 360;
      alt0 = Math.max(-10, Math.min(85, drag.alt + (e.clientY-drag.y)/k));
      findTarget(); updateDir();
    });
    cv.addEventListener('pointerup', ()=>{ drag = null; });
    cv.addEventListener('pointercancel', ()=>{ drag = null; });
  }

  /* ---------- Kartlar ---------- */
  function cardFor(o){
    const u = T(), t = o[lang] || o.tr;
    const where = o.alt > 0 ? `${dirName(o.az)} · ${Math.round(o.alt)}° ${u.up}` : u.below;
    const kind = u.types[o.type] + (t.kisa ? ' · ' + t.kisa : '');
    return `<div class="tag">${esc(kind)}</div><h2>${esc(t.ad)}</h2>
      <div class="meta">${esc(where)}${o.type!=='sun'?' · '+esc(u.mag(o.mag.toFixed(1).replace('.', lang==='tr'?',':'.'))):''}</div>
      ${playButton('sky-'+o.id, t.metin, Share.button('sky'))}
      <div class="story open">${esc(t.metin)}</div>`;
  }
  function renderCard(){
    const u = T(), o = target || picked;
    const el = $('skyNow');
    if(!o){
      const best = visible().filter(x=>x.type!=='sun')[0];
      el.className = 'card skyinfo';
      el.innerHTML = `<div class="tag">${esc(u.skyAim)}</div>` + (best ? `<h2>${esc((best[lang]||best.tr).ad)}</h2>
        <div class="meta">${esc(dirName(best.az))} · ${Math.round(best.alt)}° ${esc(u.up)}</div>` : `<div class="meta" style="margin-top:8px">${esc(u.skyNone)}</div>`);
      return;
    }
    el.className = 'card skyinfo';
    el.innerHTML = cardFor(o);
  }
  function renderList(){
    const u = T(), v = visible();
    $('skyListTitle').textContent = u.skyListTitle; $('skyListMeta').textContent = u.skyListMeta(v.length);
    $('skyList').innerHTML = v.length ? v.map(o=>{ const t=o[lang]||o.tr; return `
      <button class="stop ${o===target||o===picked?'sel':''}" data-sky="${o.id}">
        <span class="ic" style="background:${o.type==='star'?'rgba(120,150,220,.16)':'rgba(230,170,80,.18)'}">${o.type==='moon'?'☾':o.type==='sun'?'☀':o.type==='planet'?'◍':'✦'}</span>
        <span class="t"><b>${esc(t.ad)}</b><span>${esc(u.types[o.type])}${t.kisa?' · '+esc(t.kisa):''}</span></span>
        <span class="d">${esc(dirName(o.az))}<br>${Math.round(o.alt)}°</span>
      </button>`; }).join('') : `<div class="empty">${esc(u.skyNone)}</div>`;
    document.querySelectorAll('[data-sky]').forEach(b=>b.onclick=()=>{
      const o = objs.find(x=>x.id===b.dataset.sky); if(!o) return;
      picked = o; target = null; Voice.stop();
      if(!compass){ az0 = o.az; alt0 = Math.max(-5, Math.min(80, o.alt)); findTarget(); updateDir(); }
      renderCard(); renderList(); window.scrollTo({top:0, behavior:'smooth'});
    });
  }
  function drawMoon(){
    if(!window.Astronomy) return;
    const A = Astronomy, t = new Date(), u = T();
    const ang = A.MoonPhase(t), frac = A.Illumination('Moon', t).phase_fraction;
    const idx = Math.floor(((ang + 22.5) % 360) / 45);
    const full = A.SearchMoonPhase(180, t, 40), nw = A.SearchMoonPhase(0, t, 40);
    const days = d => Math.max(0, Math.round((d.date - t)/86400000));
    const nextTxt = ang < 180 ? u.nextFull(days(full)) : u.nextNew(days(nw));
    $('moonTitle').textContent = u.moonTitle;
    $('moon').innerHTML = `<canvas id="moonC" width="128" height="128" style="width:64px;height:64px"></canvas>
      <div><b>${esc(u.phases[idx])}</b><span>${esc(u.lit(Math.round(frac*100)))} · ${esc(nextTxt)}</span></div>`;
    const c = $('moonC').getContext('2d'), R = 56, cx = 64, cy = 64;
    c.fillStyle = '#2a2f3d'; c.beginPath(); c.arc(cx,cy,R,0,7); c.fill();
    // aydınlık yarım + terminatör elipsi
    const waxing = ang < 180, rx = Math.abs(Math.cos(ang*Math.PI/180))*R;
    c.fillStyle = '#f3efe3'; c.beginPath();
    if(waxing) c.arc(cx, cy, R, -Math.PI/2, Math.PI/2, false); else c.arc(cx, cy, R, Math.PI/2, 3*Math.PI/2, false);
    c.closePath(); c.fill();
    c.fillStyle = frac < 0.5 ? '#2a2f3d' : '#f3efe3';
    c.beginPath(); c.ellipse(cx, cy, rx+0.5, R, 0, 0, Math.PI*2); c.fill();
    drawSun(A, u);
  }
  /* Bugünün gün doğumu ve batımı (telefonda hesaplanır, internet gerekmez) */
  function drawSun(A, u){
    const el = $('sunRow'); if(!el) return;
    const ob = new A.Observer(loc.lat, loc.lng, 0), now = new Date();
    const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const rise = A.SearchRiseSet('Sun', ob, +1, d0, 1), set = A.SearchRiseSet('Sun', ob, -1, d0, 1);
    const inDay = x => x && x.date >= d0 && x.date < new Date(d0.getTime()+86400000);
    const hm = x => x.date.toLocaleTimeString(lang==='tr'?'tr-TR':'en-GB', {hour:'2-digit', minute:'2-digit'});
    if(!inDay(rise) || !inDay(set)){ el.innerHTML = `<span>${esc(!inDay(rise)?u.sunNoRise:u.sunNoSet)}</span>`; return; }
    const len = Math.round((set.date - rise.date)/60000), mm = ((len%60)+60)%60, hh = Math.floor(len/60);
    el.innerHTML = `<div class="sunt"><span>☀ ${esc(u.sunRise)}</span><b>${hm(rise)}</b></div>
      <div class="sunt"><span>☾ ${esc(u.sunSet)}</span><b>${hm(set)}</b></div>
      <div class="sunl">${esc(u.dayLen(hh, mm))}</div>`;
  }

  /* ---------- Bölüm ---------- */
  function render(){
    const u = T();
    $('skyEyebrow').textContent = u.skyEyebrow; $('skyTitle').textContent = u.skyTitle; $('skyIntro').textContent = u.skyIntro;
    $('skyStart').innerHTML = ICON.compass + esc(compass ? u.skyStarted : u.skyStart);
    $('skyStart').style.opacity = compass ? .55 : 1;
    const day = sun() && sun().alt > -6;
    $('skyHint').textContent = !hasLoc ? u.skyNeedLoc : (day ? (lang==='tr'?'Şu an gündüz; yıldızlar görünmez ama yerleri burada':"It's daytime; stars aren't visible but here's where they are") : (compass ? '' : u.skyHint));
    updateDir(); renderCard(); renderList(); drawMoon();
  }
  function setLocation(p){ loc = p; hasLoc = true; compute(); if(App.tab==='sky') render(); }

  return {
    init(){ bindDrag(); $('skyStart').onclick = startCompass; compute();
            const v = visible().filter(o=>o.type!=='sun'); if(v[0]){ az0 = v[0].az; alt0 = Math.max(10, Math.min(70, v[0].alt)); } },
    enter(){
      compute(); findTarget();
      if(!hasLoc && Gezi.pos) setLocation(Gezi.pos);
      if(!raf) loop();
      timer = setInterval(()=>{ compute(); renderList(); }, 30000);
    },
    leave(){ cancelAnimationFrame(raf); raf = null; clearInterval(timer); stopCompass(); compass = false; sm = {az:null, alt:null}; },
    render, setLocation,
    share(){
      const o = target || picked; if(!o) return;
      const u = T(), t = o[lang] || o.tr;
      const where = o.alt > 0 ? `${dirName(o.az)} · ${Math.round(o.alt)}° ${u.up}` : u.below;
      Share.go({text:u.shSky(t.ad), fileName:'gepgep-gokyuzu.png',
        cardOpts:{theme:'night', glow:o.color, eyebrow:u.cardSky, title:t.ad,
                  line:`${u.types[o.type]}${t.kisa?' · '+t.kisa:''} · ${where}`}});
    },
    play(id){ const o = objs.find(x=>'sky-'+x.id===id); if(o) Voice.toggle(id, (o[lang]||o.tr).metin, ()=>renderCard()); setTimeout(renderCard, 0); },
    langChanged(){}
  };
})();
App.register('sky', Sky);
