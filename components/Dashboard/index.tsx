'use client';

import React from 'react';
import StreakGrid from './StreakGrid';
import { Card, CardContent, CardHeader } from '../ui/card';
import dayjs from 'dayjs';
import StreakCount from './streak-count';
import NewEntry from './new-entry';
import { useUser } from '@/app/_providers/user-provider';
import Loader from '../Layout/loader';

export default function DashboardComponent({
  streakData,
}: {
  streakData: {
    date: string;
    active: boolean;
  }[];
}) {
  const { user } = useUser();

  if (!user) {
    return <Loader />;
  }

  return (
    <section className="h-auto w-full place-content-center p-6 py-3 lg:px-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="row-span-1 md:col-span-2">
          <h2 className="mb-2 text-4xl font-semibold">
            Welcome back, {user?.displayName}!
          </h2>
          <span>{dayjs().format('dddd, MMMM DD,YYYY • h:mm a')}</span>
        </div>
        <Card className="w-full content-center md:col-span-2">
          <CardContent className="flex w-full p-3">
            <StreakGrid streakData={streakData} />
          </CardContent>
        </Card>

        <Card className="content-center bg-gradient-to-br from-primary/15 to-purple-50">
          <CardContent className="pt-6">
            <h3 className="mb-2 text-lg font-medium">Today&apos;s Prompt</h3>
            <p className="font-serif text-2xl text-gray-700">
              What are you grateful for today?
            </p>
          </CardContent>
          <NewEntry />
        </Card>

        <Card className="content-center">
          <CardHeader>
            <StreakCount />
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}
