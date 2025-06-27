import { AppwriteUserInput } from "@/types/AppwriteUser";
import { Models } from "node-appwrite";

type FileType = "document" | "image" | "video" | "audio" | "other";

type AppwriteFileInput = Models.Document & {
  name: string;
  url: string;
  type: FileType;
  bucketField: string;
  accountId: string;
  owner: string;
  extension: string;
  size: number;
  users: string[];
};

type AppwriteFileOutput = Models.Document & {
  name: string;
  url: string;
  type: FileType;
  bucketField: string;
  accountId: string;
  owner: AppwriteUserInput;
  extension: string;
  size: number;
  users: string[];
};
