import { ItemDetail, itemMetadata, itemParams } from "@/components/SectionPages";

export function generateStaticParams() {
  return itemParams("moto");
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return itemMetadata("moto", params);
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ItemDetail section="moto" params={params} />;
}
