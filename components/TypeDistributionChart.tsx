import { AppwriteFileOutput, FileType } from "@/types/AppwriteFile";
import { Models } from "node-appwrite";

type StorageData = {
  label: string;
  value: number;
  color: string;
};

const TypeDistributionChart = ({
  files,
}: {
  files: Models.DocumentList<AppwriteFileOutput>;
}) => {
  const getSize = ({ type }: { type: FileType }) => {
    return files.documents
      .filter((file) => file.type === type)
      .reduce((acc, file) => acc + file.size, 0);
  };

  const documentsSize = getSize({ type: "document" });
  const imagesSize = getSize({ type: "image" });
  const videosSize = getSize({ type: "video" });
  const audioSize = getSize({ type: "audio" });
  const othersSize = getSize({ type: "other" });

  const storageData: StorageData[] = [
    { label: "Documents", value: documentsSize, color: "#4A90E2" },
    { label: "Images", value: imagesSize, color: "#50E3C2" },
    { label: "Videos", value: videosSize, color: "#F5A623" },
    { label: "Audio", value: audioSize, color: "#B8E986" },
    { label: "Others", value: othersSize, color: "#D0021B" },
  ];

  const totalCapacity = 2 * 1024 * 1024 * 1024; // 2GB in bytes

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-6 bg-muted-foreground/25 rounded-sm overflow-hidden flex">
        {storageData.map((item, index) => {
          const percentage = (item.value / totalCapacity) * 100;
          return (
            <div
              key={index}
              className="h-full transition-all duration-300 hover:opacity-80"
              style={{
                width: `${percentage}%`,
                backgroundColor: item.color,
              }}
            ></div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4">
        {storageData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TypeDistributionChart;
