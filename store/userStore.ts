import { create } from 'zustand';

interface User {
  uid: string;
  created_at: Date;
  current_streak: number;
  max_streak: number;
  last_entry_at: Date | null;
  Entries: Entries[];
}

interface Entries {
  id: number;
  uid: string;
  content: string;
  created_at: Date;
  Tags: Tags[];
}

interface Tags {
  id: number;
  name: string;
  color: string;
  created_at: Date;
  entry_id: number;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
