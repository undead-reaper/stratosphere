import { getFiles } from "@/appwrite/actions/file.actions";
import TypeDistributionChart from "@/components/TypeDistributionChart";
import { Skeleton } from "@/components/ui/skeleton";
import { AppwriteFileOutput } from "@/types/AppwriteFile";
import { Models } from "node-appwrite";
import { Suspense } from "react";

const FileDistributionChartSuspense = async () => {
  const result: FunctionReturn<Models.DocumentList<AppwriteFileOutput>> =
    await getFiles({ types: [] });

  return <TypeDistributionChart files={result.data!} />;
};

const FileDistributionChart = () => {
  return (
    <Suspense fallback={<FileDistributionChartSkeleton />}>
      <FileDistributionChartSuspense />
    </Suspense>
  );
};

const FileDistributionChartSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-full h-6 rounded-sm" />
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="w-3 h-3 rounded-sm" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDistributionChart;
