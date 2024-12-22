'use client';

import { CompletionData, useUserStore } from '@/store/userStore';
import React from 'react';

import {
  XAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Line,
  LabelList,
  LineChart,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { getPast12MonthsCompletionData } from '@/app/_providers/actions';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const getCompletionData = async () => {
  return await getPast12MonthsCompletionData().then(
    (result: CompletionData[]) => {
      return result;
    }
  );
};

const loadingCompletionData = [
  { monthIndex: 0, month: 'Jan', completedDays: 0, totalDays: 31 },
  { monthIndex: 1, month: 'Feb', completedDays: 0, totalDays: 28 },
  { monthIndex: 2, month: 'Apr', completedDays: 0, totalDays: 30 },
  { monthIndex: 3, month: 'Mar', completedDays: 0, totalDays: 31 },
  { monthIndex: 4, month: 'May', completedDays: 0, totalDays: 31 },
  { monthIndex: 5, month: 'Jun', completedDays: 0, totalDays: 30 },
  { monthIndex: 6, month: 'Jul', completedDays: 0, totalDays: 31 },
  { monthIndex: 7, month: 'Aug', completedDays: 0, totalDays: 31 },
  { monthIndex: 8, month: 'Sep', completedDays: 0, totalDays: 30 },
  { monthIndex: 9, month: 'Oct', completedDays: 0, totalDays: 31 },
  { monthIndex: 10, month: 'Nov', completedDays: 0, totalDays: 30 },
  { monthIndex: 11, month: 'Dec', completedDays: 0, totalDays: 31 },
];

export default function MonthlyCompletionChart() {
  const completionData = useUserStore((state) => state.completionData);
  const setCompletionData = useUserStore((state) => state.setCompletionData);

  if (!completionData) {
    setCompletionData(loadingCompletionData);
    (async () => {
      const result = await getCompletionData();
      setCompletionData(result);
    })();
  }

  const monthlyCompletionData = completionData!.map((item) => ({
    ...item,
    completionPercentage: Math.round(
      (item.completedDays / item.totalDays) * 100
    ),
  }));

  return (
    <>
      <ChartContainer config={chartConfig} className="hidden lg:block">
        <LineChart
          accessibilityLayer
          data={monthlyCompletionData}
          margin={{
            top: 20,
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={true}
            axisLine={true}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={true}
            content={<ChartTooltipContent indicator="line" />}
            formatter={(value) => ['Completion Rate ', `${value}%`]}
          />
          <Line
            dataKey="completionPercentage"
            type="linear"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{
              fill: 'var(--color-desktop)',
            }}
            activeDot={{
              r: 6,
            }}
          >
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
              formatter={(value: string) => [`${value}%`]}
            />
          </Line>
        </LineChart>
      </ChartContainer>
      <ChartContainer
        config={chartConfig}
        className="mx-auto block aspect-square max-h-[250px] lg:hidden"
      >
        <RadarChart data={monthlyCompletionData}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
            formatter={(value) => ['Completion Rate ', `${value}%`]}
          />
          <PolarGrid
            className="fill-[--color-desktop] opacity-20"
            // gridType="circle"
          />
          <PolarAngleAxis dataKey="month" />
          <Radar
            dataKey="completionPercentage"
            fill="var(--color-desktop)"
            fillOpacity={0.5}
            dot={{
              r: 4,
              fillOpacity: 1,
            }}
          />
        </RadarChart>
      </ChartContainer>
    </>
  );
}
