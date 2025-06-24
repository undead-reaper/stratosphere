import SearchBar from "@/components/SearchBar";
import UploadButton from "@/components/UploadButton";

const Header = () => {
  return (
    <header className="flex-row items-center justify-start gap-3 px-5 hidden md:flex py-5">
      <SearchBar />
      <UploadButton />
    </header>
  );
};

export default Header;
