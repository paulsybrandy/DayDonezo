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

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import StreakData from './streak-data';
import MonthlyCompletionChart from './monthly-completion-chart';

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
      { month: 'Jan', completedDays: 0, totalDays: 31 },
      { month: 'Feb', completedDays: 0, totalDays: 29 },
      { month: 'Mar', completedDays: 0, totalDays: 31 },
      { month: 'Apr', completedDays: 0, totalDays: 30 },
      { month: 'May', completedDays: 0, totalDays: 31 },
      { month: 'Jun', completedDays: 0, totalDays: 30 },
      { month: 'Jul', completedDays: 0, totalDays: 31 },
      { month: 'Aug', completedDays: 0, totalDays: 31 },
      { month: 'Sep', completedDays: 0, totalDays: 30 },
      { month: 'Oct', completedDays: 1, totalDays: 31 },
      { month: 'Nov', completedDays: 1, totalDays: 30 },
      { month: 'Dec', completedDays: 3, totalDays: 31 },
    ],
  };

  return (
    <div className="w-full flex-1 space-y-4 overflow-auto p-4 py-4 lg:px-16">
      <div className="space-y-4">
        {/* Daily Streak Card */}
        <Card className="row-span-1">
          <CardHeader>
            <CardTitle>Daily Entry Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <StreakData />

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
            <MonthlyCompletionChart />
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
