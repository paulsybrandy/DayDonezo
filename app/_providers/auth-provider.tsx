'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, onAuthStateChanged, getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
  login: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(app), async (user) => {
      if (user) {
        setUser(user);
      } else {
        toast.error('No user found');
        await fetch('/api/logout');
      }
    });

    return () => unsubscribe();
  }, []);

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
    onAuthStateChanged(getAuth(app), (user) => {
      setUser(user);
      router.refresh();
    });
  };

  const signOut = async () => {
    await logoutMutation.mutate();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    signOut,
    login,
    loading: logoutMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
