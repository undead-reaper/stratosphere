import FileGrid from "@/components/dashboard/FileGrid";
import TotalSize from "@/components/dashboard/TotalSize";
import Sort from "@/components/Sort";
import { Suspense, use } from "react";

type Props = Readonly<{
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>;

const PageSuspense = ({ params, searchParams }: Props) => {
  const { type } = use(params);
  const { query, sort } = use(searchParams);

  return (
    <section className="p-5 h-full">
      <header className="flex flex-col md:flex-row gap-y-2 items-start md:items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold capitalize font-playfair-display">
            {type}
          </h1>
          <TotalSize
            type={type}
            query={query as string}
            sort={sort as string}
          />
        </div>
        <span
          className="text-sm font-medium flex flex-row items-center gap-2
        "
        >
          Sort by: <Sort />
        </span>
      </header>
      <FileGrid type={type} query={query as string} sort={sort as string} />
    </section>
  );
};

const Page = ({ params, searchParams }: Props) => {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageSuspense params={params} searchParams={searchParams} />
    </Suspense>
  );
};

const PageSkeleton = () => {
  return (
    <section className="p-5 h-full">
      <header className="flex flex-col md:flex-row gap-y-2 items-start md:items-end justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-10 w-48 bg-muted-foreground/20 rounded animate-pulse" />
          <div className="h-5 w-32 bg-muted-foreground/20 rounded animate-pulse" />
        </div>
      </header>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <div className="w-full h-40 bg-muted-foreground/20 animate-pulse" />
            <div className="p-4">
              <div className="h-5 w-3/4 mb-2 bg-muted-foreground/20 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-muted-foreground/20 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Page;
