"use server";

import { createAdminClient } from "@/appwrite/client";
import { clientEnv } from "@/env";
import { cookies } from "next/headers";
import { AppwriteException, ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    clientEnv.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error: unknown) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error("Failed to send email OTP");
    }
  }
};

type CreateUserParams = {
  fullName: string;
  email: string;
};

export const createAccount = async ({ fullName, email }: CreateUserParams) => {
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

  return parseStringify({ accountId });
};

export const loginWithEmail = async ({ email }: { email: string }) => {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    throw new Error("User not found.");
  }

  const accountId = await sendEmailOTP({ email });

  if (accountId) throw new Error("Failed to send email OTP");

  return parseStringify({ accountId });
};

type VerifyEmailOTPParams = {
  accountId: string;
  secret: string;
};

export const verifyEmailOTP = async ({
  accountId,
  secret,
}: VerifyEmailOTPParams) => {
  try {
    const { account } = await createAdminClient();
    console.log(accountId);

    const session = await account.createSession(accountId, secret);

    (await cookies()).set("appwrite_session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ accountId: session.$id });
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw error;
    } else {
      throw new Error("Failed to verify email OTP");
    }
  }
};
