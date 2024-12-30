import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip'; // Replace with your actual imports

// Mock types
interface Day {
  date: string;
  active: boolean;
}

interface StreakProps {
  streakData: Day[];
}

// Utility to generate random streak data
const generateRandomStreakData = (daysCount: number): Day[] => {
  const today = dayjs();
  return Array.from({ length: daysCount })
    .map((_, i) => {
      const date = today.subtract(i, 'day').toISOString();
      return {
        date,
        active: Math.random() < 0.5, // 50% chance for a day to be active
      };
    })
    .reverse(); // Reverse to keep dates in ascending order
};

const StreaksGrids: React.FC<StreakProps> = ({ streakData }) => {
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

// Usage example
const App: React.FC = () => {
  const randomStreakData = generateRandomStreakData(365); // Generate 30 days of random streaks

  return (
    <div className="App flex w-full items-center justify-center">
      <StreaksGrids streakData={randomStreakData} />
    </div>
  );
};

export default App;
