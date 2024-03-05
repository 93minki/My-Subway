import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div>
      <div id="search-bar">
        <Input type="text" placeholder="write subway name" />
        <Button type="submit">Search!</Button>
      </div>
    </div>
  );
}
