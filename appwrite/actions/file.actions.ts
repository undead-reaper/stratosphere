"use server";

import { createAdminClient } from "@/appwrite/client";
import { clientEnv } from "@/env";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { AppwriteException, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export const uploadFile = async ({
  accountId,
  file,
  ownerId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketField: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
        ID.unique(),
        fileDocument
      )
      .catch(async (error) => {
        await storage.deleteFile(
          clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
          bucketFile.$id
        );
        throw new Error(`Failed to create file document: ${error.message}`);
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
};
