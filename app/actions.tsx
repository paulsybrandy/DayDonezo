'use server';

import { getUser, isUserAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { decryptData } from '@/lib/utils';
import { CompletionData } from '@/store/userStore';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

export async function saveUserToDb({
  uid,
  created_at,
  name,
}: {
  uid: string;
  created_at: string;
  name: string;
}) {
  try {
    const userExists = await prisma.user.findUnique({
      where: {
        uid,
      },
    });
    if (userExists) {
      return true;
    }

    const user = await prisma.user.create({
      data: {
        uid,
        created_at: dayjs(created_at).toISOString(),
        current_streak: 0,
        max_streak: 0,
        avatar_seed: name,
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
  const isAuth = await isUserAuth();

  if (!isAuth) {
    throw new Error('User not authenticated');
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        uid,
      },
      include: {
        Entries: {
          select: {
            created_at: true,
          },
        },
      },
    });

    return user;
  } catch {
    throw new Error('Error fetching user from database');
  }
}

export async function getPast12MonthsCompletionData(uid: string) {
  const isAuth = await isUserAuth();

  if (!isAuth) {
    throw new Error('User not authenticated');
  }
  try {
    const currentDate = dayjs();
    const startDate = currentDate.subtract(12, 'month').startOf('month');

    const entries = await prisma.entries.findMany({
      where: {
        uid,
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
  } catch {
    throw new Error('Error fetching past 12 months completion data');
  }
}

export async function getUserEntries(uid: string) {
  const isAuth = await isUserAuth();

  if (!isAuth) {
    throw new Error('User not authenticated');
  }

  try {
    const entries = await prisma.entries.findMany({
      where: {
        uid,
      },
      include: {
        Tags: true,
      },
    });

    return entries;
  } catch {
    throw new Error('Error fetching user entries');
  }
}

export async function saveEntryToDb(
  data: string,
  tags: { name: string; color: string }[]
) {
  const authUser = await getUser();

  if (!authUser) {
    throw new Error('User not found');
  }

  const todayISODate = dayjs().format('DD.MM.YYYY');

  const alreadyExists = await prisma.entries.findFirst({
    where: {
      uid: authUser.uid,
    },
    select: {
      created_at: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  if (
    alreadyExists?.created_at &&
    dayjs(alreadyExists?.created_at).format('DD.MM.YYYY') === todayISODate
  ) {
    throw new Error('Entry already exists for today');
  }

  try {
    const entry = await prisma.entries.create({
      data: {
        uid: authUser.uid,
        content: Buffer.from(data, 'utf-8'),
        Tags: {
          create: tags.map((tag: { name: string; color: string }) => ({
            name: tag.name,
            color: tag.color,
          })),
        },
      },
    });

    return entry;
  } catch {
    throw new Error('Error saving data to database');
  }
}

export async function getEditorContent() {
  const authUser = await getUser();
  if (!authUser) {
    throw new Error('User not found');
  }

  const record = await prisma.entries.findFirst({
    where: { uid: authUser.uid },
  });

  const columnSize = await prisma.$queryRaw<{ total_size: string }[]>(
    Prisma.sql`SELECT pg_size_pretty(sum(octet_length("content"))) AS total_size FROM "public"."Entries"`
  );

  console.log('Column Size:', columnSize[0]?.total_size);

  const decoder = new TextDecoder();
  const contentString = decoder.decode(record?.content);

  console.log('Converted Content:', contentString);

  if (!record) throw new Error('Content not found!');
  console.log(record.content.toString());
  const decrypted = decryptData(contentString);
  return decrypted;
}
