import { getFiles } from "@/appwrite/actions/file.actions";
import { Input } from "@/components/ui/input";
import { getSearchParams } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AppwriteException, Models } from "node-appwrite";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

const SearchDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (state: boolean) => void;
}) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [query, setQuery] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] =
    useState<Models.DocumentList<Models.Document> | null>(null);
  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    const searchFiles = async () => {
      setIsLoading(true);
      setResults(null);
      try {
        const response = await getFiles({ query: debouncedQuery!, types: [] });
        setResults(response);
      } catch (error) {
        if (error instanceof AppwriteException) {
          toast.error("Failed to initialize search", {
            description: error.message,
          });
        } else {
          toast.error("Failed to initialize search", {
            description: "An unexpected error occurred.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (debouncedQuery) {
      searchFiles();
    } else {
      setResults(null);
      setQuery("");
    }
  }, [debouncedQuery]);

  const route = useRouter();

  const showEmptyList =
    (results?.total === 0 || results === null) && query && !isLoading;

  const handleItemClick = (file: Models.Document) => {
    const query = getSearchParams(file.type);
    onOpenChange(false);
    setResults(null);
    setQuery(null);

    route.replace(`/${query}?query=${file.name}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Search Files</DialogTitle>
        <DialogDescription>
          Search among your files by their name
        </DialogDescription>
        <div className="flex flex-col gap-5">
          <Input
            value={query ?? ""}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in stratosphere"
          />
          {isLoading && <Loader2 className="animate-spin self-center my-10" />}
          {showEmptyList ? (
            <p className="self-center my-10">No results found</p>
          ) : null}
          <ScrollArea className="flex h-min max-h-36 md:max-h-44 flex-col items-center">
            {results?.documents.map((file) => (
              <div
                key={file.$id}
                onClick={() => handleItemClick(file)}
                className="flex flex-row py-2 items-center gap-3 cursor-pointer"
              >
                <Image
                  src={`/icons/${file.type}.svg`}
                  alt={file.name}
                  width={25}
                  height={25}
                  className="dark:invert"
                />
                <div className="flex flex-col flex-1 w-full">
                  <h1 className="font-medium text-xs md:text-sm line-clamp-1 truncate overflow-ellipsis">
                    {file.name}
                  </h1>
                  <p className="text-xs md:text-sm text-muted-foreground space-x-4">
                    <strong>{file.owner.fullName}</strong>
                    <span>
                      {format(new Date(file.$updatedAt), "MMM d, yyyy")}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
