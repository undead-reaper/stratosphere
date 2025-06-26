"use client";

import DeleteDialog from "@/components/DeleteDiaog";
import FileDetailsDialog from "@/components/FileDetailsDialog";
import RenameDialog from "@/components/RenameDialog";
import ShareDialog from "@/components/ShareDialog";
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
import { ReactNode, useState } from "react";

const FileDropdown = ({
  children,
  file,
}: Readonly<{
  children: ReactNode;
  file: Models.Document;
}>) => {
  const mobile = useIsMobile();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const openDialog = (dialogType: string) => {
    setActiveDialog(dialogType);
  };

  const closeDialog = () => {
    setActiveDialog(null);
  };

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
          <DropdownMenuItem onClick={() => openDialog("rename")}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog("details")}>
            Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog("share")}>
            Share
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={constructDownloadUrl(file.bucketField)}
              download={file.name}
              rel="noopener noreferrer"
            >
              Download
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog("delete")}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RenameDialog
        open={activeDialog === "rename"}
        onOpenChange={closeDialog}
        file={file}
      />

      <FileDetailsDialog
        file={file}
        open={activeDialog === "details"}
        onOpenChange={closeDialog}
      />

      <ShareDialog
        file={file}
        open={activeDialog === "share"}
        onOpenChange={closeDialog}
      />

      <DeleteDialog
        file={file}
        open={activeDialog === "delete"}
        onOpenChange={closeDialog}
      />
    </div>
  );
};

export default FileDropdown;
