import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <>
      <Button className="mb-5" variant="ghost" size="icon">
        <Search />
      </Button>
    </>
  );
};

export default SearchBar;
