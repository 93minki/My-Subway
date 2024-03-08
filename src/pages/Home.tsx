import SearchBar from "@/components/SearchBar";
import SubwayState from "@/components/SubwayState";

export default function Home() {
  return (
    <div id="home" className="flex flex-col gap-16 max-w-[418px] w-full">
      <SearchBar />
      <SubwayState />
    </div>
  );
}
