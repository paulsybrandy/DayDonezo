'use client';

import React from 'react';
import { CardContent } from '../ui/card';
import dayjs from 'dayjs';
import { useUser } from '@/app/_providers/user-provider';
import RelativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(RelativeTime);
export default function OtherDetails() {
  const { user } = useUser();

  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        <div>
          <h5 className="text-md">Account Created At</h5>
          <p className="text-muted-foreground">
            {user?.metadata.creationTime} (
            {dayjs(user?.metadata.creationTime).fromNow()})
          </p>
        </div>
        <div>
          <h5 className="text-md">Last Sign In</h5>
          <p className="text-muted-foreground">
            {user?.metadata.lastSignInTime}
          </p>
        </div>
      </div>
    </CardContent>
  );
}
