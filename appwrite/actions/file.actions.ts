"use server";

import { createAdminClient } from "@/appwrite/client";
import { clientEnv } from "@/env";
import { constructUrl, getFileType } from "@/lib/utils";
import {
  AppwriteFileInput,
  AppwriteFileOutput,
  FileType,
} from "@/types/AppwriteFile";
import { AppwriteUserOutput } from "@/types/AppwriteUser";
import { revalidatePath } from "next/cache";
import { AppwriteException, ID, Models, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { getCurrentUser } from "./user.actions";

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
}: UploadFileProps): Promise<FunctionReturn<AppwriteFileInput>> => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
      ID.unique(),
      inputFile
    );

    const type: FileType = Object.keys(getFileType(file.name))[0] as FileType;
    const extension: string = Object.values(
      getFileType(file.name)
    )[0] as string;

    const fileDocument: Partial<AppwriteFileInput> = {
      type,
      name: bucketFile.name,
      url: constructUrl({ bucketField: bucketFile.$id, variant: "file" }),
      extension,
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
        throw error;
      });

    revalidatePath(path);
    return { data: newFile };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};

type CreateQueriesProps = {
  currentUser: AppwriteUserOutput;
  types: FileType[];
  query: string;
  sort: string;
};

const createQueries = ({
  currentUser,
  types,
  query,
  sort,
}: CreateQueriesProps): string[] => {
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

type GetFilesProps = {
  types: FileType[];
  query?: string;
  sort?: string;
};

export const getFiles = async ({
  types,
  query = "",
  sort = "$createdAt-desc",
}: GetFilesProps): Promise<
  FunctionReturn<Models.DocumentList<AppwriteFileOutput>>
> => {
  const { databases } = await createAdminClient();

  try {
    const { data: currentUser, error: userError } = await getCurrentUser();
    if (userError || !currentUser) {
      return { error: userError };
    }

    const queries = createQueries({ currentUser, types, query, sort });

    const files = await databases.listDocuments<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      queries
    );

    return { data: files };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
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
  path,
  extension,
}: RenameFileProps): Promise<FunctionReturn<AppwriteFileOutput>> => {
  try {
    const { databases } = await createAdminClient();
    const update = extension ? { name, extension } : { name };
    const updatedFile = await databases.updateDocument<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId,
      update
    );
    revalidatePath(path);
    return { data: updatedFile };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
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
}: ShareFileProps): Promise<FunctionReturn<AppwriteFileOutput>> => {
  try {
    const { databases } = await createAdminClient();
    const currentFile = await databases.getDocument<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId
    );

    if (
      currentFile.users.includes(email) ||
      currentFile.owner.email === email
    ) {
      return { error: "User already has access to this file." };
    }

    const updatedFile = await databases.updateDocument<AppwriteFileOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId,
      {
        users: [...currentFile.users, email],
      }
    );
    revalidatePath(path);
    return { data: updatedFile };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};

type RemoveShareProps = {
  fileId: string;
  email: string;
  path: string;
};

export const removeShare = async ({
  fileId,
  email,
  path,
}: RemoveShareProps): Promise<FunctionReturn<AppwriteFileOutput>> => {
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
        users: currentFile.users.filter((userEmail) => userEmail !== email),
      }
    );
    revalidatePath(path);
    return { data: updatedFile };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};

type DeleteFileProps = {
  fileId: string;
  bucketField: string;
  path: string;
};

export const deleteFile = async ({
  fileId,
  bucketField,
  path,
}: DeleteFileProps): Promise<FunctionReturn<boolean>> => {
  try {
    const { databases, storage } = await createAdminClient();

    const deletedDocument = await databases.deleteDocument(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
      fileId
    );

    if (deletedDocument) {
      await storage.deleteFile(
        clientEnv.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
        bucketField
      );
    }

    revalidatePath(path);
    return { data: true };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};