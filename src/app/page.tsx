import dynamic from "next/dynamic";

const Map = dynamic(() => import("~/components/Map"), { ssr: false });

export default async function Home() {
  return (
    <div className="h-full">
      <Map />
    </div>
  );
}
