import { SidebarTrigger } from "@/components/ui/sidebar";
import UploadButton from "@/components/UploadButton";

const MobileNavigation = () => {
  return (
    <div className="flex flex-row items-center justify-between md:hidden p-4">
      <SidebarTrigger />
      <UploadButton />
    </div>
  );
};

export default MobileNavigation;
