"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { constructDownloadUrl } from "@/lib/utils";
import Link from "next/link";
import { Models } from "node-appwrite";
import { ReactNode } from "react";

const FileDropdown = ({
  children,
  file,
}: Readonly<{
  children: ReactNode;
  file: Models.Document;
}>) => {
  const mobile = useIsMobile();

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          side={mobile ? "left" : "right"}
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        >
          <DropdownMenuLabel className="truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem>Details</DropdownMenuItem>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={constructDownloadUrl(file.bucketField)}
              download={file.name}
              rel="noopener noreferrer"
            >
              Download
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FileDropdown;
