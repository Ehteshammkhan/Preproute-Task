import { create } from "zustand";

import { storage } from "../utils";

import { STORAGE_KEYS } from "../constants/app.constants";

interface User {
  id: string;
  userId: string;
  name: string;
  role: string;
}

interface AuthStore {
  token: string | null;

  user: User | null;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    token:
      storage.get<string>(
        STORAGE_KEYS.TOKEN
      ),

    user:
      storage.get<User>(
        STORAGE_KEYS.USER
      ),

    login: (token, user) => {
      storage.set(
        STORAGE_KEYS.TOKEN,
        token
      );

      storage.set(
        STORAGE_KEYS.USER,
        user
      );

      set({
        token,
        user,
      });
    },

    logout: () => {
      storage.remove(
        STORAGE_KEYS.TOKEN
      );

      storage.remove(
        STORAGE_KEYS.USER
      );

      set({
        token: null,
        user: null,
      });
    },
  }));