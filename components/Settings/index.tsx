import React from 'react';
import { Card, CardHeader, CardTitle } from '../ui/card';
import AccountDetailsForm from '../Forms/Settings/account-details-form';
import Preferences from '../Forms/Settings/preferences';

export default function SettingsComponent() {
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
      </div>
    </section>
  );
}
