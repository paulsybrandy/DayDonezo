import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { House, LayoutDashboard } from 'lucide-react';
import Particles from '@/components/ui/particles';
import { isUserAuth } from '@/lib/auth';

export default async function NotFound() {
  const isAuthenticated = await isUserAuth();

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-3">
      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={80}
        color={'#f01757'}
        refresh
      />
      <h2 className="flex items-center gap-2 text-2xl font-semibold">
        <p>Oops! Looks like you are lost</p>
      </h2>
      <p>This page could not be found</p>
      <Link href={isAuthenticated ? '/dashboard' : '/'}>
        <Button className="flex items-center gap-2">
          {isAuthenticated ? (
            <LayoutDashboard size={20} />
          ) : (
            <House size={20} />
          )}
          <p>Go to {isAuthenticated ? 'dashboard' : 'home'}</p>
        </Button>
      </Link>
    </div>
  );
}
