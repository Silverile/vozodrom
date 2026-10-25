import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { notFound } from "next/navigation";
import { CarImage } from "@/components/CarImage";
import { BODY_LABEL, brands, getBrand, modelsOf } from "@/lib/catalog";
import { listingsOf } from "@/lib/listings";

type Params = Promise<{ brand: string }>;

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { brand } = await params;
  return { title: getBrand(brand)?.name ?? "Značka" };
}

export default async function BrandPage({ params }: { params: Params }) {
  const { brand: slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();
  const list = modelsOf(slug);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-[var(--color-muted)]">
        <Link href="/katalog/" className="hover:underline">Katalog</Link> / {brand.name}
      </nav>
      <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight mt-2">
        <BrandLogo slug={brand.slug} name={brand.name} className="h-9 w-9" />
        {brand.name}
      </h1>
      <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((m) => (
          <Link key={m.slug} href={`/katalog/${slug}/${m.slug}/`} className="card overflow-hidden hover:shadow-lg transition">
            <CarImage body={m.body} color="stříbrná" className="w-full aspect-[16/9]" />
            <div className="p-4">
              <div className="font-semibold">{brand.name} {m.name}</div>
              <div className="text-sm text-[var(--color-muted)]">{m.segment} · {BODY_LABEL[m.body]}</div>
              <div className="text-sm mt-2">{listingsOf(slug, m.slug).length} inzerátů</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
