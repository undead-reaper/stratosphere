import "server-only";

import { clientEnv, serverEnv } from "@/env";
import { cookies } from "next/headers";
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(clientEnv.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(clientEnv.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const session = (await cookies()).get("appwrite_session");

  if (!session || !session.value) {
    throw new Error("No session cookie found");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(clientEnv.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(clientEnv.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(serverEnv.NEXT_APPWRITE_SECRET);

  return {
    get account() {
      return new Account(client);
    },

    get databases() {
      return new Databases(client);
    },

    get storage() {
      return new Storage(client);
    },

    get avatars() {
      return new Avatars(client);
    },
  };
};
