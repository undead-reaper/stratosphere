"use server";

import { getCurrentUser } from "@/appwrite/actions/user.actions";
import { createAdminClient } from "@/appwrite/client";
import { clientEnv } from "@/env";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { AppwriteException, ID, Models, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

export const uploadFile = async ({
  accountId,
  file,
  ownerId,
  path,
}: UploadFileProps): Promise<Models.Document | null> => {
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

const createQueries = (currentUser: Models.Document): string[] => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];
  return queries;
};

export const getFiles = async (): Promise<
  Models.DocumentList<Models.Document>
> => {
  const { databases } = await createAdminClient();

  try {
    const currentUser: Models.Document | null = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const queries = createQueries(currentUser);

    const files = await databases.listDocuments(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      queries
    );
    return parseStringify(files);
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to get files: ${error}`);
    }
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  try {
    const { databases } = await createAdminClient();

    const newName = `${name}.${extension}`;
    const updatedFile = await databases.updateDocument(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId,
      {
        name: newName,
      }
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to rename file: ${error}`);
    }
  }
};