import Navbar from "@/components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}
