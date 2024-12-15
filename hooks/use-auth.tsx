import { app } from '@/lib/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  function setNewUser(usr: User) {
    console.log('called');
    setUser(usr);
  }

  return { user, setNewUser };
};
