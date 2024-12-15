'use client';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Footer() {
  const location = usePathname();

  return (
    <>
      <footer
        className={cn(
          'border border-t py-2 text-center',
          location === '/' ? 'block' : 'hidden'
        )}
      >
        Made with ❤️ by{' '}
        <a
          href="https://x.com/jaimin_chovatia/"
          target="_blank"
          className="underline hover:no-underline"
        >
          CJ
        </a>
      </footer>
    </>
  );
}
