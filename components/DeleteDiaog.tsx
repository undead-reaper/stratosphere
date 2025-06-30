"use client";

import { deleteFile } from "@/appwrite/actions/file.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AppwriteFileOutput } from "@/types/AppwriteFile";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

const DeleteDialog = ({
  file,
  open,
  onOpenChange,
}: {
  file: AppwriteFileOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const path = usePathname();

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteFile({
        fileId: file.$id,
        bucketField: file.bucketField,
        path,
      });

      if (result.error) {
        toast.error("Failed to delete file", {
          description: result.error,
        });
      } else {
        toast.success("File deleted successfully", {
          description: "The file has been removed from your library.",
        });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {file.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This file will be permanently deleted and cannot be recovered. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
