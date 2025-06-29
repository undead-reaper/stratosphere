"use client";

import { uploadFile } from "@/appwrite/actions/file.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { AppwriteException } from "node-appwrite";
import { useCallback } from "react";
import Dropzone, { FileRejection } from "react-dropzone";
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
    },
    [accountId, ownerId, path]
  );

  const handleDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    rejectedFiles.forEach((file) => {
      if (file.file.size > 5 * 1024 * 1024) {
        toast.error(`Could not upload file: ${file.file.name}`, {
          description: `File size exceeds 5MB limit.`,
        });
      } else {
        toast.error(`Could not upload file: ${file.file.name}`, {
          description: file.errors.map((error) => error.message).join(", "),
          closeButton: true,
        });
      }
    });
  }, []);

  return (
    <Dropzone
      onDropAccepted={handleFiles}
      multiple={true}
      maxSize={5 * 1024 * 1024}
      onDropRejected={handleDropRejected}
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
