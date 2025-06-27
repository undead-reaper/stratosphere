"use server";

import { getCurrentUser } from "@/appwrite/actions/user.actions";
import { createAdminClient } from "@/appwrite/client";
import { clientEnv } from "@/env";
import { constructUrl, getFileType } from "@/lib/utils";
import {
  type AppwriteFileInput,
  type AppwriteFileOutput,
  FileType,
} from "@/types/AppwriteFile";
import { AppwriteUserOutput } from "@/types/AppwriteUser";
import { revalidatePath } from "next/cache";
import { AppwriteException, ID, Models, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

type UploadFileProps = {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
};

export const uploadFile = async ({
  accountId,
  file,
  ownerId,
  path,
}: UploadFileProps): Promise<AppwriteFileInput | null> => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      ID.unique(),
      inputFile
    );

    const type: FileType = Object.keys(getFileType(file.name))[0] as FileType;
    const extension: string = Object.values(getFileType(file.name))[0];

    const fileDocument: Partial<AppwriteFileInput> = {
      type: type,
      name: bucketFile.name,
      url: constructUrl({ bucketField: bucketFile.$id, variant: "file" }),
      extension: extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketField: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument<AppwriteFileInput>(
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
    return newFile;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }
};

const createQueries = (
  currentUser: AppwriteUserOutput,
  types: string[],
  query: string,
  sort: string
): string[] => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) {
    queries.push(Query.equal("type", types));
  }
  if (query) {
    queries.push(Query.contains("name", query));
  }

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  return queries;
};

export const getFiles = async ({
  types,
  query = "",
  sort = "$createdAt-desc",
}: {
  types: FileType[];
  query?: string;
  sort?: string;
}): Promise<Models.DocumentList<AppwriteFileOutput>> => {
  const { databases } = await createAdminClient();

  try {
    const currentUser: AppwriteUserOutput | null = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const queries = createQueries(currentUser, types, query, sort);

    const files = await databases.listDocuments<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      queries
    );
    return files;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to get files: ${error}`);
    }
  }
};

type RenameFileProps = {
  fileId: string;
  name: string;
  extension?: string;
  path: string;
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps): Promise<AppwriteFileOutput> => {
  try {
    const { databases } = await createAdminClient();
    const update = extension
      ? { name: name, extension: extension }
      : { name: name };
    const updatedFile = await databases.updateDocument<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId,
      update
    );
    revalidatePath(path);
    return updatedFile;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to rename file: ${error}`);
    }
  }
};

interface ShareFileProps {
  fileId: string;
  email: string;
  path: string;
}

export const shareFile = async ({
  fileId,
  email,
  path,
}: ShareFileProps): Promise<AppwriteFileOutput> => {
  try {
    const { databases } = await createAdminClient();
    const currentFile = await databases.getDocument<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId
    );

    const updatedFile = await databases.updateDocument<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId,
      {
        users: [...currentFile.users, email],
      }
    );
    revalidatePath(path);
    return updatedFile;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to share file: ${error}`);
    }
  }
};

export const removeShare = async ({
  fileId,
  email,
  path,
}: ShareFileProps): Promise<AppwriteFileOutput> => {
  try {
    const { databases } = await createAdminClient();
    const currentFile = await databases.getDocument<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId
    );

    const updatedFile = await databases.updateDocument<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId,
      {
        users: currentFile.users.filter(
          (userEmail: string) => userEmail !== email
        ),
      }
    );
    revalidatePath(path);
    return updatedFile;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to remove share from file: ${error}`);
    }
  }
};

interface DeleteFileProps {
  fileId: string;
  bucketField: string;
  path: string;
}

export const deleteFile = async ({
  fileId,
  bucketField,
  path,
}: DeleteFileProps): Promise<boolean> => {
  try {
    const { databases, storage } = await createAdminClient();

    const deletedFile = await databases.deleteDocument(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId
    );

    if (deletedFile) {
      await storage.deleteFile(
        clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        bucketField
      );
    }

    revalidatePath(path);
    return true;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error(`Failed to remove share from file: ${error}`);
    }
  }
};