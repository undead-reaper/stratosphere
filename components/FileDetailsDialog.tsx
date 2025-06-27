import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { constructUrl, getFormattedDate, getFormattedSize } from "@/lib/utils";
import { AppwriteFileOutput } from "@/types/AppwriteFile";
import Image from "next/image";

const FileDetailsDialog = ({
  file,
  open,
  onOpenChange,
}: {
  file: AppwriteFileOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-xl!">
        <DialogTitle>{file.name}</DialogTitle>
        <DialogDescription>File Details</DialogDescription>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="h-40 w-60 items-center flex justify-center">
            {file.type === "image" ? (
              <Image
                src={constructUrl({
                  bucketField: file.bucketField,
                  variant: "preview",
                })}
                width={0}
                height={0}
                sizes="100vw"
                alt="File Preview"
                className="object-cover w-60 h-40"
              />
            ) : (
              <Image
                src={`/icons/${file.type}.svg`}
                width={32}
                height={32}
                className="dark:invert"
                alt="File Preview"
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs">
              Created On:{" "}
              <span className="font-bold">
                {getFormattedDate({
                  date: file.$createdAt,
                  variant: "standard",
                })}
              </span>
            </p>
            <p className="text-xs">
              Last Modified:{" "}
              <span className="font-bold">
                {getFormattedDate({
                  date: file.$updatedAt,
                  variant: "standard",
                })}
              </span>
            </p>
            <p className="text-xs">
              Owner: <span className="font-bold">{file.owner.email}</span>
            </p>
            <p className="text-xs">
              Type: <span className="font-bold capitalize">{file.type}</span>
            </p>
            <p className="text-xs">
              Size:{" "}
              <span className="font-bold">
                {getFormattedSize({ size: file.size })}
              </span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileDetailsDialog;
