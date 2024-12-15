import React from 'react';
import { Button } from '../ui/button';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardComponent() {
  return (
    <section className="h-full w-full flex-1 place-content-center text-center">
      <h1 className="mb-4 text-3xl">Coming Soon ⏳</h1>
      <Link href="/dashboard">
        <Button size={'default'}>
          <LayoutDashboard />
          Go back to dashbord
        </Button>
      </Link>
    </section>
  );
}
