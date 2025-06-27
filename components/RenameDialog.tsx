"use client";

import { renameFile } from "@/appwrite/actions/file.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppwriteFileOutput } from "@/types/AppwriteFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { AppwriteException } from "node-appwrite";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

const renameDialogSchema = z.object({
  newName: z.string().nonempty(),
});

type RenameDialogType = z.infer<typeof renameDialogSchema>;

const RenameDialog = ({
  open,
  onOpenChange,
  file,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: AppwriteFileOutput;
}) => {
  const [isPending, startTransition] = useTransition();
  const path = usePathname();

  const renameDialogForm = useForm<RenameDialogType>({
    resolver: zodResolver(renameDialogSchema),
    defaultValues: {
      newName: file.name ?? "",
    },
  });

  const onSubmit = (values: RenameDialogType) => {
    const extensionParts = values.newName?.split(".");
    const newExtension =
      extensionParts && extensionParts.length > 1
        ? extensionParts.pop()
        : undefined;

    startTransition(async () => {
      const finalName = !!newExtension
        ? values.newName
        : `${values.newName}.${file.extension}`;

      try {
        await renameFile({
          fileId: file.$id,
          name: finalName,
          path: path,
          extension: newExtension,
        });
        toast.success("File renamed successfully", {
          description: `File has been renamed to ${finalName}`,
        });
        onOpenChange(false);
      } catch (error) {
        if (error instanceof AppwriteException) {
          toast.error("Error renaming file", { description: error.message });
        } else {
          toast.error("Error renaming file", {
            description: "An unknown error occurred",
          });
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-sm">
        <Form {...renameDialogForm}>
          <form
            className="space-y-4"
            onSubmit={renameDialogForm.handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle>Rename File</DialogTitle>
              <DialogDescription>
                Please enter a new name for the file.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={renameDialogForm.control}
              name="newName"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="newfile.jpg" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose disabled={isPending} asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Rename
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDialog;
