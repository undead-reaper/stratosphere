"use server";

import { createAdminClient, createSessionClient } from "@/appwrite/client";
import { clientEnv } from "@/env";
import { AppwriteUserOutput } from "@/types/AppwriteUser";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { AppwriteException, ID, Query } from "node-appwrite";

const getUserByEmail = async ({
  email,
}: {
  email: string;
}): Promise<AppwriteUserOutput | null> => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments<AppwriteUserOutput>(
    clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    clientEnv.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
    [Query.equal("email", [email])]
  );

  if (result.documents.length === 0) {
    return null;
  } else {
    return result.documents[0];
  }
};

export const sendEmailOTP = async ({
  email,
}: {
  email: string;
}): Promise<FunctionReturn<string>> => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return { data: session.userId };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};

type CreateAccountParams = {
  fullName: string;
  email: string;
};

export const createAccount = async ({
  fullName,
  email,
}: CreateAccountParams): Promise<FunctionReturn<string>> => {
  try {
    const existingUser = await getUserByEmail({ email });

    if (existingUser) {
      return { error: "User already exists." };
    }

    const { data: accountId, error: otpError } = await sendEmailOTP({ email });
    if (otpError || !accountId) {
      return { error: otpError };
    }
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
        avatar,
        accountId,
      }
    );
    console.log("Account created successfully:", accountId);
    return { data: accountId };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};

export const loginWithEmail = async ({
  email,
}: {
  email: string;
}): Promise<FunctionReturn<string>> => {
  try {
    const existingUser = await getUserByEmail({ email });

    if (existingUser) {
      const { data: accountId, error: otpError } = await sendEmailOTP({
        email,
      });
      if (otpError || !accountId) {
        return { error: otpError };
      }

      return { data: existingUser.accountId };
    }

    return { error: "User not found." };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};

type VerifyEmailOTPParams = {
  accountId: string;
  secret: string;
};

export const verifyEmailOTP = async ({
  accountId,
  secret,
}: VerifyEmailOTPParams): Promise<FunctionReturn<string>> => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, secret);

    (await cookies()).set("appwrite_session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return { data: session.$id };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};

export const getCurrentUser = async (): Promise<
  FunctionReturn<AppwriteUserOutput>
> => {
  try {
    const clientResult = await createSessionClient();
    if (clientResult.error || !clientResult.data) {
      return { error: clientResult.error };
    }

    const { databases, account } = clientResult.data;

    const result = await account.get();
    const user = await databases.listDocuments<AppwriteUserOutput>(
      clientEnv.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      clientEnv.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("accountId", [result.$id])]
    );

    if (user.total === 0) {
      return { error: "User not found." };
    } else {
      return { data: user.documents[0] };
    }
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  }
};

export const signOutUser = async (): Promise<FunctionReturn<void>> => {
  const clientResult = await createSessionClient();
  if (clientResult.error || !clientResult.data) {
    redirect("/login", RedirectType.replace);
  }

  const { account } = clientResult.data;

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite_session");
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error: error.message };
    } else {
      return { error: error as string };
    }
  } finally {
    redirect("/login", RedirectType.replace);
  }
};