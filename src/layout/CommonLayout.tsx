import Footer from "../components/Footer";
import Header from "../components/Header";

interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout = ({ children }: CommonLayoutProps) => {
  return (
    <div
      id="common-layout"
      className="flex flex-col gap-4 h-full max-w-[390px] w-full justify-center m-auto"
    >
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default CommonLayout;
