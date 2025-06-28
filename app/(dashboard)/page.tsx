import { getFiles } from "@/appwrite/actions/file.actions";
import { getCurrentUser } from "@/appwrite/actions/user.actions";
import TypeErrorDistributionChart from "@/components/TypeDistributionChart";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const Home = async () => {
  const files: Models.DocumentList<AppwriteFileOutput> = await getFiles({
    types: [],
  });

  const size = files?.documents.reduce((acc, file) => acc + file.size, 0) || 0;
  const user = await getCurrentUser();

  const totalSize = getFormattedSize({ size });
  const now: Date = new Date();
  const date = format(now, "EEEE, MMMM d, yyyy");
  const recentFiles = files.documents.slice(0, 5);

  return (
    <div className="p-5 flex flex-col w-full h-full">
      <Card className="mb-5">
        <CardHeader>
          <CardTitle>👋 Hello, {user?.fullName}!</CardTitle>
          <CardDescription>{date}</CardDescription>
        </CardHeader>
      </Card>
      <p className="text-muted-foreground">Total Storage</p>
      <h1 className="text-xl font-bold mb-5">
        {totalSize} <span className="text-base font-normal">used from 2GB</span>
      </h1>
      <Suspense>
        <TypeErrorDistributionChart files={files} />
      </Suspense>
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
          {recentFiles.map((file) => (
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
    </div>
  );
};

export default Home;
