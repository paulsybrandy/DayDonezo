'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function AnalyticsComponent() {
  const achievementData = {
    dailyStreak: {
      currentStreak: 1,
      longestStreak: 12,
      dailyEntries: [
        { date: '2024-01-01', completed: true },
        { date: '2024-01-02', completed: true },
        { date: '2024-01-03', completed: true },
        { date: '2024-01-04', completed: true },
        { date: '2024-01-05', completed: true },
        { date: '2024-01-06', completed: true },
        { date: '2024-01-08', completed: true },
      ],
    },
    winCategories: [
      { name: 'Personal Growth', value: 25 },
      { name: 'Work', value: 35 },
      { name: 'Health', value: 20 },
      { name: 'Relationships', value: 20 },
    ],
    monthlyCompletionRate: [
      { month: 'Jan', completedDays: 18, totalDays: 31 },
      { month: 'Feb', completedDays: 10, totalDays: 29 },
      { month: 'Mar', completedDays: 6, totalDays: 31 },
      { month: 'Apr', completedDays: 15, totalDays: 30 },
      { month: 'May', completedDays: 21, totalDays: 31 },
      { month: 'Jun', completedDays: 10, totalDays: 30 },
      { month: 'Jul', completedDays: 16, totalDays: 31 },
      { month: 'Aug', completedDays: 19, totalDays: 31 },
      { month: 'Sep', completedDays: 7, totalDays: 30 },
      { month: 'Oct', completedDays: 15, totalDays: 31 },
      { month: 'Nov', completedDays: 5, totalDays: 30 },
      { month: 'Dec', completedDays: 10, totalDays: 31 },
    ],
  };

  const monthlyCompletionData = achievementData.monthlyCompletionRate.map(
    (item) => ({
      ...item,
      completionPercentage: (
        (item.completedDays / item.totalDays) *
        100
      ).toFixed(0),
    })
  );

  return (
    <div className="w-full flex-1 space-y-4 overflow-auto p-4 py-4 lg:px-16">
      <div className="space-y-4">
        {/* Daily Streak Card */}
        <Card className="row-span-1">
          <CardHeader>
            <CardTitle>Daily Entry Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-green-600">
                  {achievementData.dailyStreak.currentStreak} Days
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Streak
                </div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-blue-600">
                  {achievementData.dailyStreak.longestStreak} Days
                </div>
                <div className="text-sm text-muted-foreground">
                  Longest Streak
                </div>
              </div>
            </div>

            {/* Daily Entry Tracking */}
            <div className="flex space-x-2">
              {achievementData.dailyStreak.dailyEntries.map((entry, index) => (
                <div
                  key={index}
                  className="relative"
                  title={`${entry.date} - ${entry.completed ? 'Completed' : 'Missed'}`}
                >
                  {entry.completed ? (
                    <CheckCircle2 className="text-green-500" />
                  ) : (
                    <AlertCircle className="text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Win Categories Pie Chart */}
        {/* <Card className="row-span-1 h-full">
          <CardHeader>
            <CardTitle>Win Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={achievementData.winCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {achievementData.winCategories.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Monthly Completion Rate</CardTitle>
            <CardDescription>January - December 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="lg:block">
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
                  tickLine={false}
                  axisLine={false}
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
                    position="right"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: string) => [`${value}%`]}
                  />
                </Line>
              </LineChart>
              {/* <BarChart accessibilityLayer data={monthlyCompletionData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  formatter={(value) => ['Completion Rate ', `${value}%`]}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Bar
                  dataKey="completionPercentage"
                  className="opacity-95"
                  fill="var(--color-desktop)"
                  radius={8}
                  label={({ x, y, width, value }) => (
                    <text
                      x={x + width / 2}
                      y={y}
                      dy={-10}
                      textAnchor="middle"
                      fill="#666"
                    >
                      {value}%
                    </text>
                  )}
                />
              </BarChart> */}
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
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            {/* <div className="flex gap-2 font-medium leading-none">
              {monthlyCompletionData.reduce((acc, it) => {
                return it.month + acc;
              }, 0)}
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div> */}
            <div className="leading-none text-muted-foreground">
              Showing monthly completions
            </div>
          </CardFooter>
        </Card>
        <p>More adding soon!📊</p>
      </div>
    </div>
  );
}
