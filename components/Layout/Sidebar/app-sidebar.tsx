import * as React from 'react';

import { NavMain } from '@/components/Layout/Sidebar/nav-main';
import { NavUser } from '@/components/Layout/Sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';

import FeedbackModal from '@/components/Modal/feedback-modal';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="top-[56px] hidden lg:block"
    >
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <FeedbackModal />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
