import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { constructPreviewUrl } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { Models } from "node-appwrite";

const FileDetailsDialog = ({
  file,
  open,
  onOpenChange,
}: {
  file: Models.Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const formattedCreatedDate = format(
    new Date(file.$createdAt),
    "MMM d, yyyy hh:mm"
  );
  const formattedUpdatedDate = format(
    new Date(file.$updatedAt),
    "MMM d, yyyy hh:mm"
  );

  const getSize = Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:max-w-xl!">
        <DialogTitle>{file.name}</DialogTitle>
        <DialogDescription>File Details</DialogDescription>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="h-40 w-60 items-center flex justify-center">
            {file.type === "image" ? (
              <Image
                src={constructPreviewUrl(file.bucketField)}
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
              <span className="font-bold">{formattedCreatedDate}</span>
            </p>
            <p className="text-xs">
              Last Modified:{" "}
              <span className="font-bold">{formattedUpdatedDate}</span>
            </p>
            <p className="text-xs">
              Owner: <span className="font-bold">{file.owner.fullName}</span>
            </p>
            <p className="text-xs">
              Type: <span className="font-bold capitalize">{file.type}</span>
            </p>
            <p className="text-xs">
              Size:{" "}
              <span className="font-bold">{getSize.format(file.size)}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileDetailsDialog;
