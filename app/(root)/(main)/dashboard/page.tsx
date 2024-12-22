import DashboardComponent from '@/components/Dashboard';
import React from 'react';

const generateSampleData = () => {
  const data = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      active: false,
    });
  }
  return data;
};

export default async function Dashboard() {
  const streakData = generateSampleData();
  return <DashboardComponent streakData={streakData} />;
}
