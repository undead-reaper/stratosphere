import FileDropdown from "@/components/FileDropdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { constructUrl, getFormattedDate } from "@/lib/utils";
import { AppwriteFileOutput } from "@/types/AppwriteFile";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

const FileCard = ({ file }: { file: AppwriteFileOutput }) => {
  return (
    <Card className="flex-1">
      <CardContent>
        {file.type === "image" ? (
          <Image
            src={constructUrl({
              bucketField: file.bucketField,
              variant: "preview",
            })}
            width={0}
            height={0}
            priority
            sizes="100vw"
            className="object-cover w-full h-50 md:h-30 xl:h-40 rounded-sm"
            alt={file.name}
          />
        ) : (
          <div className="w-full h-40 flex items-center justify-center">
            <Image
              src={`/icons/${file.type}.svg`}
              width={32}
              priority
              height={32}
              alt={file.type}
              className="dark:invert"
            />
          </div>
        )}
      </CardContent>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex-1 truncate">
          <CardTitle className="truncate line-clamp-1">{file.name}</CardTitle>
          <CardDescription className="text-xs mt-1">
            <p>
              {getFormattedDate({ date: file.$createdAt, variant: "compact" })}
            </p>
          </CardDescription>
        </div>
        <FileDropdown file={file}>
          <Button size="icon" variant="ghost">
            <MoreVertical />
          </Button>
        </FileDropdown>
      </CardHeader>
    </Card>
  );
};

export default FileCard;
