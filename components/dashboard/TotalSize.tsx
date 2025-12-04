import { getFiles } from "@/appwrite/actions/file.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { getFileTypeParams, getFormattedSize } from "@/lib/utils";
import { FileType } from "@/types/AppwriteFile";
import { Suspense } from "react";

const TotalSizeSuspense = async ({ query, sort, type }: TotalSizeProps) => {
  const types: FileType[] = getFileTypeParams(type);
  const result = await getFiles({ types, query, sort });

  const totalSize = getFormattedSize({
    size: result.data!.documents.reduce((acc, file) => acc + file.size, 0),
  });

  return (
    <p className="text-sm font-medium text-muted-foreground">
      Total Size: <span>{totalSize}</span>
    </p>
  );
};

type TotalSizeProps = Readonly<{
  type: string;
  query: string;
  sort: string;
}>;

const TotalSize = ({ type, query, sort }: TotalSizeProps) => {
  return (
    <Suspense fallback={<TotalSizeSkeleton />}>
      <TotalSizeSuspense type={type} query={query} sort={sort} />
    </Suspense>
  );
};

const TotalSizeSkeleton = () => {
  return <Skeleton className="h-5 w-32" />;
};

export default TotalSize;
