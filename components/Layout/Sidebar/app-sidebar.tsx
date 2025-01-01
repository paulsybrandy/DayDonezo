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
        {/* <a
          href="https://www.producthunt.com/posts/daydonezo?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-daydonezo"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=745904&theme=light"
            alt="DayDonezo - Journaling&#0032;Wins&#0044;&#0032;Designing&#0032;Life | Product Hunt"
            width="250"
            height="54"
          />
        </a> */}
        <FeedbackModal />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
