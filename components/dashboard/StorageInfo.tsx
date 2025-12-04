import { getFiles } from "@/appwrite/actions/file.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { getFormattedSize } from "@/lib/utils";
import { AppwriteFileOutput } from "@/types/AppwriteFile";
import { Models } from "node-appwrite";
import { Suspense } from "react";

const StorageInfoSuspense = async () => {
  const result: FunctionReturn<Models.DocumentList<AppwriteFileOutput>> =
    await getFiles({ types: [] });
  const size =
    result.data!.documents.reduce((acc, file) => acc + file.size, 0) || 0;
  const totalSize = getFormattedSize({ size });

  return (
    <h1 className="text-xl font-bold mb-5">
      {totalSize} <span className="text-base font-normal">used from 2GB</span>
    </h1>
  );
};

const StorageInfo = () => {
  return (
    <Suspense fallback={<StorageInfoSkeleton />}>
      <StorageInfoSuspense />
    </Suspense>
  );
};

const StorageInfoSkeleton = () => {
  return <Skeleton className="h-7 w-48 mb-5" />;
};

export default StorageInfo;
