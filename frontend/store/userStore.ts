import { create } from "zustand";

type User = { id: number; username: string; email: string };

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  logout: () => void;
};

type SearchState = {
  searchKeyword: string;
  selectedSearchCategory: string;
  setSearchKeyword: (kw: string) => void;
  setSelectedSearchCategory: (cat: string) => void;
};

type CategoryState = {
  depthOneCategories: { id: number; name: string }[];
  setDepthOneCategories: (cats: { id: number; name: string }[]) => void;
};

export const useUserStore = create<UserState & SearchState & CategoryState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  logout: () => set({ user: null, isAuthenticated: false }),

  searchKeyword: "",
  selectedSearchCategory: "all",
  setSearchKeyword: (kw) => set({ searchKeyword: kw }),
  setSelectedSearchCategory: (cat) => set({ selectedSearchCategory: cat }),

  depthOneCategories: [],
  setDepthOneCategories: (cats) => set({ depthOneCategories: cats }),
}));
