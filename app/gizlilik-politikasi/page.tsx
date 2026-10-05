import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

const title = "Gizlilik politikası";
const description =
  "15 Günlük Hava Durumu hangi verileri işler, çerezleri ve Google reklamlarını nasıl kullanır.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gizlilik-politikasi" },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/gizlilik-politikasi"),
    locale: "tr_TR",
  },
};

export default function PrivacyPage() {
  return (
    <InfoPage
      title={title}
      description="Son güncelleme: 5 Ekim 2026. Bu metin, siteyi ziyaret ettiğinizde işlenen verileri açıklar."
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Kim sorumlu</h2>
        <p>
          {SITE_NAME} ({SITE_URL}) bir üyelik sitesi değildir. Gizlilik
          talepleriniz için{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-sky-700 hover:text-sky-800"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          adresini kullanabilirsiniz. Ayrıntılar{" "}
          <Link href="/iletisim" className="font-medium text-sky-700 hover:text-sky-800">
            iletişim
          </Link>{" "}
          sayfasındadır.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Hangi veriler işlenir</h2>
        <p>Sitede hesap açılmaz, ad-soyad veya ödeme bilgisi istenmez.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Yazdığınız il veya ilçe adı, eşleşen yerleri göstermek için konum
            veritabanına iletilir. Bu sorgu bir kullanıcı profili oluşturmak
            için saklanmaz.
          </li>
          <li>
            Seçtiğiniz yerin enlem ve boylamı, 15 günlük tahmini almak için
            Open-Meteo hizmetine gönderilir. Tarayıcınızın konumu istenmez.
          </li>
          <li>
            Barındırma hizmeti; güvenlik ve işletim için IP adresi, tarayıcı
            türü ve istenen sayfa gibi teknik kayıtlar tutabilir.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Çerezler ve reklamlar</h2>
        <p>
          Sayfalarda Google AdSense reklamları gösterilebilir. Google ve
          reklam ortakları, ilgi alanına göre reklam sunmak ve gösterim
          ölçmek için çerez veya benzeri tanımlayıcılar kullanabilir. Bu
          çerezler reklam tercihlerinizi hatırlayabilir.
        </p>
        <p>
          Google’ın reklam çerezlerini nasıl kullandığı{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            className="font-medium text-sky-700 hover:text-sky-800"
            rel="noopener noreferrer"
            target="_blank"
          >
            reklam teknolojileri açıklamasında
          </a>{" "}
          yer alır. Kişiselleştirilmiş reklamları{" "}
          <a
            href="https://adssettings.google.com/"
            className="font-medium text-sky-700 hover:text-sky-800"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Reklam Ayarları
          </a>{" "}
          üzerinden kapatabilirsiniz. Üçüncü taraf çerezleri tarayıcı
          ayarlarınızdan da engelleyebilirsiniz.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Kimlerle paylaşılır</h2>
        <p>Veriler satılmaz. İşleyiş için şu hizmetler kullanılır:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Google AdSense, reklam gösterimi için</li>
          <li>Open-Meteo, seçilen yerin hava tahmini için</li>
          <li>Supabase, il ve ilçe araması için</li>
          <li>Vercel, sitenin barındırılması için</li>
        </ul>
        <p>
          Bu sağlayıcılar kendi gizlilik metinlerine göre veri işler. Google’ın
          gizlilik politikası{" "}
          <a
            href="https://policies.google.com/privacy"
            className="font-medium text-sky-700 hover:text-sky-800"
            rel="noopener noreferrer"
            target="_blank"
          >
            policies.google.com/privacy
          </a>{" "}
          adresindedir.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Haklarınız</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamındaki erişim,
          düzeltme ve silme taleplerinizi {CONTACT_EMAIL} adresine
          yazabilirsiniz. Başvuruda hangi sayfayı ziyaret ettiğinizi ve talebin
          konusunu belirtmeniz yeterlidir.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Değişiklikler</h2>
        <p>
          Bu metin güncellendiğinde yeni hali bu sayfada yayımlanır. Sitenin
          amacı ve kullanılan hizmetler değişirse metin de buna göre
          yenilenir.
        </p>
      </section>
    </InfoPage>
  );
}
