'use client';

import React, { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUserStore } from '@/store/userStore';
import dayjs from 'dayjs';

interface StreakDay {
  date: string;
  active: boolean;
}

interface StreakProps {
  streakData: StreakDay[];
}

const StreaksGrids: React.FC<StreakProps> = ({ streakData }) => {
  const entries = useUserStore((state) => state.user?.Entries);

  streakData.forEach((day) => {
    const dayFormatted = dayjs(day.date).format('DD/MM/YYYY');
    day.active =
      entries?.some(
        (entry) => dayjs(entry.created_at).format('DD/MM/YYYY') === dayFormatted
      ) ?? false;
  });

  const weeks = useMemo(() => Math.ceil(streakData.length / 7), [streakData]);

  return (
    <div className="w-full overflow-x-auto text-center">
      <div className="inline-flex flex-col gap-1 p-4">
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {Array.from({ length: weeks }).map((_, colIndex) => {
              const dayIndex = colIndex * 7 + rowIndex;
              const day = streakData[dayIndex];

              if (!day) return <div key={colIndex} className="h-3 w-3" />;

              return (
                <TooltipProvider key={colIndex}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={`h-3 w-3 rounded-sm ${
                          day.active
                            ? 'bg-[hsl(349,100%,55.5%)]'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        aria-label={`${day.active ? 'Win' : 'Unable to win'} on ${dayjs(day.date).format('D MMM YYYY')}`}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {day.active ? 'Win' : 'Unable to win'} on{' '}
                        {dayjs(day.date).format('D MMM YYYY')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreaksGrids;
