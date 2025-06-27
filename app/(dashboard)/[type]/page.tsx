import { getFiles } from "@/appwrite/actions/file.actions";
import FileCard from "@/components/FileCard";
import Sort from "@/components/Sort";
import { getFileTypeParams } from "@/lib/utils";
import { Models } from "node-appwrite";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { type } = await params;
  const { query, sort } = await searchParams;
  const getSize = Intl.NumberFormat("en-US", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  });

  const types = getFileTypeParams(type) as string[];

  const files: Models.DocumentList<Models.Document> = await getFiles({
    types,
    query: query as string,
    sort: sort as string,
  });

  return (
    <section className="p-5 h-full">
      <header className="flex flex-col md:flex-row gap-y-2 items-start md:items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold capitalize font-playfair-display">
            {type}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Total Size:{" "}
            <span>
              {getSize.format(
                files.documents.reduce((acc, file) => acc + file.size, 0)
              )}
            </span>
          </p>
        </div>
        <span
          className="text-sm font-medium flex flex-row items-center gap-2
        "
        >
          Sort by: <Sort />
        </span>
      </header>
      {files.total > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-5">
          {files.documents.map((file) => (
            <FileCard key={file.$id} file={file} />
          ))}
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          No files found
        </div>
      )}
    </section>
  );
};

export default Page;
