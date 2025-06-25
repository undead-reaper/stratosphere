import { clientEnv } from "@/env";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));

type FileType = "document" | "image" | "video" | "audio" | "other";

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

export const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) {
    return { type: "other", extension: "" };
  }

  const type = fileExtensionMap[extension] || "other";

  return { type, extension };
};

export const constructFileUrl = (bucketFileId: string) => {
  return `${clientEnv.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${bucketFileId}/view?project=${clientEnv.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

export const constructPreviewUrl = (bucketFileId: string) => {
  return `${clientEnv.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${bucketFileId}/preview?project=${clientEnv.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

export const constructDownloadUrl = (bucketFileId: string) => {
  return `${clientEnv.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${bucketFileId}/download?project=${clientEnv.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};
