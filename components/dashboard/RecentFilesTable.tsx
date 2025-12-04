import { getFiles } from "@/appwrite/actions/file.actions";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFormattedSize } from "@/lib/utils";
import { AppwriteFileOutput } from "@/types/AppwriteFile";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Models } from "node-appwrite";
import { Suspense } from "react";

const RecentFilesTableSuspense = async () => {
  const result: FunctionReturn<Models.DocumentList<AppwriteFileOutput>> =
    await getFiles({ types: [] });

  const recentFiles = result.data!.documents.slice(0, 5);

  if (recentFiles.length === 0) return null;

  return (
    <>
      <h1 className="mb-5 font-playfair-display font-bold mt-10">
        Recently Modified Files
      </h1>
      <Table>
        <TableCaption>Your Recently Modified Files</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-min">File Name</TableHead>
            <TableHead>Date Uploaded</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>File Size</TableHead>
            <TableHead>File Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentFiles!.map((file) => (
            <TableRow key={file.$id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{format(file.$createdAt, "dd/MM/yyyy")}</TableCell>
              <TableCell>
                {formatDistanceToNowStrict(file.$updatedAt)} ago
              </TableCell>
              <TableCell>{getFormattedSize({ size: file.size })}</TableCell>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TableCell>{file.owner.fullName}</TableCell>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{file.owner.email}</p>
                </TooltipContent>
              </Tooltip>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const RecentFilesTable = () => {
  return (
    <Suspense fallback={<RecentFilesSkeleton />}>
      <RecentFilesTableSuspense />
    </Suspense>
  );
};

const RecentFilesSkeleton = () => {
  return (
    <>
      <Skeleton className="h-8 w-64 mb-5 mt-10" />
      <div className="border rounded-md">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </>
  );
};

export default RecentFilesTable;
