'use client';

import { useUserStore } from '@/store/userStore';
import React, { useRef } from 'react';

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
import { getPast12MonthsCompletionData } from '@/app/actions';
import { useMutation } from '@tanstack/react-query';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function MonthlyCompletionChart() {
  const user = useUserStore((state) => state.user);
  const completionData = useUserStore((state) => state.completionData);
  const setCompletionData = useUserStore((state) => state.setCompletionData);

  const fetchCompletionDataRef = useRef(false);

  const getCompletionDataMutation = useMutation({
    mutationFn: async () => {
      return await getPast12MonthsCompletionData(user?.uid ?? '').then(
        (result) => {
          if (result.success) {
            return result.result;
          }
        }
      );
    },
    onSuccess: (result) => {
      if (result) {
        setCompletionData(result);
      }
    },
  });

  if (!completionData && user?.uid && !fetchCompletionDataRef.current) {
    fetchCompletionDataRef.current = true;
    getCompletionDataMutation.mutate();
  }

  const monthlyCompletionData = completionData?.map((item) => ({
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
