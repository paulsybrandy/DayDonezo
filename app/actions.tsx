'use server';

import { getUser, isUserAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { decryptData } from '@/lib/utils';
import { CompletionData } from '@/store/userStore';
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
    return { success: false, message: 'User not found' };
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
    return { success: false, message: 'Entry already exists for today' };
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
      include: {
        Tags: true,
      },
    });

    if (entry) {
      const userData = await prisma.user.findUnique({
        where: {
          uid: authUser.uid,
        },
        select: {
          max_streak: true,
          current_streak: true,
          last_entry_at: true,
        },
      });
      if (userData) {
        const lastEntryDate = userData.last_entry_at
          ? dayjs(userData.last_entry_at)
          : dayjs();
        const diffInHours = lastEntryDate.diff(entry.created_at, 'hours');

        let user;
        if (Math.abs(diffInHours) < 24) {
          if (userData.current_streak + 1 > userData.max_streak) {
            user = await prisma.user.update({
              where: {
                uid: authUser.uid,
              },
              data: {
                current_streak: userData.current_streak + 1,
                max_streak: userData.current_streak + 1,
                last_entry_at: dayjs().toISOString(),
              },
            });
          } else {
            user = await prisma.user.update({
              where: {
                uid: authUser.uid,
              },
              data: {
                current_streak: userData.current_streak + 1,
                last_entry_at: dayjs().toISOString(),
              },
            });
          }
        } else {
          user = await prisma.user.update({
            where: {
              uid: authUser.uid,
            },
            data: {
              current_streak: 1,
              last_entry_at: dayjs().toISOString(),
            },
          });
        }
        return { success: true, user, entry };
      }
    }
  } catch {
    return { success: false, message: 'Error saving data to database' };
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

  const decoder = new TextDecoder();
  const contentString = decoder.decode(record?.content);

  if (!record) throw new Error('Content not found!');

  const decrypted = decryptData(contentString);
  return decrypted;
}

export async function saveFeedback(data: string) {
  const authUser = await getUser();
  if (!authUser) {
    throw new Error('User not found');
  }

  try {
    const feedback = await prisma.feedback.create({
      data: {
        uid: authUser.uid,
        message: data,
      },
    });
    return feedback;
  } catch {
    throw new Error('Error saving feedback to database');
  }
}

export async function updateUserAvatarSeed(avatarSeed: string) {
  const authUser = await getUser();
  if (!authUser) {
    throw new Error('User not found');
  }

  try {
    const user = await prisma.user.update({
      where: {
        uid: authUser.uid,
      },
      data: {
        avatar_seed: avatarSeed,
      },
    });

    return user;
  } catch {
    throw new Error('Error updating user details');
  }
}
