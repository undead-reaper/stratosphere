"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/constants";
import { usePathname, useRouter } from "next/navigation";

const Sort = () => {
  const router = useRouter();
  const path = usePathname();

  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger>
        <SelectValue placeholder={sortTypes[0].label} />
      </SelectTrigger>
      <SelectContent>
        {sortTypes.map((sortType) => (
          <SelectItem key={sortType.value} value={sortType.value}>
            {sortType.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
