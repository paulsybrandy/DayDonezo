import React from 'react';
import StreakGrid from './StreakGrid';
import { Card, CardContent, CardFooter } from '../ui/card';
import { getUser } from '@/lib/auth';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Flame, PenLine } from 'lucide-react';
import { Button } from '../ui/button';

const generateSampleData = () => {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      active: Math.random() < 0.5,
    });
  }
  return data;
};

export default async function DashboardComponent() {
  const user = await getUser();

  const streakData = generateSampleData();
  return (
    <section className="grid w-full grid-cols-1 gap-6 p-4 sm:px-16 md:grid-cols-2 lg:px-32">
      <div className="md:col-span-2">
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
        <CardFooter className="">
          <Button className="w-full">
            <PenLine className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <div className="place-content-center rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <Card
              className={cn(
                'inline-flex items-center gap-2 border-orange-100 bg-orange-50 p-3'
              )}
            >
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium text-orange-700">5-day streak</span>
            </Card>
          </div>
          <p className="text-muted-foreground">
            Keep going! You&apos;re building a great habit. 🌟
          </p>
        </div>
      </div>
    </section>
  );
}
