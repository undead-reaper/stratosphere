import "server-only";

import { clientEnv, serverEnv } from "@/env";
import { cookies } from "next/headers";
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";

type SessionClient = {
  account: Account;
  databases: Databases;
};

export const createSessionClient = async (): Promise<
  FunctionReturn<SessionClient>
> => {
  const client = new Client()
    .setEndpoint(clientEnv.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(clientEnv.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

  const session = (await cookies()).get("appwrite_session");

  if (!session || !session.value) {
    return { error: "No session found" };
  }

  client.setSession(session.value);

  return {
    data: {
      account: new Account(client),
      databases: new Databases(client),
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