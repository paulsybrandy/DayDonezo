'use server';

import prisma from '@/lib/prisma';
import { CompletionData } from '@/store/userStore';
import dayjs from 'dayjs';

export async function saveUserToDb({
  uid,
  created_at,
}: {
  uid: string;
  created_at: string;
}) {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        uid,
      },
    });
    if (userExists) {
      console.log('User already exists');
      return true;
    }
    const user = await prisma.user.create({
      data: {
        uid,
        created_at: dayjs(created_at).toISOString(),
        current_streak: 0,
        max_streak: 0,
      },
    });
    if (user) {
      return true;
    }
  } catch {
    throw new Error('Error saving user to database');
  }
}

export async function getUserFromDb(uid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uid,
      },
      include: {
        Entries: {
          include: {
            Tags: true,
          },
        },
      },
    });
    return user;
  } catch {
    throw new Error('Error fetching user from database');
  }
}

export async function getPast12MonthsCompletionData() {
  const currentDate = dayjs();

  const startDate = currentDate.subtract(12, 'month').startOf('month');

  const entries = await prisma.entries.findMany({
    where: {
      created_at: {
        gte: startDate.toDate(),
      },
    },
    select: {
      created_at: true,
    },
  });

  const monthlyData: { [key: string]: Set<number> } = {};

  entries.forEach((entry) => {
    const yearMonth = dayjs(entry.created_at).format('YYYY-MM');
    const day = dayjs(entry.created_at).date();

    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = new Set();
    }

    monthlyData[yearMonth].add(day);
  });

  const months = [
    { month: 'Jan', totalDays: 31 },
    { month: 'Feb', totalDays: 28 },
    { month: 'Mar', totalDays: 31 },
    { month: 'Apr', totalDays: 30 },
    { month: 'May', totalDays: 31 },
    { month: 'Jun', totalDays: 30 },
    { month: 'Jul', totalDays: 31 },
    { month: 'Aug', totalDays: 31 },
    { month: 'Sep', totalDays: 30 },
    { month: 'Oct', totalDays: 31 },
    { month: 'Nov', totalDays: 30 },
    { month: 'Dec', totalDays: 31 },
  ];

  const currentYear = currentDate.year();

  if (
    (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
    currentYear % 400 === 0
  ) {
    months[1].totalDays = 29;
  }

  const result = months.map((monthData, index) => {
    const yearMonth = `${currentYear}-${String(index + 1).padStart(2, '0')}`;

    const completedDays = monthlyData[yearMonth]
      ? monthlyData[yearMonth].size
      : 0;

    return {
      month: monthData.month,
      completedDays,
      totalDays: monthData.totalDays,
    };
  });

  return result as CompletionData[];
}
