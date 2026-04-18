import { create } from "zustand";
import {
  approveLeaveAdjustmentRequest,
  approveLeaveRequest,
  getAdminAdjustmentsRequest,
  getAdminLeavesRequest,
  getEmployeeDashboardRequest,
  getEmployeeHistoryRequest,
  rejectLeaveAdjustmentRequest,
  rejectLeaveRequest
} from "@/services/adminService";
import {
  cancelLeaveRequest,
  createLeaveAdjustmentRequest,
  createLeaveRequest,
  getMyLeaveAdjustmentsRequest,
  getMyLeavesRequest,
  getMyLeaveSummaryRequest
} from "@/services/leaveService";
import { getErrorMessage } from "@/utils/formatters";

export const useLeaveStore = create((set, get) => ({
  myLeaves: [],
  summary: null,
  pendingCount: 0,
  myAdjustments: [],
  adminLeaves: [],
  adminAdjustments: [],
  employeeRows: [],
  selectedEmployeeHistory: null,
  adminFilters: {},
  loading: false,
  submitting: false,
  actionId: null,
  error: null,

  /**
   * Loads the authenticated employee leave history.
   * @returns {Promise<void>}
   */
  fetchMyLeaves: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getMyLeavesRequest();
      set({ myLeaves: data.leaves || [], loading: false });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  /**
   * Loads the authenticated employee leave adjustment request history.
   * @returns {Promise<void>}
   */
  fetchMyAdjustments: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getMyLeaveAdjustmentsRequest();
      set({ myAdjustments: data.adjustments || [], loading: false });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  /**
   * Loads the authenticated employee dashboard summary.
   * @returns {Promise<void>}
   */
  fetchSummary: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getMyLeaveSummaryRequest();
      set({
        summary: data.summary,
        pendingCount: data.pendingCount || 0,
        loading: false
      });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  /**
   * Submits a new leave request.
   * @param {object} payload Leave request payload.
   * @returns {Promise<object>} API response.
   */
  applyLeave: async (payload) => {
    set({ submitting: true, error: null });

    try {
      const data = await createLeaveRequest(payload);
      set((state) => ({
        myLeaves: [data.leave, ...state.myLeaves],
        pendingCount: state.pendingCount + 1,
        submitting: false
      }));
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ submitting: false, error: message });
      throw new Error(message);
    }
  },

  /**
   * Cancels an employee-owned pending leave request.
   * @param {string} id Leave id.
   * @returns {Promise<object>} API response.
   */
  cancelLeave: async (id) => {
    set({ actionId: id, error: null });

    try {
      const data = await cancelLeaveRequest(id);
      set((state) => ({
        myLeaves: state.myLeaves.filter((leave) => leave._id !== id),
        actionId: null
      }));
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ actionId: null, error: message });
      throw new Error(message);
    }
  },

  /**
   * Submits an extension or shortening request for an existing leave.
   * @param {string} id Leave request id.
   * @param {object} payload Adjusted date range and reason.
   * @returns {Promise<object>} API response.
   */
  requestLeaveAdjustment: async (id, payload) => {
    set({ actionId: id, error: null });

    try {
      const data = await createLeaveAdjustmentRequest(id, payload);
      set((state) => ({
        myAdjustments: [data.adjustment, ...state.myAdjustments],
        pendingCount: state.pendingCount + 1,
        actionId: null
      }));
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ actionId: null, error: message });
      throw new Error(message);
    }
  },

  /**
   * Loads admin leave requests with filters.
   * @param {object} filters Query filters.
   * @returns {Promise<void>}
   */
  fetchAdminLeaves: async (filters = get().adminFilters) => {
    set({ loading: true, error: null, adminFilters: filters });

    try {
      const data = await getAdminLeavesRequest(filters);
      set({ adminLeaves: data.leaves || [], loading: false });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  /**
   * Loads admin leave adjustment requests with filters.
   * @param {object} filters Query filters.
   * @returns {Promise<void>}
   */
  fetchAdminAdjustments: async (filters = get().adminFilters) => {
    set({ loading: true, error: null, adminFilters: filters });

    try {
      const data = await getAdminAdjustmentsRequest(filters);
      set({ adminAdjustments: data.adjustments || [], loading: false });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  /**
   * Approves a leave request and updates the admin list.
   * @param {string} id Leave id.
   * @returns {Promise<object>} API response.
   */
  approveLeave: async (id) => {
    set({ actionId: id, error: null });

    try {
      const data = await approveLeaveRequest(id);
      set((state) => ({
        adminLeaves: state.adminLeaves.map((leave) => (leave._id === id ? data.leave : leave)),
        actionId: null
      }));
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ actionId: null, error: message });
      throw new Error(message);
    }
  },

  /**
   * Rejects a leave request and updates the admin list.
   * @param {string} id Leave id.
   * @param {string} reason Optional rejection reason.
   * @returns {Promise<object>} API response.
   */
  rejectLeave: async (id, reason) => {
    set({ actionId: id, error: null });

    try {
      const data = await rejectLeaveRequest(id, reason);
      set((state) => ({
        adminLeaves: state.adminLeaves.map((leave) => (leave._id === id ? data.leave : leave)),
        actionId: null
      }));
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ actionId: null, error: message });
      throw new Error(message);
    }
  },

  /**
   * Approves a leave adjustment request and updates the admin list.
   * @param {string} id Adjustment id.
   * @returns {Promise<object>} API response.
   */
  approveAdjustment: async (id) => {
    set({ actionId: id, error: null });

    try {
      const data = await approveLeaveAdjustmentRequest(id);
      set((state) => ({
        adminAdjustments: state.adminAdjustments.map((adjustment) => (
          adjustment._id === id ? data.adjustment : adjustment
        )),
        actionId: null
      }));
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ actionId: null, error: message });
      throw new Error(message);
    }
  },

  /**
   * Rejects a leave adjustment request and updates the admin list.
   * @param {string} id Adjustment id.
   * @param {string} reason Optional rejection reason.
   * @returns {Promise<object>} API response.
   */
  rejectAdjustment: async (id, reason) => {
    set({ actionId: id, error: null });

    try {
      const data = await rejectLeaveAdjustmentRequest(id, reason);
      set((state) => ({
        adminAdjustments: state.adminAdjustments.map((adjustment) => (
          adjustment._id === id ? data.adjustment : adjustment
        )),
        actionId: null
      }));
      return data;
    } catch (error) {
      const message = getErrorMessage(error);
      set({ actionId: null, error: message });
      throw new Error(message);
    }
  },

  /**
   * Loads admin employee dashboard rows.
   * @returns {Promise<void>}
   */
  fetchEmployeeDashboard: async () => {
    set({ loading: true, error: null });

    try {
      const data = await getEmployeeDashboardRequest();
      set({ employeeRows: data.employees || [], loading: false });
    } catch (error) {
      set({ loading: false, error: getErrorMessage(error) });
    }
  },

  /**
   * Loads leave history for a selected employee.
   * @param {string} employeeId Employee id.
   * @returns {Promise<void>}
   */
  fetchEmployeeHistory: async (employeeId) => {
    set({ actionId: employeeId, error: null });

    try {
      const data = await getEmployeeHistoryRequest(employeeId);
      set({ selectedEmployeeHistory: data, actionId: null });
    } catch (error) {
      set({ actionId: null, error: getErrorMessage(error) });
    }
  },

  /**
   * Clears selected employee detail.
   */
  clearSelectedEmployee: () => set({ selectedEmployeeHistory: null })
}));
