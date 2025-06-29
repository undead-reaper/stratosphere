"use server";

import { createAdminClient, createSessionClient } from "@/appwrite/client";
import { clientEnv } from "@/env";
import { type AppwriteUserOutput } from "@/types/AppwriteUser";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { ID, Query } from "node-appwrite";
import { toast } from "sonner";

const getUserByEmail = async (
  email: string
): Promise<AppwriteUserOutput | null> => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments<AppwriteUserOutput>(
    clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    clientEnv.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

type CreateUserParams = {
  fullName: string;
  email: string;
};

export const createAccount = async ({
  fullName,
  email,
}: CreateUserParams): Promise<string> => {
  const existingUser = await getUserByEmail(email);
  const accountId = await sendEmailOTP({ email });
  if (!accountId) throw new Error("Failed to send OTP");

  if (!existingUser) {
    const encodedName = encodeURIComponent(fullName);
    const avatar = `https://ui-avatars.com/api/?background=random&name=${encodedName}`;

    const { databases } = await createAdminClient();
    await databases.createDocument(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatar,
        accountId: accountId,
      }
    );
  }

  return accountId;
};

export const loginWithEmail = async ({
  email,
}: {
  email: string;
}): Promise<string> => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await sendEmailOTP({ email });
      return existingUser.accountId;
    }
    throw new Error("User not found.");
  } catch (error) {
    throw new Error(`${error}`);
  }
};

type VerifyEmailOTPParams = {
  accountId: string;
  secret: string;
};

export const verifyEmailOTP = async ({
  accountId,
  secret,
}: VerifyEmailOTPParams): Promise<string> => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, secret);

    (await cookies()).set("appwrite_session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return session.$id;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getCurrentUser = async (): Promise<AppwriteUserOutput | null> => {
  try {
    const { databases, account } = await createSessionClient();

    const result = await account.get();

    const user = await databases.listDocuments<AppwriteUserOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return user.documents[0];
  } catch (error) {
    console.log("Error fetching current user:", error);
    return null;
  }
};

export const signOutUser = async (): Promise<void> => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite_session");
    toast.success("Successfully signed out", {
      description: "Redirecting to login",
    });
  } catch (error) {
    throw new Error(`${error}`);
  } finally {
    redirect("/login", RedirectType.replace);
  }
};