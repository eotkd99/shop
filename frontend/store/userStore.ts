import { create } from "zustand";

type User = {
  id: number;
  username: string;
  email: string;
};

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  logout: () => void;
};

type SearchState = {
  searchKeyword: string;
  setSearchKeyword: (kw: string) => void;
};

export const useUserStore = create<UserState & SearchState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  logout: () => set({ user: null, isAuthenticated: false }),
  searchKeyword: "",
  setSearchKeyword: (kw) => set({ searchKeyword: kw }),
}));
