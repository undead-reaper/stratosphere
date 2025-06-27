import SearchBar from "@/components/SearchBar";
import UploadButton from "@/components/UploadButton";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="flex-row justify-end items-center gap-3 px-5 hidden md:flex py-5">
      <SearchBar />
      <UploadButton ownerId={userId} accountId={accountId} />
    </header>
  );
};

export default Header;
