import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

const title = "Hakkında";
const description =
  "15 Günlük Hava Durumu, Türkiye’deki şehir ve ilçeler için 15 günlük tahmin ile mevsimsel tarım ve arıcılık notları sunar.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/hakkinda" },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/hakkinda"),
    locale: "tr_TR",
  },
};

export default function AboutPage() {
  return (
    <InfoPage title={title} description={description}>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Ne işe yarar</h2>
        <p>
          {SITE_NAME}, bir şehrin veya ilçenin önümüzdeki 15 gününe bakmak
          isteyenler için hazırlanmış bir rehberdir. İl veya ilçe adını
          yazdığınızda o yerin günlük tahminini ve mevsime göre tarla, bahçe ve
          arıcılık notlarını görürsünüz.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Veriler nereden gelir</h2>
        <p>
          Hava tahminleri Open-Meteo üzerinden alınır. Konum listesi Türkiye
          il ve ilçe kayıtlarından gelir. Mevsimsel öneriler, seçilen yerin
          takvimi ve hava özetine göre sitede üretilir.
        </p>
        <p>
          Bu site Meteoroloji Genel Müdürlüğü’nün resmî uyarısı değildir.
          Fırtına, sel, don veya benzeri risklerde resmî duyuruları ayrıca
          kontrol edin. Tahminler değişebilir.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Tatil ve gezi planı</h2>
        <p>
          15 günden uzak bir tarih için günlük tahmin güvenilir olmaz.{" "}
          <Link href="/gezi-plani" className="font-medium text-sky-700 hover:text-sky-800">
            Gezi planı
          </Link>{" "}
          seçtiğiniz yerde 2016–2025 arasındaki aynı takvim günlerinin sıcaklık
          ve yağış ortalamasını gösterir. Tarih önümüzdeki 15 günün içindeyse
          güncel tahmin de yanında durur.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Reklamlar</h2>
        <p>
          Sayfalarda Google AdSense reklamları yer alabilir. Reklamların nasıl
          çalıştığı{" "}
          <Link href="/gizlilik-politikasi" className="font-medium text-sky-700 hover:text-sky-800">
            gizlilik politikasında
          </Link>{" "}
          anlatılır.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">İletişim</h2>
        <p>
          Düzeltme, eksik ilçe veya gizlilik talepleri için{" "}
          <Link href="/iletisim" className="font-medium text-sky-700 hover:text-sky-800">
            iletişim sayfasını
          </Link>{" "}
          kullanabilirsiniz.
        </p>
      </section>
    </InfoPage>
  );
}
