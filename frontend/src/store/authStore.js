import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginRequest, meRequest } from "@/services/authService";
import { getErrorMessage } from "@/utils/formatters";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      /**
       * Authenticates a user and stores the token/profile.
       * @param {object} credentials Login credentials.
       * @returns {Promise<object>} Authenticated user.
       */
      login: async (credentials) => {
        set({ loading: true, error: null });

        try {
          const data = await loginRequest(credentials);
          set({ token: data.token, user: data.user, loading: false });
          return data.user;
        } catch (error) {
          const message = getErrorMessage(error);
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      /**
       * Refreshes the persisted user profile from the API.
       * @returns {Promise<void>}
       */
      hydrateMe: async () => {
        if (!get().token) return;

        try {
          const data = await meRequest();
          set({ user: data.user });
        } catch (_error) {
          set({ token: null, user: null });
        }
      },

      /**
       * Clears the current session.
       */
      logout: () => {
        set({ token: null, user: null, error: null });
      }
    }),
    {
      name: "lms-auth",
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
);
