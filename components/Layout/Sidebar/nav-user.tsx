'use client';

import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/app/_providers/user-provider';
import UserAvatar from '@/components/ui/user-avatar';

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar();
  const { signOut } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {user ? (
                <>
                  <Avatar className="h-8 w-8 rounded-lg">
                    {/* <AvatarImage
                      src={user?.photoURL ? user?.photoURL : ''}
                      alt={user.displayName!}
                    /> */}
                    <UserAvatar username={user.displayName!} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs">
                      {user.displayName!}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </>
              ) : (
                <>
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="grid flex-1 gap-2 text-left text-sm leading-tight">
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-full rounded-md" />
                  </div>
                </>
              )}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {user ? (
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      {/* <AvatarImage
                        src={user!.photoURL ? user.photoURL : ''}
                        alt={user.displayName!}
                      /> */}
                      <UserAvatar username={user.displayName!} />

                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-xs">
                        {user.displayName!}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <div className="grid flex-1 gap-2 text-left text-sm leading-tight">
                      <Skeleton className="h-3 w-3/4 rounded-md" />
                      <Skeleton className="h-3 w-full rounded-md" />
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
