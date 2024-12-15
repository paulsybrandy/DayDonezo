import React from 'react';
import StreakGrid from './StreakGrid';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
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
          <CardFooter className="">
            <Button className="w-full" size={'lg'}>
              <PenLine className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </CardFooter>
        </Card>

        <Card className="content-center">
          <CardHeader>
            <CardTitle className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Progress</h2>
              <Card
                className={cn(
                  'inline-flex items-center gap-2 border-orange-100 bg-orange-50 p-3 text-base'
                )}
              >
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-orange-700">
                  5-day streak
                </span>
              </Card>
            </CardTitle>
            <CardDescription>
              <p className="text-base text-muted-foreground">
                Keep going! You&apos;re building a great habit. 🌟
              </p>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}
