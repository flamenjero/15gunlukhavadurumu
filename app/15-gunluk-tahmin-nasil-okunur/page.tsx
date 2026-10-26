import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { absoluteUrl } from "@/lib/site";

const title = "15 günlük tahmin nasıl okunur";
const description =
  "Gündüz, gece ve yağış yüzdesi ne anlatır. 15. günün yarın kadar kesin olmadığını ve ay takviminin nerede devreye girdiğini buradan okuyun.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/15-gunluk-tahmin-nasil-okunur" },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/15-gunluk-tahmin-nasil-okunur"),
    locale: "tr_TR",
  },
};

export default function ForecastGuidePage() {
  return (
    <InfoPage title={title} description={description}>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Sayfada üç sayı var</h2>
        <p>
          Bir il veya ilçe açtığınızda her gün için gündüz sıcaklığı, gece
          sıcaklığı ve yağış ihtimali durur. Gündüz, o takvim gününün en yüksek
          değeri; gece, en düşük değeridir. İkisi arasındaki fark, sabah evden
          çıkarken aldığınız montun akşam yetip yetmeyeceğini söyler.
        </p>
        <p>
          Yanındaki kısa hal — açık, bulutlu, sağanak, kar — o günün baskın
          beklenen tipidir. Öğleden sonra açıp akşam yağmur bırakan bir gün
          yine de “sağanak” diye yazılabilir. Tek kelime, günün tamamının
          fotoğrafı değildir.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Yüzde, söz vermez</h2>
        <p>
          Yağış %40, “bugün yağmur yağacak” demek değildir. Benzer koşullarda
          on günden yaklaşık dördünde ölçülebilir yağış düştüğü anlamına gelir.
          %10 ile pikniği ertelemeyin. %70 ile çamaşırı dışarı bırakmayın.
          Eşik olarak %40’ı, “ıslanma ihtimalini ciddiye alın” çizgisi diye
          kullanıyoruz; il sayfasındaki yağışlı gün sayısı da bu çizgiden
          sayılır.
        </p>
        <p>
          Rüzgar km/s, nem ise yüzde olarak durur. Nem tek başına bunaltıcı
          havayı anlatmaz; sıcaklıkla birlikte okuyun. 30° ve %70 nem, 30° ve
          %30 nemden daha ağır gelir.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Yarın ile 15. gün aynı kefede değil</h2>
        <p>
          İlk iki gün, gözlem ve kısa vadeli modele yakındır. Beşinci günden
          sonra ayrıntı gevşer: yağışın günü kayabilir, sıcaklık bir iki derece
          oynayabilir. Onuncu günden sonrası ise “haftanın kabaca hangi yöne
          gittiği”dir. O yüzden düğün, feribot veya dış çekim için 15. gündeki
          tek bir ikona bakıp karar kilitlemeyin. Tarih yaklaştıkça aynı
          sayfayı yeniden açın.
        </p>
        <p>
          Tahminler Open-Meteo üzerinden gelir ve günde birkaç kez yenilenir.
          Bu site Meteoroloji Genel Müdürlüğü’nün resmî uyarısı değildir.
          Fırtına, sel, don veya uçuş iptali için resmî duyuruya bakın.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Ay takvimi başka bir soruya cevap verir</h2>
        <p>
          15 günlük liste “bu hafta ne olacak” der.{" "}
          <Link href="/ay-takvimi" className="font-medium text-sky-700 hover:text-sky-800">
            Ay takvimi
          </Link>{" "}
          “bu ilde Ekim genelde nasıl geçer” der. Oradaki sayılar 2016–2025
          kayıtlarının ortalamasıdır. Yağış çizgisi, o ayda günlerin yaklaşık
          yüzde kaçında en az 1 mm yağış düştüğünü gösterir. Tatil ayını
          seçerken takvime, bilet aldıktan sonraki haftayı okurken 15 günlük
          listeye bakın.
        </p>
        <p>
          İl sayfasının başındaki “Bu ayın hali” bu ikisini birleştirir: o ayın
          normali ve önümüzdeki 15 günün en sıcak gündüzü, en serin gecesi,
          yağışlı gün sayısı. Kıyı, iç kesim ve yüksek plato aynı cümleyi
          kurmaz; çünkü gece-gündüz farkı ve rakım aynı hikâyeyi anlatmaz.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">İlçe sayfası</h2>
        <p>
          İlçe sayfası, o ilçenin koordinatındaki tahmini gösterir. Komşu
          ilçeler çoğu gün aynı metni paylaşır. Arama sonuçlarında il sayfasını
          öne alıyoruz; ilçeye il sayfasındaki listeden geçilir. Tarih
          seçerek bakmak için{" "}
          <Link href="/tatil-haftasi-nasil-secilir" className="font-medium text-sky-700 hover:text-sky-800">
            tatil haftası nasıl seçilir
          </Link>{" "}
          yazısına geçin.
        </p>
      </section>
    </InfoPage>
  );
}
