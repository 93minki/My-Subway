import Footer from "../components/Footer";
import Header from "../components/Header";

interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout = ({ children }: CommonLayoutProps) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default CommonLayout;
