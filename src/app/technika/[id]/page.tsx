import { ItemDetail, itemMetadata, itemParams } from "@/components/SectionPages";

export function generateStaticParams() {
  return itemParams("technika");
}

export function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  return itemMetadata("technika", params);
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <ItemDetail section="technika" params={params} />;
}
