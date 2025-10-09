import { clientEnv } from "@/env";
import { type FileType } from "@/types/AppwriteFile";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns/format";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const fileExtensionMap: Record<string, FileType> = {
  pdf: "document",
  doc: "document",
  docx: "document",
  txt: "document",
  xls: "document",
  xlsx: "document",
  csv: "document",
  rtf: "document",
  ods: "document",
  ppt: "document",
  odp: "document",
  md: "document",
  html: "document",
  htm: "document",
  epub: "document",
  pages: "document",
  fig: "document",
  psd: "document",
  ai: "document",
  indd: "document",
  xd: "document",
  sketch: "document",
  afdesign: "document",
  afphoto: "document",

  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  bmp: "image",
  svg: "image",
  webp: "image",

  mp4: "video",
  avi: "video",
  mov: "video",
  mkv: "video",
  webm: "video",

  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  flac: "audio",
};

export const getFileType = (
  fileName: string
): Partial<Record<FileType, string>> => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) {
    return { other: "" };
  }

  const type = fileExtensionMap[extension] || "other";

  return { [type]: extension };
};

type UrlVariant = "file" | "preview" | "download";

export const constructUrl = ({
  bucketField,
  variant,
}: {
  bucketField: string;
  variant?: UrlVariant;
}) => {
  return `${clientEnv.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${
    clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID
  }/files/${bucketField}/${variant || "view"}?project=${
    clientEnv.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  }`;
};

export const getFileTypeParams = (type: string): FileType[] => {
  switch (type) {
    case "documents":
      return ["document"];
    case "images":
      return ["image"];
    case "media":
      return ["video", "audio"];
    case "others":
      return ["other"];
    default:
      return ["document"];
  }
};

export const getSearchParams = (type: FileType): string => {
  switch (type) {
    case "image":
      return "images";
    case "document":
      return "documents";
    case "video":
      return "media";
    case "audio":
      return "media";
    case "other":
      return "others";
    default:
      return "documents";
  }
};

type dateVariant = "compact" | "standard";

export const getFormattedDate = ({
  date,
  variant,
}: {
  date: string;
  variant: dateVariant;
}): string => {
  if (variant === "compact") {
    return format(new Date(date), "MMM d, yyyy");
  } else {
    return format(new Date(date), "MMM d, yyyy hh:mm");
  }
};

export const getFormattedSize = ({ size }: { size: number }): string =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  }).format(size);