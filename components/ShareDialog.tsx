"use client";

import { removeShare, shareFile } from "@/appwrite/actions/file.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppwriteFileOutput } from "@/types/AppwriteFile";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

const shareDialogSchema = z.object({
  email: z.email(),
});

type ShareDialogType = z.infer<typeof shareDialogSchema>;

const ShareDialog = ({
  file,
  open,
  onOpenChange,
}: {
  file: AppwriteFileOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const initials = file.owner.fullName
    .split(" ")
    .map((name: string) => name.charAt(0).toUpperCase())
    .join("");

  const [isPending, startTransition] = useTransition();
  const path = usePathname();

  const shareDialogForm = useForm<ShareDialogType>({
    resolver: zodResolver(shareDialogSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ShareDialogType) => {
    if (
      file.users.includes(values.email) ||
      file.owner.email === values.email
    ) {
      toast.error("User already has access to this file", {
        description: "You cannot share the file with the same user again.",
      });
      return;
    }
    startTransition(async () => {
      const result = await shareFile({
        fileId: file.$id,
        email: values.email,
        path,
      });

      if (result.error) {
        toast.error("Error sharing file", {
          description: result.error,
        });
      } else {
        toast.success("File shared successfully", {
          description: "The file has been shared with " + values.email,
        });
        shareDialogForm.reset();
      }
    });
  };

  const revokeShare = (userEmail: string) => {
    startTransition(async () => {
      const result = await removeShare({
        fileId: file.$id,
        email: userEmail,
        path,
      });

      if (result.error) {
        toast.error("Error removing share", {
          description: result.error,
        });
      } else {
        toast.success("File access revoked successfully", {
          description: "It is no longer accessible to " + userEmail,
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...shareDialogForm}>
          <form onSubmit={shareDialogForm.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Share File</DialogTitle>
              <DialogDescription>Sharing {file.name}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 my-5">
              <FormField
                control={shareDialogForm.control}
                name="email"
                disabled={isPending}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h1 className="font-medium">People with access</h1>
              <div className="flex items-center justify-between gap-2">
                <Avatar>
                  <AvatarImage
                    src={file.owner.avatar}
                    alt={file.owner.fullName}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex-col items-start">
                  <p className="text-xs">{file.owner.fullName} (Owner)</p>
                  <p className="text-xs text-muted-foreground">
                    {file.owner.email}
                  </p>
                </div>
              </div>
              {file.users.length > 0 &&
                file.users.map((user: string) => (
                  <p className="text-xs flex items-center gap-2" key={user}>
                    {user} (Shared)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => revokeShare(user)}
                          type="button"
                          variant="ghost"
                          disabled={isPending}
                        >
                          <X />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Revoke Access</TooltipContent>
                    </Tooltip>
                  </p>
                ))}
            </div>
            <DialogFooter>
              <DialogClose disabled={isPending} asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Share
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
