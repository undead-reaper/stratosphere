import { getFiles } from "@/appwrite/actions/file.actions";
import FileCard from "@/components/FileCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getFileTypeParams } from "@/lib/utils";
import { FileType } from "@/types/AppwriteFile";
import { Suspense } from "react";

type Props = Readonly<{
  type: string;
  query: string;
  sort: string;
}>;

const FileGridSuspense = async ({ type, query, sort }: Props) => {
  const types: FileType[] = getFileTypeParams(type);
  const result = await getFiles({ types, query, sort });

  if (result.data!.total === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        No files found
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-5">
      {result.data!.documents.map((file) => (
        <FileCard key={file.$id} file={file} />
      ))}
    </div>
  );
};

const FileGrid = ({ type, query, sort }: Props) => {
  return (
    <Suspense fallback={<FileGridSkeleton />}>
      <FileGridSuspense type={type} query={query} sort={sort} />
    </Suspense>
  );
};

const FileGridSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="w-full h-40" />
          <div className="p-4">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileGrid;
