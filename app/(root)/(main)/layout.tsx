import MobileNavComponent from '@/components/Layout/mobile-nav';
import { AppSidebar } from '@/components/Layout/Sidebar/app-sidebar';

import { SidebarProvider } from '@/components/ui/sidebar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider className="flex-col lg:flex-row">
        <AppSidebar />
        {children}
        <MobileNavComponent />
      </SidebarProvider>
    </>
  );
}
