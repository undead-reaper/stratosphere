"use client";

import { uploadFile } from "@/appwrite/actions/file.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { AppwriteException } from "node-appwrite";
import { useCallback } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

export interface UploadFileProps {
  accountId: string;
  ownerId: string;
}

const UploadButton = ({ ownerId, accountId }: UploadFileProps) => {
  const path = usePathname();

  const handleFiles = useCallback(
    (acceptedFiles: File[]) => {
      const handleUploadFile = (file: File) => {
        return new Promise((resolve, reject) => {
          try {
            const uploadedFile = uploadFile({ file, ownerId, accountId, path });
            resolve(uploadedFile);
          } catch (error) {
            if (error instanceof AppwriteException) {
              reject(error.message);
            } else {
              reject(`Failed to upload file: ${error}`);
            }
          }
        });
      };

      acceptedFiles.forEach((file) => {
        toast.promise(handleUploadFile(file), {
          closeButton: true,
          richColors: true,
          loading: `Processing file upload`,
          success: `File uploaded successfully!`,
          error: (error) => {
            return `Error uploading file: ${error}`;
          },
          description: `${file.name}`,
        });
      });
      console.log("Files uploaded:", acceptedFiles);
    },
    [accountId, ownerId, path]
  );

  return (
    <Dropzone
      onDropAccepted={handleFiles}
      multiple={true}
      maxSize={5 * 1024 * 1024}
    >
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="flex flex-col items-center gap-2">
          <Input {...getInputProps()} />
          <Button>Upload</Button>
          <p className="text-xs text-muted-foreground">Max file size: 5MB</p>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadButton;
