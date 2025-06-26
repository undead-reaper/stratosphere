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
import { usePathname } from "next/navigation";
import { AppwriteException, Models } from "node-appwrite";
import { useTransition } from "react";
import { toast } from "sonner";

const DeleteDialog = ({
  file,
  open,
  onOpenChange,
}: {
  file: Models.Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const path = usePathname();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteFile({
          fileId: file.$id,
          bucketField: file.bucketField,
          path,
        });
        toast.success("File deleted successfully", {
          description: "The file has been removed from your library.",
        });
      } catch (error) {
        if (error instanceof AppwriteException) {
          toast.error("Failed to delete file", {
            description: error.message,
          });
        } else {
          toast.error("Failed to delete file", {
            description: "Please try again later.",
          });
        }
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
