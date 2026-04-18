import { create } from "zustand";
import {
  getNotificationsRequest,
  markEmployeeNotificationsReadRequest
} from "@/services/notificationService";
import { getErrorMessage } from "@/utils/formatters";

export const useNotificationStore = create((set) => ({
  pendingRequests: 0,
  processedUpdates: 0,
  loading: false,
  error: null,

  /**
   * Loads notification counters for the current user.
   * @returns {Promise<void>}
   */
  fetchNotifications: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getNotificationsRequest();
      set({
        pendingRequests: data.pendingRequests || 0,
        processedUpdates: data.processedUpdates || 0,
        loading: false
      });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  /**
   * Marks employee approval/rejection notifications as read.
   * @returns {Promise<void>}
   */
  markEmployeeRead: async () => {
    try {
      await markEmployeeNotificationsReadRequest();
      set({ processedUpdates: 0 });
    } catch (error) {
      set({ error: getErrorMessage(error) });
    }
  },

  /**
   * Clears notification counters.
   */
  reset: () => set({ pendingRequests: 0, processedUpdates: 0, error: null })
}));
