import { Toaster } from "@/components/ui/toaster";

interface CommonLayoutProps {
  children: React.ReactNode;
}

const CommonLayout = ({ children }: CommonLayoutProps) => {
  return (
    <div
      id="common-layout"
      className="flex flex-col gap-4 h-full max-w-[390px] w-full justify-center m-auto"
    >
      {children}
      <Toaster />
    </div>
  );
};

export default CommonLayout;
