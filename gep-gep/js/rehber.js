/* Elle yazılmış ilçe/semt rehberleri — Fatih ve Zeytinburnu.
   Her durak: id, konum, Vikipedi madde adı (fotoğraf için), TR/EN ad-kısa-metin, gizli: az bilinen yer. */
(function(){
  const S = (id, lat, lng, wp, tr, en, gizli) => ({ id, lat, lng, wp, gizli:!!gizli,
    tr:{ad:tr[0], kisa:tr[1], metin:tr[2]}, en:{ad:en[0], kisa:en[1], metin:en[2]} });

  const semt = {
    'Sultanahmet': [
      S('ayasofya', 41.00860, 28.98020, 'Ayasofya',
        ['Ayasofya', 'Bin beş yüz yıllık kubbe',
         'Ayasofya, İmparator Justinianus döneminde 532 ile 537 yılları arasında yapıldı. Yaklaşık 31 metre çapındaki kubbesi, yüzyıllar boyunca dünyanın en büyük kapalı mekânlarından birini örttü. 1453\'te İstanbul\'un fethiyle camiye çevrildi, minareleri bu dönemde eklendi. 1934\'te müze oldu, 2020\'de yeniden cami olarak ibadete açıldı. İçeride Bizans mozaikleriyle Osmanlı hat levhaları aynı kubbenin altında yan yana durur.'],
        ['Hagia Sophia', 'A dome fifteen centuries old',
         'Hagia Sophia was built between 532 and 537 under Emperor Justinian. Its dome, about 31 metres across, covered one of the largest interior spaces in the world for centuries. After the conquest of 1453 it became a mosque and its minarets were added. It became a museum in 1934 and reopened as a mosque in 2020. Inside, Byzantine mosaics and Ottoman calligraphy panels share the same dome.']),
      S('sultanahmet', 41.00540, 28.97680, 'Sultanahmet Camii',
        ['Sultanahmet Camii', 'Altı minareli Mavi Cami',
         'Sultan I. Ahmed\'in yaptırdığı cami 1609\'da başladı ve 1617 civarında tamamlandı. Mimarı, Mimar Sinan\'ın öğrencisi Sedefkâr Mehmed Ağa\'dır. Altı minaresi o dönem için çok dikkat çekiciydi. İçini kaplayan yirmi binden fazla İznik çinisinin mavi tonları yüzünden yabancılar ona Mavi Cami der. Ayasofya\'nın tam karşısına kurulması, iki büyük kubbeyi aynı meydanda karşı karşıya getirdi.'],
        ['Blue Mosque', 'Six minarets and İznik blue',
         'Commissioned by Sultan Ahmed I, the mosque was begun in 1609 and finished around 1617. Its architect, Sedefkâr Mehmed Ağa, was a student of Mimar Sinan. Its six minarets were striking for the time. More than twenty thousand İznik tiles line the interior, and their blue tones gave it the name Blue Mosque. Facing Hagia Sophia, it set two great domes opposite each other across one square.']),
      S('hipodrom', 41.00590, 28.97520, 'Sultanahmet Meydanı',
        ['Hipodrom ve Dikilitaş', 'Bizans\'ın araba yarışı pisti',
         'Bugünkü Sultanahmet Meydanı, Bizans döneminde at arabası yarışlarının yapıldığı Hipodrom\'du. Ortadaki Dikilitaş, Mısır\'da Firavun III. Tutmosis için yapıldı ve 390 yılında İmparator I. Theodosius tarafından buraya diktirildi; yani üç bin beş yüz yıldan daha yaşlı. Yanındaki Yılanlı Sütun, Yunanların MÖ 479\'da Perslere karşı kazandığı zaferin anısına Delfi\'de yapılmıştı. Meydanın ucundaki sekizgen Alman Çeşmesi ise Kaiser II. Wilhelm\'in 1900\'lerin başında hediyesidir.'],
        ['Hippodrome and Obelisk', 'Byzantium\'s chariot track',
         'Today\'s Sultanahmet Square was the Hippodrome, where Byzantine chariot races were held. The obelisk in the middle was made in Egypt for Pharaoh Thutmose III and set up here in 390 by Emperor Theodosius I, so it is more than three and a half thousand years old. The Serpent Column beside it was made at Delphi to mark the Greek victory over the Persians in 479 BC. The octagonal German Fountain at the end of the square was a gift from Kaiser Wilhelm II in the early 1900s.']),
      S('yerebatan', 41.00840, 28.97790, 'Yerebatan Sarnıcı',
        ['Yerebatan Sarnıcı', 'Yerin altında sütun ormanı',
         'Yerebatan Sarnıcı, 532 yılında Justinianus döneminde şehre su depolamak için yapıldı. Tavanı 336 sütun taşır, bu yüzden içerisi yerin altında bir sütun ormanına benzer. Sütunların ikisinin altında kaide olarak kullanılmış Medusa başları vardır; biri yan, biri ters konmuştur. Neden böyle yerleştirildikleri bilinmez, bu da sarnıcın en çok konuşulan sırrıdır.'],
        ['Basilica Cistern', 'A forest of columns underground',
         'The Basilica Cistern was built in 532 under Justinian to store water for the city. Its roof rests on 336 columns, which makes it feel like an underground forest. Two columns stand on Medusa heads used as bases, one turned sideways and one upside down. Nobody knows why they were placed that way, and it remains the cistern\'s best-known mystery.']),
      S('topkapi', 41.00990, 28.98120, 'Topkapı Sarayı',
        ['Topkapı Sarayı', 'Dört yüz yıl devletin kalbi',
         'Fatih Sultan Mehmed\'in yaptırdığı saray 1478 civarında tamamlandı. Osmanlı padişahları yaklaşık dört yüz yıl burada yaşadı ve devleti buradan yönetti; Sultan Abdülmecid 1856\'da Dolmabahçe\'ye taşınana kadar. Saray tek bir büyük bina değil, avlular etrafına dizilmiş köşkler, mutfaklar ve dairelerden oluşur. 1924\'ten beri müzedir; Kutsal Emanetler ve Kaşıkçı Elması burada sergilenir. Ayasofya\'nın arkasındaki Bab-ı Hümayun kapısından girilir.'],
        ['Topkapı Palace', 'Four centuries at the heart of an empire',
         'Commissioned by Mehmed the Conqueror, the palace was completed around 1478. Ottoman sultans lived and ruled here for about four hundred years, until Sultan Abdülmecid moved to Dolmabahçe in 1856. It is not one building but kiosks, kitchens and apartments arranged around courtyards. It has been a museum since 1924 and holds the Sacred Relics and the Spoonmaker\'s Diamond. You enter through the Imperial Gate behind Hagia Sophia.']),
      S('kucukayasofya', 41.00270, 28.97440, 'Küçük Ayasofya Camii',
        ['Küçük Ayasofya Camii', 'Ayasofya\'nın ablası',
         'Kalabalıktan birkaç sokak aşağıda kalan bu yapı, Azizler Sergios ve Bakkhos Kilisesi olarak 527 ile 536 arasında yapıldı; yani Ayasofya\'dan birkaç yıl önce başlandı. Bu yüzden Ayasofya\'nın bir provası olarak da anılır. 1500\'lerin başında Hüseyin Ağa tarafından camiye çevrildi. Avlusu sakin, içerideki kubbe ise küçük ama zarif; turistlerin çoğu buraya kadar inmez.'],
        ['Little Hagia Sophia', 'Hagia Sophia\'s older sister',
         'A few streets below the crowds, this building was built between 527 and 536 as the Church of Saints Sergius and Bacchus, begun a few years before Hagia Sophia. That is why it is sometimes called a rehearsal for it. In the early 1500s Hüseyin Ağa turned it into a mosque. The courtyard is quiet and the dome small but elegant; most visitors never walk down this far.'], true),
      S('binbirdirek', 41.00780, 28.97450, 'Binbirdirek Sarnıcı',
        ['Binbirdirek Sarnıcı', 'Yerebatan\'ın sessiz komşusu',
         'Binbirdirek Sarnıcı, Bizans döneminde yapılmış ve 224 sütunla taşınan büyük bir su deposudur. Adı "bin bir direk" dese de sütun sayısı bu kadar değildir; isim büyüklüğünü anlatmak için verilmiştir. Yerebatan\'a birkaç yüz metre uzaklıktadır ama çok daha az bilinir. Osmanlı döneminde bir süre ipek ipliği büküm atölyesi olarak kullanıldığı anlatılır.'],
        ['Cistern of Philoxenos', 'The quiet neighbour of the Basilica Cistern',
         'The Binbirdirek Cistern is a large Byzantine water store held up by 224 columns. Its name means "a thousand and one columns", though there are not that many; the name speaks of its size. It is a few hundred metres from the Basilica Cistern but far less known. In Ottoman times it is said to have served for a while as a silk-thread workshop.'], true),
      S('sokollukadirga', 41.00380, 28.97130, 'Sokollu Mehmed Paşa Camii (Kadırga)',
        ['Sokollu Mehmed Paşa Camii', 'Mimar Sinan\'ın gizli mücevheri',
         'Kadırga\'daki bu küçük cami, Mimar Sinan\'ın 1570\'lerin başında Sadrazam Sokollu Mehmed Paşa için yaptığı bir eserdir. Yokuşa yaslanan avlusundan merdivenle çıkılır. İçerisi en güzel dönem İznik çinileriyle kaplıdır. Mihrabın, minberin ve kapının üstünde Kâbe\'deki Hacerülesved\'den getirildiği belirtilen küçük taş parçaları vardır. Sultanahmet\'e on dakika yürüme mesafesinde olmasına rağmen çoğu gezgin burayı bilmez.'],
        ['Sokollu Mehmed Pasha Mosque', 'Sinan\'s hidden jewel',
         'This small mosque in Kadırga was built by Mimar Sinan in the early 1570s for Grand Vizier Sokollu Mehmed Pasha. You climb to it by steps from a courtyard set into the slope. Inside it is covered in İznik tiles from their finest period. Above the mihrab, the pulpit and the door are small stone pieces said to come from the Black Stone of the Kaaba. Although it is a ten-minute walk from Sultanahmet, most travellers never find it.'], true)
    ],
    'Eminönü': [
      S('yenicami', 41.01710, 28.97140, 'Yeni Cami',
        ['Yeni Cami', 'Yapımı 68 yıl süren cami',
         'Yeni Cami\'nin yapımına 1597\'de Safiye Sultan döneminde başlandı, ama inşaat uzun yıllar durdu. Ancak 1665\'te Turhan Hatice Sultan tarafından tamamlanabildi; yani bitmesi altmış yılı aştı. Eminönü meydanına bakan basamakları, güvercinleri ve vapur iskelesiyle şehrin en tanıdık manzaralarından biridir.'],
        ['New Mosque', 'A mosque that took 68 years',
         'Work on the New Mosque began in 1597 under Safiye Sultan, but construction stopped for many years. It was only finished in 1665 by Turhan Hatice Sultan, more than sixty years later. With its steps, pigeons and ferry pier on Eminönü square, it is one of the city\'s most familiar views.']),
      S('misircarsisi', 41.01650, 28.97060, 'Mısır Çarşısı',
        ['Mısır Çarşısı', 'Baharat kokulu çarşı',
         'Mısır Çarşısı, Yeni Cami külliyesinin bir parçası olarak 1660\'larda yapıldı ve kiraları caminin giderlerine harcandı. Adının, Mısır\'dan gelen gelirle ya da mallarla ilgili olduğu anlatılır. Bugün baharat, lokum, kuruyemiş ve kahve dükkânlarıyla doludur. Çarşının yan sokakları, Tahtakale\'ye uzanan esnaf hayatını görmenin en iyi yoludur.'],
        ['Spice Bazaar', 'The market that smells of spice',
         'The Spice Bazaar was built in the 1660s as part of the New Mosque complex, and its rents paid for the mosque. Its Turkish name, Egyptian Bazaar, is said to come from income or goods from Egypt. Today it is full of spices, Turkish delight, nuts and coffee. Its side streets, running towards Tahtakale, are the best way to see the city\'s trading life.']),
      S('rustempasa', 41.01770, 28.96820, 'Rüstem Paşa Camii',
        ['Rüstem Paşa Camii', 'Dükkânların üstündeki çini sandığı',
         'Mimar Sinan\'ın 1560\'ların başında yaptığı bu cami, altındaki dükkânların üstüne yükseltilmiş bir platformda durur; sokaktan bakınca neredeyse görünmez. Merdivenlerle çıkınca içerisinin baştan sona İznik çinileriyle kaplı olduğu görülür. Caminin sahibi Rüstem Paşa, Kanuni\'nin sadrazamı ve kızı Mihrimah Sultan\'ın eşiydi. Mısır Çarşısı\'nın kalabalığına iki dakika mesafede sessiz bir dünyadır.'],
        ['Rüstem Pasha Mosque', 'A tiled jewel box above the shops',
         'Built by Mimar Sinan in the early 1560s, this mosque stands on a raised platform above shops and is almost invisible from the street. Climb the stairs and the interior turns out to be covered in İznik tiles. Rüstem Pasha was Suleiman the Magnificent\'s grand vizier and husband of his daughter Mihrimah. It is a quiet world two minutes from the crowds of the Spice Bazaar.'], true),
      S('sirkeci', 41.01500, 28.97690, 'Sirkeci Garı',
        ['Sirkeci Garı', 'Orient Ekspresi\'nin son durağı',
         'Sirkeci Garı 1890\'da açıldı ve Alman mimar August Jasmund tarafından tasarlandı. Paris\'ten kalkan ünlü Orient Ekspresi\'nin son durağıydı, Avrupa\'dan gelen yolcular İstanbul\'a burada adım atardı. Renkli cam pencereleri ve saat kulesiyle hâlâ o dönemin havasını taşır.'],
        ['Sirkeci Station', 'Last stop of the Orient Express',
         'Sirkeci Station opened in 1890 and was designed by the German architect August Jasmund. It was the last stop of the famous Orient Express from Paris, where travellers from Europe first set foot in Istanbul. Its stained-glass windows and clock tower still carry the feel of that era.'])
    ],
    'Süleymaniye': [
      S('suleymaniye', 41.01610, 28.96400, 'Süleymaniye Camii',
        ['Süleymaniye Camii', 'Sinan\'ın kalfalık eseri',
         'Süleymaniye, Kanuni Sultan Süleyman için Mimar Sinan tarafından 1550 ile 1557 arasında yapıldı. Sinan, eserlerini anlatırken Şehzade\'yi çıraklık, Süleymaniye\'yi kalfalık, Edirne\'deki Selimiye\'yi ustalık eseri saymıştır. Cami tek başına değil; medreseler, hamam, aşevi ve hastaneyle birlikte bir külliyedir. Bahçesindeki türbelerde Kanuni ve Hürrem Sultan yatar. Arka avludan Haliç\'e ve Galata\'ya bakan manzara şehrin en güzellerindendir.'],
        ['Süleymaniye Mosque', 'Sinan\'s journeyman work',
         'Süleymaniye was built by Mimar Sinan for Suleiman the Magnificent between 1550 and 1557. Sinan called the Şehzade Mosque his apprentice work, Süleymaniye his journeyman work and the Selimiye in Edirne his masterpiece. The mosque is the centre of a complex with schools, a bath, a soup kitchen and a hospital. Suleiman and Hürrem Sultan lie in the tombs in its garden. The view from the back courtyard over the Golden Horn to Galata is one of the best in the city.']),
      S('sinanturbe', 41.01760, 28.96500, 'Mimar Sinan Türbesi',
        ['Mimar Sinan Türbesi', 'Dev eserlerin ustasının mütevazı mezarı',
         'Yüzlerce yapı tasarlayan Mimar Sinan, 1588\'de öldüğünde Süleymaniye külliyesinin köşesinde, kendi çizdiği küçük ve sade bir türbeye gömüldü. Türbe, caminin dev kubbesine birkaç adım uzaklıktadır ama önünden geçenlerin çoğu fark etmez. Bu sadelik, ustanın kendi eseriyle arasına koyduğu mesafe gibi okunur.'],
        ['Tomb of Mimar Sinan', 'A modest grave for the master builder',
         'Mimar Sinan, who designed hundreds of buildings, died in 1588 and was buried at the corner of the Süleymaniye complex in a small, plain tomb he drew himself. It is a few steps from the mosque\'s great dome, yet most people pass it without noticing. Its simplicity reads like the distance the master kept between himself and his work.'], true),
      S('bozdogan', 41.01530, 28.95560, 'Bozdoğan Kemeri',
        ['Bozdoğan Kemeri', 'Şehrin üstünden geçen Roma su yolu',
         'Bozdoğan Kemeri, Roma İmparatoru Valens döneminde 378 yılı civarında tamamlanan bir su kemeridir. Şehrin tepeleri arasındaki vadiyi aşarak suyu yüzyıllarca merkeze taşıdı ve Osmanlı döneminde de onarılıp kullanıldı. Bugün yaklaşık 900 metresi ayaktadır ve Atatürk Bulvarı\'ndaki araçlar hâlâ kemerlerinin altından geçer.'],
        ['Aqueduct of Valens', 'A Roman water line over the city',
         'The Aqueduct of Valens was completed around 378 under the Roman Emperor Valens. It carried water across the valley between the city\'s hills for centuries and was repaired and used by the Ottomans too. About 900 metres still stand today, and traffic on Atatürk Boulevard still runs beneath its arches.'])
    ],
    'Fener': [
      S('patrikhane', 41.02920, 28.95180, 'Fener Rum Patrikhanesi',
        ['Fener Rum Patrikhanesi', 'Kapısı iki yüz yıldır kapalı',
         'Ortodoks dünyasının önemli merkezlerinden Rum Patrikhanesi, 1600\'lerin başından beri Fener\'de, Aya Yorgi Kilisesi\'nin yanında bulunur. Avlunun orta kapısı 1821\'den beri kapalıdır; o yıl Patrik V. Gregorios bu kapıda idam edilmiş ve kapı onun anısına bir daha açılmamıştır. Ziyaretçiler yan kapıdan girer.'],
        ['Ecumenical Patriarchate', 'A gate shut for two centuries',
         'The Ecumenical Patriarchate, a major centre of the Orthodox world, has been in Fener beside the Church of St George since the early 1600s. The middle gate of its courtyard has been closed since 1821, when Patriarch Gregory V was hanged there; it has never been reopened in his memory. Visitors enter by a side gate.']),
      S('kirmizimektep', 41.02910, 28.95000, 'Özel Fener Rum Lisesi',
        ['Fener Rum Lisesi', 'Kırmızı Mektep',
         'Haliç\'e tepeden bakan bu kırmızı tuğla bina, 1880\'lerin başında mimar Konstantinos Dimadis tarafından yapıldı. Halk arasında Kırmızı Mektep diye bilinir. Okulun kökeni çok daha eskiye, fetihten hemen sonraki yıllara uzanır. Kale gibi görünen siluetini en iyi Fener sahilinden ya da Balat sokaklarından görebilirsin.'],
        ['Phanar Greek Orthodox College', 'The Red School',
         'This red-brick building looking down on the Golden Horn was built in the early 1880s by the architect Konstantinos Dimadis. Locals call it the Red School. The school itself goes back much further, to the years right after the conquest. Its castle-like outline is best seen from the Fener shore or the streets of Balat.'])
    ],
    'Balat': [
      S('svetistefan', 41.03000, 28.94890, 'Sveti Stefan Kilisesi',
        ['Sveti Stefan Bulgar Kilisesi', 'Demirden yapılmış kilise',
         'Haliç kıyısındaki bu kilise neredeyse tamamen dökme demirden yapılmıştır. Parçaları Viyana\'da üretildi, Tuna ve Karadeniz üzerinden gemilerle getirildi ve burada birleştirildi; kilise 1898\'de açıldı. Uzaktan taş bir yapı gibi görünür, ama duvarına dokununca metal olduğu anlaşılır.'],
        ['St Stephen\'s Bulgarian Church', 'A church made of iron',
         'This church on the Golden Horn is made almost entirely of cast iron. Its parts were made in Vienna, shipped down the Danube and across the Black Sea, and assembled here; it opened in 1898. From a distance it looks like stone, but touch the wall and you feel metal.']),
      S('ahrida', 41.03310, 28.94700, 'Ahrida Sinagogu',
        ['Ahrida Sinagogu', 'Gemi biçimli kürsü',
         'Ahrida Sinagogu, adını Makedonya\'daki Ohri\'den gelen Yahudilerden alır ve 1400\'lere uzanan İstanbul\'un en eski sinagoglarındandır. İçindeki kürsü bir gemi pruvası biçimindedir; bunun Nuh\'un Gemisi\'ni ya da 1492\'de İspanya\'dan kaçan Yahudileri getiren Osmanlı gemilerini simgelediği anlatılır. Ziyaret önceden izinle yapılır.'],
        ['Ahrida Synagogue', 'A pulpit shaped like a ship',
         'The Ahrida Synagogue takes its name from Jews who came from Ohrid in Macedonia and is one of Istanbul\'s oldest, going back to the 1400s. Its pulpit is shaped like the prow of a ship, said to stand for Noah\'s Ark or the Ottoman ships that brought Jews fleeing Spain in 1492. Visits need permission in advance.'], true),
      S('balatevler', 41.03060, 28.94650, 'Balat',
        ['Balat\'ın renkli evleri', 'Yokuşlarda renkli cepheler',
         'Balat, yüzyıllar boyunca Rum, Yahudi, Ermeni ve Müslüman ailelerin bir arada yaşadığı bir mahalleydi. Dik yokuşları, cumbalı ve rengârenk boyanmış evleri onu bugün fotoğrafçıların en sevdiği semtlerden biri yaptı. Sokaklarda eski kahvehaneler, antikacılar ve küçük fırınlar arasında dolaşırken yaşayan bir mahallede olduğunu unutmamak gerekir; insanlar burada hâlâ oturuyor.'],
        ['Colourful houses of Balat', 'Painted façades on steep streets',
         'For centuries Balat was a neighbourhood where Greek, Jewish, Armenian and Muslim families lived side by side. Its steep streets and brightly painted houses with bay windows have made it a favourite with photographers. Wandering among old coffee houses, antique shops and small bakeries, remember it is a living neighbourhood; people still live here.']),
      S('ferruhkethuda', 41.03400, 28.94520, 'Ferruh Kethüda Camii',
        ['Ferruh Kethüda Camii', 'Balat\'ta bir Sinan eseri',
         'Balat\'ın arka sokaklarındaki bu küçük cami, 1560\'larda Mimar Sinan tarafından yapıldı. Sadrazam Sokollu Mehmed Paşa\'nın kâhyası Ferruh Ağa için inşa edildi. Balat\'a gelenlerin çoğu renkli evlere odaklandığı için burası sessiz kalır; mahallenin Osmanlı yüzünü görmek için iyi bir duraktır.'],
        ['Ferruh Kethüda Mosque', 'A Sinan work in Balat',
         'This small mosque in Balat\'s back streets was built by Mimar Sinan in the 1560s for Ferruh Ağa, steward of Grand Vizier Sokollu Mehmed Pasha. Most visitors to Balat focus on the coloured houses, so it stays quiet; it is a good stop to see the neighbourhood\'s Ottoman side.'], true)
    ],
    'Edirnekapı': [
      S('kariye', 41.03110, 28.93890, 'Kariye Camii',
        ['Kariye Camii', 'Dünyanın en güzel Bizans mozaikleri',
         'Kariye, Bizans döneminde Khora Manastırı\'nın kilisesiydi. 1300\'lerin başında devlet adamı Theodoros Metokhites onu yeniden yaptırdı ve duvarlarını bugün dünyanın en güzel Bizans mozaik ve fresklerinden sayılan resimlerle süsletti. 1500\'lerin başında camiye çevrildi, 1940\'larda müze oldu, 2024\'te yeniden cami olarak açıldı.'],
        ['Kariye Mosque (Chora)', 'Some of the finest Byzantine mosaics',
         'Kariye was the church of the Chora Monastery in Byzantine times. In the early 1300s the statesman Theodore Metochites rebuilt it and decorated its walls with what are now counted among the finest Byzantine mosaics and frescoes in the world. It became a mosque in the early 1500s, a museum in the 1940s, and reopened as a mosque in 2024.']),
      S('mihrimah', 41.02950, 28.93550, 'Mihrimah Sultan Camii (Edirnekapı)',
        ['Mihrimah Sultan Camii', 'Işıkla dolu cami',
         'Mimar Sinan bu camiyi 1560\'larda Kanuni\'nin kızı Mihrimah Sultan için şehrin en yüksek tepelerinden birine yaptı. Duvarları neredeyse tamamen pencereyle doludur ve içerisi gün boyu ışıkla dolar. Uzaktan bakıldığında surların hemen içinde yükselen kubbesi şehrin siluetinde kolayca seçilir.'],
        ['Mihrimah Sultan Mosque', 'A mosque full of light',
         'Mimar Sinan built this mosque in the 1560s for Mihrimah Sultan, daughter of Suleiman the Magnificent, on one of the highest hills in the city. Its walls are almost all windows, so the inside fills with light all day. From afar its dome, rising just inside the walls, stands out on the skyline.']),
      S('surlar', 41.03000, 28.93380, 'İstanbul surları',
        ['Kara surları ve Edirnekapı', 'Fethin yaşandığı surlar',
         'Kara surları 413 yılında II. Theodosius döneminde yapıldı ve şehri bin yıl boyunca karadan gelen saldırılara karşı korudu. 6 Nisan 1453\'te başlayan kuşatma 53 gün sürdü ve 29 Mayıs\'ta Osmanlı ordusu bu surları aştı. Fatih Sultan Mehmed\'in şehre Edirnekapı\'dan girdiği anlatılır; kapının üstündeki kitabe bunu anar. Surların üstünden şehrin iki yanına bakan manzara etkileyicidir.'],
        ['Land Walls and Edirnekapı', 'The walls of the conquest',
         'The land walls were built in 413 under Theodosius II and protected the city from attacks by land for a thousand years. The siege that began on 6 April 1453 lasted 53 days, and on 29 May the Ottoman army broke through these walls. Mehmed the Conqueror is said to have entered the city through Edirnekapı; a plaque above the gate recalls it. The view from the walls over both sides of the city is striking.']),
      S('tekfur', 41.03400, 28.94060, 'Tekfur Sarayı',
        ['Tekfur Sarayı', 'Bizans sarayından çini atölyesine',
         'Tekfur Sarayı, 1200\'lerin sonunda yapılmış bir Bizans saray yapısıdır ve şehirde ayakta kalan nadir Bizans saraylarındandır. Osmanlı döneminde, 1700\'lerin başında burada çini atölyeleri kuruldu ve Tekfur Sarayı çinileri diye bilinen bir üretim yapıldı. Uzun yıllar harabe kalan yapı onarılıp müze olarak açıldı. Kariye\'ye beş dakika yürüme mesafesindedir ama az kişi uğrar.'],
        ['Palace of the Porphyrogenitus', 'From Byzantine palace to tile workshop',
         'Tekfur Palace is a Byzantine palace built in the late 1200s, one of the few still standing in the city. In the early 1700s Ottoman tile workshops were set up here, producing what are known as Tekfur Palace tiles. After long years as a ruin it was restored and opened as a museum. It is a five-minute walk from Kariye, yet few people stop by.'], true)
    ],
    'Yedikule': [
      S('yedikule', 40.99350, 28.92290, 'Yedikule Hisarı',
        ['Yedikule Hisarı', 'Hazine, zindan, hisar',
         'Fatih Sultan Mehmed 1458\'de surların Altınkapı bölümüne yeni kuleler ekleyerek bu yedi kuleli hisarı kurdu. Bir dönem devletin hazinesi burada saklandı, sonra zindan olarak kullanıldı. 1622\'de genç padişah II. Osman bu hisarda öldürüldü. Kulelerin üstünden Marmara\'ya ve surların uzanışına bakan manzara çok etkileyicidir.'],
        ['Yedikule Fortress', 'Treasury, dungeon, fortress',
         'In 1458 Mehmed the Conqueror built this seven-towered fortress by adding new towers to the Golden Gate section of the walls. For a time the state treasury was kept here; later it served as a prison. In 1622 the young Sultan Osman II was killed in this fortress. The view from the towers over the Sea of Marmara and along the walls is stunning.']),
      S('bostanlar', 40.99900, 28.92400, 'Yedikule Bostanları',
        ['Yedikule Bostanları', 'Surların dibinde yüzyıllık bahçeler',
         'Surların iç ve dış tarafında yüzyıllardır sebze yetiştirilen bostanlar bulunur. Bu bahçeler Bizans döneminden beri şehri besleyen bir geleneğin parçasıdır ve İstanbul\'un ortasında hâlâ marul, maydanoz yetiştirilen ender yerlerdendir. Surların gölgesinde yürürken bu sessiz yeşil şeridi görmek, şehrin pek bilinmeyen bir yüzünü gösterir.'],
        ['Yedikule Market Gardens', 'Centuries-old gardens under the walls',
         'Along both sides of the walls are market gardens where vegetables have been grown for centuries. They are part of a tradition of feeding the city that goes back to Byzantine times, and are one of the rare places in central Istanbul where lettuce and parsley are still grown. Walking in the shadow of the walls past this quiet green strip shows a little-known side of the city.'], true)
    ],
    'Topkapı': [
      S('panorama', 41.01200, 28.91800, 'Panorama 1453 Tarih Müzesi',
        ['Panorama 1453 Tarih Müzesi', 'Fethin ortasında durmak',
         'Topkapı Kültür Parkı\'ndaki bu müze 2009\'da açıldı. Kubbenin altında dört bir yanı saran dev bir resim, 29 Mayıs 1453 sabahını kuşatmanın tam ortasındaymışsın gibi gösterir. Müze, surlara ve fethin en çetin geçtiği Topkapı bölgesine çok yakındır; gezmeden önce burayı görmek surları başka gözle görmeni sağlar.'],
        ['Panorama 1453 History Museum', 'Standing in the middle of the conquest',
         'This museum in Topkapı Culture Park opened in 2009. Under its dome a huge painting wraps all around you and shows the morning of 29 May 1453 as if you were standing in the middle of the siege. It is very close to the walls and to Topkapı, where the hardest fighting took place; seeing it first changes how you see the walls.'])
    ],
    'Merkezefendi': [
      S('merkezefendi', 41.00450, 28.91700, 'Merkez Efendi Camii',
        ['Merkez Efendi Camii ve Türbesi', 'Mesir macununun ustası',
         'Merkez Efendi, 1500\'lerde yaşamış bir âlim ve hekimdir; 1552\'de öldü. Manisa\'da Hafsa Sultan\'ı iyileştirmek için kırk bir baharattan hazırladığı karışımın, bugün hâlâ dağıtılan mesir macununun başlangıcı olduğu anlatılır. Surların dışındaki camisi ve türbesi, semte de adını vermiştir.'],
        ['Merkez Efendi Mosque and Tomb', 'The master of mesir paste',
         'Merkez Efendi was a scholar and healer of the 1500s who died in 1552. The mixture of forty-one spices he made in Manisa to heal Hafsa Sultan is said to be the origin of mesir paste, still handed out today. His mosque and tomb outside the walls also gave the neighbourhood its name.'], true),
      S('balikli', 40.99960, 28.91650, 'Balıklı Rum Kilisesi',
        ['Balıklı Rum Kilisesi', 'Tavadan zıplayan balıklar',
         'Surların hemen dışındaki bu kilise, Bizans döneminden beri kutsal sayılan bir ayazmanın, yani şifalı su kaynağının üzerindedir. Efsaneye göre 1453\'te bir keşiş balık kızartırken şehrin alındığını duydu, "Bu balıklar dirilse inanırım" dedi ve balıklar tavadan suya atladı. Ayazmadaki balıklar bu yüzden kutsal sayılır; semt de adını bu hikâyeden alır.'],
        ['Church of Balıklı', 'Fish that leapt from the pan',
         'Just outside the walls, this church stands over a holy spring revered since Byzantine times. Legend says that in 1453 a monk frying fish heard the city had fallen and said he would believe it only if the fish came back to life, and they leapt from the pan into the water. That is why the fish in the spring are considered sacred, and the neighbourhood takes its name, "with fish", from the story.'], true)
    ]
  };

  const ilce = {
    'Fatih': ['Sultanahmet','Eminönü','Süleymaniye','Fener','Balat','Edirnekapı','Yedikule'],
    'Zeytinburnu': ['Topkapı','Merkezefendi']
  };

  /* İlçe ve semt tanıtım yazıları */
  const yazi = {
    'Fatih': {
      tr:'Fatih, surlarla çevrili tarihî yarımadanın tamamını kapsar ve adını 1453\'te şehri alan Fatih Sultan Mehmed\'den alır. Burası iki imparatorluğun başkentiydi: önce bin yıl boyunca Bizans\'ın, sonra yaklaşık beş yüz yıl Osmanlı\'nın. 6 Nisan 1453\'te başlayan kuşatma 53 gün sürdü; 29 Mayıs sabahı Osmanlı ordusu kara surlarını aştı. Bugün aynı ilçede Roma sarnıçları, Bizans kiliseleri, Sinan camileri, Rum, Yahudi ve Bulgar mahalleleri birkaç sokak arayla yan yana durur. Aşağıdaki semtlere dokunarak hepsini sırayla gezebilirsin; yıldızlı olanlar kalabalığın pek uğramadığı yerlerdir.',
      en:'Fatih covers the whole walled historic peninsula and takes its name from Mehmed the Conqueror, who took the city in 1453. It was the capital of two empires: Byzantium for a thousand years, then the Ottomans for about five hundred. The siege began on 6 April 1453 and lasted 53 days; on the morning of 29 May the Ottoman army broke through the land walls. Today Roman cisterns, Byzantine churches, Sinan\'s mosques and Greek, Jewish and Bulgarian quarters sit a few streets apart in the same district. Tap the areas below to explore them one by one; starred places are ones the crowds rarely reach.' },
    'Sultanahmet': { tr:'Sultanahmet, Bizans\'ın da Osmanlı\'nın da kalbiydi. Ayasofya, Sultanahmet Camii, Topkapı Sarayı ve Hipodrom birkaç yüz metre içindedir. Kalabalıktan birkaç sokak aşağı inince Küçük Ayasofya ve Sokollu gibi sessiz hazineler başlar.',
                     en:'Sultanahmet was the heart of both Byzantium and the Ottoman Empire. Hagia Sophia, the Blue Mosque, Topkapı Palace and the Hippodrome lie within a few hundred metres. A few streets down from the crowds, quiet treasures such as Little Hagia Sophia and Sokollu begin.' },
    'Eminönü': { tr:'Eminönü, şehrin yüzyıllardır en işlek limanı ve çarşısıdır. Vapurlar, Yeni Cami, Mısır Çarşısı ve Tahtakale\'nin esnaf sokakları burada iç içedir.',
                 en:'Eminönü has been the city\'s busiest port and market for centuries. Ferries, the New Mosque, the Spice Bazaar and the trading streets of Tahtakale are all tangled together here.' },
    'Süleymaniye': { tr:'Süleymaniye, Haliç\'e bakan tepede Mimar Sinan\'ın en büyük eserlerinden birinin çevresinde kurulmuş bir semttir. Ahşap evleri, medreseleri ve Bozdoğan Kemeri\'yle yarımadanın en sakin köşelerindendir.',
                     en:'Süleymaniye grew around one of Mimar Sinan\'s greatest works, on the hill above the Golden Horn. With its wooden houses, schools and the Aqueduct of Valens, it is one of the calmest corners of the peninsula.' },
    'Fener': { tr:'Fener, yüzyıllar boyunca İstanbul Rumlarının merkeziydi. Patrikhane ve Kırmızı Mektep diye bilinen Fener Rum Lisesi hâlâ semtin simgeleridir.',
               en:'Fener was the centre of Istanbul\'s Greek community for centuries. The Patriarchate and the Phanar College, known as the Red School, are still its landmarks.' },
    'Balat': { tr:'Balat, Rum, Yahudi, Ermeni ve Müslümanların yan yana yaşadığı eski bir Haliç mahallesidir. Renkli evleri, sinagogu ve demirden kilisesiyle şehrin en çok fotoğraflanan semtlerinden biridir.',
               en:'Balat is an old Golden Horn neighbourhood where Greeks, Jews, Armenians and Muslims lived side by side. With its coloured houses, synagogue and iron church it is one of the most photographed parts of the city.' },
    'Edirnekapı': { tr:'Edirnekapı, kara surlarının ortasındaki tarihî kapının çevresidir. 1453 fethinin yaşandığı surlar, Kariye\'nin mozaikleri ve Mihrimah Sultan Camii burada birbirine birkaç dakika uzaklıktadır.',
                    en:'Edirnekapı surrounds the historic gate in the middle of the land walls. The walls of the 1453 conquest, the mosaics of Kariye and the Mihrimah Sultan Mosque are a few minutes apart here.' },
    'Yedikule': { tr:'Yedikule, kara surlarının Marmara\'ya indiği uçtadır. Fatih\'in yaptırdığı yedi kuleli hisar ve surların dibindeki yüzyıllık bostanlar semte adını ve havasını verir.',
                  en:'Yedikule lies where the land walls meet the Sea of Marmara. The seven-towered fortress built by the Conqueror and the centuries-old gardens under the walls give the area its name and character.' },
    'Zeytinburnu': {
      tr:'Zeytinburnu, kara surlarının hemen dışında kalır. 1453 kuşatmasında Osmanlı ordusu bu topraklarda konakladı; Fatih Sultan Mehmed\'in otağının bugünkü Topkapı ve Maltepe çevresinde kurulduğu anlatılır. Ordu en ağır saldırıyı da buradan, surların Topkapı kesimine yaptı. Bugün Panorama 1453 müzesi o sabahı canlandırır; surların dışındaki Merkez Efendi ve Balıklı ise yüzyıllık efsaneleriyle bilinir.',
      en:'Zeytinburnu lies just outside the land walls. During the siege of 1453 the Ottoman army camped on this land; Mehmed the Conqueror\'s tent is said to have stood around today\'s Topkapı and Maltepe. The heaviest assault was also launched from here against the Topkapı section of the walls. Today the Panorama 1453 museum brings that morning to life, while Merkez Efendi and Balıklı outside the walls are known for their centuries-old legends.' },
    'Topkapı': { tr:'Topkapı, surların fetihte en çetin savaşın yaşandığı kesimidir. Panorama 1453 müzesi bu bölgededir.', en:'Topkapı is the section of the walls where the hardest fighting of the conquest took place. The Panorama 1453 museum is here.' },
    'Merkezefendi': { tr:'Merkezefendi, adını mesir macunu geleneğini başlattığı anlatılan Merkez Efendi\'den alır. Balıklı Rum Kilisesi\'nin efsanevi ayazması da bu çevrededir.', en:'Merkezefendi takes its name from Merkez Efendi, said to have started the mesir paste tradition. The legendary holy spring of the Balıklı church is nearby too.' }
  };

  function stopsFor(name){
    if(ilce[name]) return [].concat(...ilce[name].map(s=>semt[s]||[]));
    return semt[name] || null;
  }
  window.REHBER = { semt, ilce, yazi, stopsFor };
})();
