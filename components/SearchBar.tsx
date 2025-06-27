"use client";

import SearchDialog from "@/components/SearchDialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        onClick={setIsOpen.bind(null, true)}
        className="mb-5"
        variant="ghost"
        size="icon"
      >
        <Search />
      </Button>
      <SearchDialog open={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
};

export default SearchBar;
