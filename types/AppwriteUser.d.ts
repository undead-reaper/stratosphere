import { AppwriteFileInput } from "@/types/AppwriteFile";
import { Models } from "node-appwrite";

type AppwriteUserInput = Models.Document & {
  email: string;
  fullName: string;
  avatar: string;
  accountId: string;
  files: string[];
};

type AppwriteUserOutput = Models.Document & {
  email: string;
  fullName: string;
  avatar: string;
  accountId: string;
  files: AppwriteFileInput[];
};
