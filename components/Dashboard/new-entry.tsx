'use client';

import React from 'react';

import { CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { PenLine } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import dayjs from 'dayjs';
import Link from 'next/link';

export default function NewEntry() {
  const currentDate = dayjs().format('DD/MM/YYYY');
  const entries = useUserStore((state) => state.user?.Entries);
  const wonToday = entries?.some(
    (entry) => dayjs(entry.created_at).format('DD/MM/YYYY') === currentDate
  );

  return (
    <CardFooter className="">
      <Link href={wonToday ? '' : '/ournal/entry'} className="w-full">
        <Button className="w-full" size={'lg'} disabled={!entries}>
          {!wonToday ? (
            <>
              <PenLine className="mr-2 h-4 w-4" />
              New Entry
            </>
          ) : (
            'Done for the day!'
          )}
        </Button>
      </Link>
    </CardFooter>
  );
}
