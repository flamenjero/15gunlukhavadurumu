import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { absoluteUrl } from "@/lib/site";

const title = "Tatil haftası nasıl seçilir";
const description =
  "Önce ay takviminden ayı, sonra gezi planından günleri seçin. 15 günün içine girince güncel tahmine bakın.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tatil-haftasi-nasil-secilir" },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/tatil-haftasi-nasil-secilir"),
    locale: "tr_TR",
  },
};

export default function TripGuidePage() {
  return (
    <InfoPage title={title} description={description}>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Önce ayı eleyin</h2>
        <p>
          Gidilecek yer belli, hafta belli değilse{" "}
          <Link href="/ay-takvimi" className="font-medium text-sky-700 hover:text-sky-800">
            ay takviminden
          </Link>{" "}
          başlayın. On iki kart, 2016–2025 yıllarının o aydaki gündüzünü,
          gecesini ve yağışlı gün oranını gösterir. Yağış çizgisi uzadıkça o ay
          daha sık ıslanmıştır. Antalya’da temmuz çizgisi kısalır; Rize’de
          sonbahar çizgisi uzar. Bu, “o hafta güneşli olur” sözü değildir. Ayı
          elemek için yeter.
        </p>
        <p>
          Gece sıcaklığına ayrıca bakın. Gündüz 28° görünüp gece 8° olan bir iç
          kesim ile gece 22° olan bir kıyı, aynı bavulu kaldırmaz. Yüksek
          platoda gündüz ılık olsa da gece sertleşir; kışlık kat orada yazın
          bile çantada durur.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Sonra günleri seçin</h2>
        <p>
          Ay daralınca{" "}
          <Link href="/gezi-plani" className="font-medium text-sky-700 hover:text-sky-800">
            gezi planında
          </Link>{" "}
          yeri, gidiş gününü ve dönüş gününü yazın. Motor, seçtiğiniz her
          takvim günü için son on yılın aynı günlerine bakar: gündüz, gece ve
          o gün yağışlı geçmiş yılların oranı. 12 Ekim, 2016’dan 2025’e kadar
          on kez yaşanmıştır. Çıkan sayı, o günlerin ortalamasıdır.
        </p>
        <p>
          Ardışık günlerin hepsinde yağış oranı yüksekse haftayı kaydırmayı
          düşünün. Tek bir gün %60, yanındaki günler %20 ise plan çoğu zaman
          ayakta kalır; o günü kente veya müzeye ayırın. Üst üste dört gün %50
          üzerindeyse açık hava düğünü veya tekne turu için başka hafta daha
          rahat eder.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">15 günün içine girince tahmin konuşur</h2>
        <p>
          Tarih bugünden itibaren 15 günün içindeyse geçmiş ortalama yetmez.
          Aynı ekranda güncel tahmin de görünür. Geçmiş “bu günler genelde
          ılıktır” der, tahmin “bu sefer salı sağanak var” der. İkisi
          çelişirse, yakın tarih için tahmini esas alın. Nasıl okunacağı{" "}
          <Link href="/15-gunluk-tahmin-nasil-okunur" className="font-medium text-sky-700 hover:text-sky-800">
            15 günlük tahmin nasıl okunur
          </Link>{" "}
          yazısında.
        </p>
        <p>
          15 günden uzak bir tarih için elde yalnızca geçmiş vardır. Biletten
          önce ayı ve haftayı bununla eleyin; hafta yaklaşınca sayfayı yeniden
          açın. Sayılar değişebilir.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Çanta notu ne işe yarar</h2>
        <p>
          Gezi planı, seçilen aralıktaki sıcaklık ve yağışa göre kısa bir çanta
          notu çıkarır. Not, “mont al” ile “şapka yeter” arasını ayırır. İlaca,
          çocuk arabasına veya resmi bir uyarıya karışmaz. Fırtına, sel, kar
          yolu veya uçuş için Meteoroloji Genel Müdürlüğü ve ilgili kurumun
          duyurusuna bakın. Bu site o duyurunun yerine geçmez.
        </p>
        <p>
          İlçe seçerseniz hesap o ilçenin koordinatında yapılır. Komşu ilçeler
          birbirine yakın sonuç verir. Dağın iki yakası veya rakımı sıçrayan
          bir ilde ilçeyi ayrıca seçmek fark ettirir.
        </p>
      </section>
    </InfoPage>
  );
}
