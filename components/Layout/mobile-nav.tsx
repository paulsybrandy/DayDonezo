'use client';

import React from 'react';
import { BookText, ChartArea, LayoutDashboard } from 'lucide-react';
import { Avatar } from '../ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import UserAvatar from '../ui/user-avatar';
import { useUserStore } from '@/store/userStore';

const menuItems = [
  {
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    url: '/analytics',
    icon: ChartArea,
  },
  {
    url: '/journal',
    icon: BookText,
  },
];

export default function MobileNavComponent() {
  const location = usePathname();
  const user = useUserStore((state) => state.user);

  return (
    <section className="fixed bottom-0 order-2 mx-auto block w-full border-t bg-white py-1 lg:hidden">
      <div className="flex gap-4 *:flex-1 *:place-items-center *:py-2">
        {menuItems.map((item, i) => (
          <Link href={item.url} key={i}>
            <div>
              <item.icon
                size={24}
                className={
                  location === item.url ? 'fill-primary stroke-primary-600' : ''
                }
              />
            </div>
          </Link>
        ))}
        {user && (
          <Link href={'/settings'}>
            <Avatar className="h-6 w-6">
              {/* <AvatarImage src={user.photoURL!} /> */}
              <UserAvatar username={user.avatar_seed!} />
            </Avatar>
          </Link>
        )}
      </div>
    </section>
  );
}
