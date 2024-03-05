import SearchBar from "@/components/SearchBar";
import SubwayState from "@/components/SubwayState";

export default function Home() {
  return (
    <div id="home" className="flex flex-col gap-16">
      <SearchBar />
      <SubwayState
        subwayId="1007"
        statnFid="1007000738"
        statnTid="1007000736"
      />
    </div>
  );
}
