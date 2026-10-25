import { ItemDetail, itemMetadata, itemParams } from "@/components/SectionPages";

export function generateStaticParams() {
  return itemParams("pneu");
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return itemMetadata("pneu", params);
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ItemDetail section="pneu" params={params} />;
}
