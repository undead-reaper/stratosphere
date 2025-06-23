import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string().nonempty(),
    NEXT_PUBLIC_APPWRITE_DATABASE_ID: z.string().nonempty(),
    NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID: z.string().nonempty(),
    NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID: z.string().nonempty(),
    NEXT_PUBLIC_APPWRITE_BUCKET_ID: z.string().nonempty(),
    NEXT_PUBLIC_APPWRITE_ENDPOINT: z.url().nonempty(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APPWRITE_PROJECT_ID:
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    NEXT_PUBLIC_APPWRITE_DATABASE_ID:
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID:
      process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
    NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID:
      process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID,
    NEXT_PUBLIC_APPWRITE_BUCKET_ID: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID,
    NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  },
});

export const serverEnv = createEnv({
  server: {
    NEXT_APPWRITE_SECRET: z.string().nonempty(),
  },
  experimental__runtimeEnv: true,
});
