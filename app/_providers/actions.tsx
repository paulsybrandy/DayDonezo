'use server';

import prisma from '@/lib/prisma';
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
