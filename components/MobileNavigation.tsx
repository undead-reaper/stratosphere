import SearchBar from "@/components/SearchBar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UploadButton from "@/components/UploadButton";

const MobileNavigation = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <div className="flex flex-row items-center justify-between md:hidden p-4">
      <SidebarTrigger />

      <div className="flex-row flex">
        <SearchBar />
        <UploadButton ownerId={userId} accountId={accountId} />
      </div>
    </div>
  );
};

export default MobileNavigation;
