import type { ReactNode } from "react";
import Link from "next/link";

export default function InfoPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_#7dd3fc_0%,_transparent_60%)] opacity-70"
      />
      <main className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-sky-700">
                Ana sayfa
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="font-medium text-slate-800">{title}</li>
          </ol>
        </nav>
        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {description}
          </p>
        </header>
        <article className="mt-8 space-y-8 text-sm leading-relaxed text-slate-700 sm:text-base">
          {children}
        </article>
      </main>
    </div>
  );
}
