import React from 'react';
import StreakGrid from './StreakGrid';
import { Card, CardContent, CardHeader } from '../ui/card';
import { getUser } from '@/lib/auth';
import dayjs from 'dayjs';
import StreakCount from './streak-count';
import NewEntry from './new-entry';

const generateSampleData = () => {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      active: false,
    });
  }
  return data;
};

export default async function DashboardComponent() {
  const user = await getUser();
  const streakData = generateSampleData();

  return (
    <section className="h-auto w-full place-content-center p-6 py-3 lg:px-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="row-span-1 md:col-span-2">
          <h2 className="mb-2 text-4xl font-semibold">
            Welcome back, {user?.name}!
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
