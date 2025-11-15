import {create} from "zustand";
import axios from "axios";
const BASE_URL = "http://localhost:5000/api/auth";
export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: false,
    EmailVerified: false,


    signup: async (email, password,name) => {
        set({ isLoading: true , error: null});
        try {
            const response = await axios.post(`${BASE_URL}/sign-up`, { email:email, password:password, name:name });
            set({ user: response.data.user, isAuthenticated: true, EmailVerified: false });
        } catch (error) {
            console.log(error);
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
    verifyEmail: async (verificationCode) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${BASE_URL}/verify-email`, { verificationCode });
            set({ user: response.data.user, isAuthenticated: true, EmailVerified: true });
        } catch (error) {
            console.log(error);
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
    login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${BASE_URL}/login`, { email, password }, { withCredentials: true });
			set({
				isAuthenticated: true,
				user: response.data.user,
				error: null,
				isLoading: false,
                EmailVerified: true
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.get(`${BASE_URL}/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get(`${BASE_URL}/check-auth`, { withCredentials: true });
            set({ user: response.data.user, isAuthenticated: true , EmailVerified: true});
        } catch (error) {
            console.log(error);
            set({ user: null, isAuthenticated: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try{
            set({user: null, isAuthenticated: false});
            await axios.post(`${BASE_URL}/forgot-password`, { email });
        }catch (error) {
            console.log(error);
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },
    resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null, isAuthenticated: false, user: null ,});
        try {
            await axios.post(`${BASE_URL}/reset-password/${token}`, { newPassword });
        } catch (error) {
            console.log(error);
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    },

}));
