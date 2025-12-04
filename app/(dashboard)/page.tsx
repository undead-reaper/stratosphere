import FileDistributionChart from "@/components/dashboard/FileDistributionChart";
import RecentFilesTable from "@/components/dashboard/RecentFilesTable";
import StorageInfo from "@/components/dashboard/StorageInfo";
import UserGreeting from "@/components/dashboard/UserGreeting";

const Home = () => {
  return (
    <div className="p-5 flex flex-col w-full h-full">
      <UserGreeting />
      <p className="text-muted-foreground">Total Storage</p>
      <StorageInfo />
      <FileDistributionChart />
      <RecentFilesTable />
    </div>
  );
};

export default Home;
