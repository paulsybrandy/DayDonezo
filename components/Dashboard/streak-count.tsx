'use client';

import { useUserStore } from '@/store/userStore';
import React from 'react';
import { Card, CardDescription, CardTitle } from '../ui/card';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import NumberTicker from '../ui/number-ticker';
import dayjs from 'dayjs';
import StreakCountdown from './streak-counter';

export default function StreakCount() {
  const user = useUserStore((state) => state.user);
  const latestEntryTime = dayjs(user?.last_entry_at).toISOString(); // Example: Now
  const streakDuration = 24 * 60 * 60 * 1000;
  return (
    <>
      <CardTitle className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Progress</h2>
        <div className="flex flex-col items-center">
          <Card
            className={cn(
              'inline-flex items-center gap-2 border-orange-100 bg-orange-50 p-3 text-base'
            )}
          >
            {user ? (
              user?.current_streak > 0 ? (
                <Flame className="h-5 w-5 text-orange-500" />
              ) : (
                '😓'
              )
            ) : (
              ''
            )}
            <span className="font-medium text-orange-700">
              {!user ? (
                'Counting...'
              ) : user?.current_streak > 0 ? (
                <>
                  <NumberTicker
                    value={user?.current_streak}
                    className="text-orange-700"
                  />{' '}
                  day streak
                </>
              ) : (
                `${user?.current_streak} day streak`
              )}
            </span>
          </Card>
          {user && (
            <StreakCountdown
              latestEntryTime={latestEntryTime}
              streakDuration={streakDuration}
            />
          )}
        </div>
      </CardTitle>
      <CardDescription>
        <p className="text-base text-muted-foreground">
          {user
            ? user?.current_streak > 0
              ? 'Keep going! You&apos;re building a great habit. 🌟'
              : "Didn't expected this from you!"
            : 'Hang tight, your wins are coming!'}
        </p>
      </CardDescription>
    </>
  );
}
