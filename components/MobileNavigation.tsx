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
      <UploadButton ownerId={userId} accountId={accountId} />
    </div>
  );
};

export default MobileNavigation;
