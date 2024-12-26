'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  User,
  onAuthStateChanged,
  getAuth,
  UserCredential,
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getUserFromDb, saveUserToDb } from '../actions';
import { useUserStore } from '@/store/userStore';

interface UserContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  login: () => void;
  saveUser: (user: UserCredential['user']) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const setUser = useUserStore((state) => state.setUser);

  const [user, setAuthUser] = useState<User | null>(null);
  const router = useRouter();

  const updateUser = useCallback(
    async (user: User | null) => {
      if (user) {
        setAuthUser(user);
        const userDetails = await getUserFromDb(user.uid);
        setUser(userDetails);
      } else {
        toast.error('No user found');
        await fetch('/api/logout');
      }
    },
    [setAuthUser, setUser]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), updateUser);
    return () => unsubscribe();
  }, [updateUser]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/logout');
    },
    onSuccess: () => {
      router.push('/');
      router.refresh();
    },
  });

  const login = async () => {
    onAuthStateChanged(getAuth(app), async (user) => {
      if (user) {
        setAuthUser(user);

        const userDetails = await getUserFromDb(user.uid);
        console.log(userDetails);
        setUser(userDetails);
        router.refresh();
      } else {
        toast.error('No user found');
        await fetch('/api/logout');
      }
    });
  };

  const signOut = async () => {
    await logoutMutation.mutate();
    setAuthUser(null);
  };

  const saveUser = async (user: UserCredential['user']) => {
    if (user) {
      await saveUserToDb({
        uid: user.uid,
        created_at: user.metadata.creationTime?.toString() || '',
        name: user.displayName || '',
      });
    } else {
      toast.error('No user found');
    }
  };

  const value: UserContextType = {
    user,
    signOut,
    login,
    saveUser,
    loading: logoutMutation.isPending,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
