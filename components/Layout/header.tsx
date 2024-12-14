import { Const } from '@/lib/contants';
import React from 'react';
import { Button } from '../ui/button';
import { BookCheck, Star } from 'lucide-react';
import MobileHeader from './mobile-header';
import NumberTicker from '../ui/number-ticker';
import { RainbowButton } from '../ui/rainbow-button';
import { isUserAuth } from '@/lib/auth';
import Link from 'next/link';

export default async function Header() {
  const isAuthenticated = await isUserAuth();

  return (
    <header className="header sticky top-0 z-50 h-14 border-b border-gray-200 bg-background/60 px-4 py-2 backdrop-blur sm:px-16 lg:px-32">
      <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between">
        <Link className="flex items-center" href="/">
          <BookCheck className="rotate-6 stroke-primary" size={32} />
          <span className="text-xl font-bold">{Const.APP_NAME}</span>
        </Link>
        <div className="hidden items-center gap-2 lg:flex">
          <RainbowButton className="group h-10 space-x-1 rounded-md">
            <span>Star on Github</span>
            <Star
              className="duration-250 fill-gray-400 stroke-gray-400 transition-colors group-hover:fill-yellow-500 group-hover:stroke-yellow-500"
              size={20}
            />
            <NumberTicker value={100} className="text-white" />
          </RainbowButton>
          <Link href={isAuthenticated ? '/dashboard' : '/register'}>
            <Button variant={'default'} className="items-center text-center">
              {isAuthenticated ? (
                <span>Dashboard</span>
              ) : (
                <span>Get Started</span>
              )}
            </Button>
          </Link>
        </div>
        <MobileHeader />
      </div>
    </header>
  );
}
