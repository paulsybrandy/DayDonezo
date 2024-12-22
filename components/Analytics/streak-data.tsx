import { useUserStore } from '@/store/userStore';
import React from 'react';
import NumberTicker from '../ui/number-ticker';

export default function StreakData() {
  const user = useUserStore((state) => state.user);
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-4xl font-bold text-green-600">
          {user && user?.current_streak > 0 ? (
            <NumberTicker
              value={user?.current_streak ?? 0}
              className="text-green-600"
            />
          ) : (
            '0'
          )}{' '}
          Days
        </div>
        <div className="text-sm text-muted-foreground">Current Streak</div>
      </div>
      <div>
        <div className="text-2xl font-semibold text-blue-600">
          {user && user?.max_streak > 0 ? (
            <NumberTicker
              value={user?.max_streak ?? 0}
              className="text-blue-600"
            />
          ) : (
            '0'
          )}{' '}
          Days
        </div>
        <div className="text-sm text-muted-foreground">Longest Streak</div>
      </div>
    </div>
  );
}
