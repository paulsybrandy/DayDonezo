'use client';

import * as React from 'react';
import {
  BookText,
  ChartNoAxesCombined,
  ChartPie,
  LayoutDashboard,
  Settings2,
} from 'lucide-react';

import { NavMain } from '@/components/Layout/Sidebar/nav-main';
import { NavUser } from '@/components/Layout/Sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useUser } from '@/app/_providers/user-provider';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: ChartPie,
    },
    {
      title: 'Journal',
      url: '/journal',
      icon: BookText,
    },
    {
      title: 'Leaderboard',
      url: '/leaderboard',
      icon: ChartNoAxesCombined,
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="top-[56px] hidden lg:block"
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
