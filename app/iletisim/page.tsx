import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { CONTACT_EMAIL, absoluteUrl } from "@/lib/site";

const title = "İletişim";
const description =
  "15 Günlük Hava Durumu için düzeltme, reklam ve gizlilik taleplerini e-posta ile iletebilirsiniz.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/iletisim" },
  openGraph: {
    title,
    description,
    url: absoluteUrl("/iletisim"),
    locale: "tr_TR",
  },
};

export default function ContactPage() {
  return (
    <InfoPage
      title={title}
      description="Sorularınızı ve düzeltme taleplerinizi e-posta ile iletebilirsiniz."
    >
      <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">E-posta</h2>
        <p className="mt-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-base font-semibold text-sky-700 hover:text-sky-800"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="mt-3 text-slate-600">
          Yanıtları bu adresten yazarız. Acil hava uyarısı hattı değildir.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Hangi konularda yazabilirsiniz</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Yanlış il, ilçe veya bağlantı düzeltmesi</li>
          <li>Tahmin veya mevsimsel notlardaki içerik hataları</li>
          <li>Reklam ve iş birliği</li>
          <li>
            <Link href="/gizlilik-politikasi" className="font-medium text-sky-700 hover:text-sky-800">
              Gizlilik politikası
            </Link>{" "}
            kapsamındaki talepler
          </li>
        </ul>
      </section>
    </InfoPage>
  );
}
