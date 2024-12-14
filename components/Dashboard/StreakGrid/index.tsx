import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface StreakDay {
  date: string;
  active: boolean;
}

interface StreakProps {
  streakData: StreakDay[];
}

const StreaksGrids: React.FC<StreakProps> = ({ streakData }) => {
  const weeks = Math.ceil(streakData.length / 7);

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
                        aria-label={`${day.active ? 'Active' : 'Inactive'} on ${day.date}`}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {day.active ? 'Active' : 'Inactive'} on {day.date}
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
