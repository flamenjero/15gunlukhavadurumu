-- Profesyonel tavsiye motoru seed veri seti
-- Supabase SQL Editor'da schema.sql sonrası çalıştırın.

DELETE FROM agricultural_tips;

INSERT INTO agricultural_tips (category, title, content, conditions, priority) VALUES

-- ==========================================
-- 1. ARICILIK SENARYOLARI (APIVICE ODAKLI)
-- ==========================================

(
  'aricilik',
  'Destek Koloni ve Kadro Eşitleme (Bahar Uyandırması)',
  'Sıcaklıklar kovan açmak için güvenli sınıra ulaştı. Prof. Dr. Muhsin Doğaroğlu destek koloni sistemini uygulamak için ideal dönemdesiniz. Zayıf kolonilerden kapalı yavru çekerek ana üretim kovanlarınızı bal akımına dev kadrolarla hazırlayın.',
  '{"min_temp": 14, "max_temp": 22, "season": ["spring"]}'::jsonb,
  80
),
(
  'aricilik',
  'Ana Nektar Akımı ve Prolin Kalitesi',
  'İdeal nektar akımı sıcaklıklarındayız. Yüksek prolin değerine sahip, standarda uygun bal hasadı için kovanlara dışarıdan şurup takviyesini tamamen kesin. Arılara sadece temel veya kabarmış petek vererek balözü toplamaya teşvik edin.',
  '{"min_temp": 22, "max_temp": 30, "season": ["spring", "summer"]}'::jsonb,
  90
),
(
  'aricilik',
  'Varroa Mücadelesi İçin Kritik Sıcaklık Penceresi',
  'Hava şartları, Varroa mücadelesinde formik veya oksalik asit gibi organik asit uygulamaları için optimum sıcaklık aralığında (15-25°C). Etkili buharlaşma sağlamak ve arı kayıplarını önlemek için ilaçlamayı akşamüzeri yapın.',
  '{"min_temp": 15, "max_temp": 25, "season": ["late_summer", "autumn"]}'::jsonb,
  85
),
(
  'aricilik',
  'Kış Salkımı İhlali Riski',
  'Hava sıcaklığı salkım formasyonu için kritik seviyelerde. Kovan kapaklarını kesinlikle açmayın. Kovan içi nemi atmak için üst havalandırma deliklerinin tıkalı olmadığından emin olun ve uçuş deliklerini daraltın.',
  '{"max_temp": 10, "season": ["winter"]}'::jsonb,
  100
),
(
  'aricilik',
  'Aşırı Sıcaklık Stresi ve Su İhtiyacı',
  'Sıcaklıklar arıların nektar uçuşunu kesip kovan soğutmaya odaklanacağı seviyelerde (34°C üstü). Kovan önü su pınarlarının dolu ve gölgede olduğundan emin olun. Kovan kapaklarına güneş yansıtıcı veya gölgelik eklemeyi değerlendirin.',
  '{"min_temp": 34}'::jsonb,
  95
),
(
  'aricilik',
  'Şiddetli Rüzgar ve Uçuş Kayıpları',
  'Rüzgar hızı tarlacı arıların uçuşunu engelleyecek veya kovan önü sapmalarına yol açacak şiddette. Kovan kapaklarındaki ağırlıkları kontrol edin, arıları bugün için strese sokacak müdahalelerden kaçının.',
  '{"min_wind_speed": 35}'::jsonb,
  90
),
(
  'aricilik',
  'Yüksek Rakımda Geç Flora Uyanışı',
  'Yüksek rakımlı bölgelerde gece gündüz sıcaklık farkları hala yüksek. Yayla nektar akımına henüz vakit varken, ana arıyı yumurtlamaya teşvik etmek için invert şurupla 1:1 oranında beslemeye devam edin.',
  '{"min_temp": 12, "max_temp": 25, "min_elevation": 1200, "season": ["spring", "early_summer"]}'::jsonb,
  70
),

-- ==========================================
-- 2. TARIM VE BAHÇECİLİK SENARYOLARI
-- ==========================================

(
  'tarim',
  'Kritik Zirai Don Alarmı!',
  'Sıcaklıklar donma noktasının altına düşüyor. Açık alandaki hassas bitkilerinizi agro-tekstil ile örtün. Meyve bahçelerinde aktif rüzgar pervanelerini veya kontrollü dumanlama sistemlerini devreye alın.',
  '{"max_temp": 2}'::jsonb,
  100
),
(
  'tarim',
  'Yumrulu Bitki ve Kışlık Sebze Ekimi (Ay Takvimi)',
  'Ay küçülme evresinde (Son Dördün/Yeni Ay). Bitki özsuyu köklere yöneldiği için salep yumrusu, soğan, sarımsak, ıspanak gibi toprak altı gelişim gösteren bitkilerin ekimi için en verimli günlerdeyiz.',
  '{"moon_phase": ["waning_crescent", "last_quarter", "new_moon"], "max_temp": 25}'::jsonb,
  70
),
(
  'tarim',
  'Kardeş Bitki (Companion Planting) Planlama Zamanı',
  'Toprak ısınmaya başladı. Parsel yerleşimlerinizde mısır, tırmanıcı fasulye, biber ve domates gibi birbirini destekleyen kardeş bitki kombinasyonlarını uygulamak için ekim yataklarını hazırlayın.',
  '{"min_temp": 15, "max_temp": 26, "season": ["spring"]}'::jsonb,
  65
),
(
  'tarim',
  'Mantar ve Mildiyö Riski (Yüksek Nem)',
  'Hava sıcaklığı ve nem oranının birleşimi mantari hastalıklar (Örn: Mildiyö, Külleme) için kusursuz bir inkübasyon ortamı yaratıyor. Seralarda havalandırmayı artırın ve önleyici bakır sülfat uygulamalarını değerlendirin.',
  '{"min_temp": 18, "max_temp": 28, "min_humidity": 75}'::jsonb,
  85
),
(
  'tarim',
  'Toprak Üstü Hasat ve Meyve Budaması (Ay Takvimi)',
  'Ay büyüme evresinde (İlk Dördün/Dolunay). Bitki özsuyu dallara ve meyvelere yürüdüğü için, toprak üstü mahsullerin hasadı ve aşılama işlemleri için mükemmel zaman. Derin budamalardan kaçının.',
  '{"moon_phase": ["waxing_crescent", "first_quarter", "full_moon"]}'::jsonb,
  70
),
(
  'tarim',
  'Yüksek Rakımlı Bölgelerde Fide Şaşırtma Uyarısı',
  'Bulunduğunuz rakımda gece donları riski tam olarak geçmiş değil. Seralarda çimlendirdiğiniz domates, biber, kavun gibi hassas fideleri açık alana şaşırtmak için acele etmeyin, en az iki hafta daha bekleyin.',
  '{"max_temp": 15, "min_elevation": 1000, "season": ["spring"]}'::jsonb,
  90
),
(
  'tarim',
  'Aşırı Buharlaşma ve Termal Şok Önlemi',
  'Günlük sıcaklıklar bitkilerde termal şok yaratacak seviyede. Yapraklarda güneş yanığını önlemek için üstten yağmurlama ve gübreleme yapmayın. Sulamayı sadece sabahın çok erken saatlerinde damlama yöntemiyle gerçekleştirin.',
  '{"min_temp": 35}'::jsonb,
  95
);
