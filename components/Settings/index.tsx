'use client';

import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/card';
import AccountDetailsForm from '../Forms/Settings/account-details-form';
import Preferences from '../Forms/Settings/preferences';
import OtherDetails from './other-details';
import Loader from '../Layout/loader';
import { useUser } from '@/app/_providers/user-provider';
import { useUserStore } from '@/store/userStore';

export default function SettingsComponent() {
  const { user: authUser } = useUser();
  const user = useUserStore((state) => state.user);

  if (!authUser && !user) {
    return <Loader />;
  }

  return (
    <section className="flex flex-1 justify-center space-y-4 overflow-auto p-4 py-4 lg:px-16">
      <div className="w-full max-w-sm space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <AccountDetailsForm />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <Preferences />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Other Details</CardTitle>
          </CardHeader>
          <OtherDetails />
        </Card>
      </div>
    </section>
  );
}
