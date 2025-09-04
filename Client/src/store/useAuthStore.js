import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-toastify';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isSendingOtp: false,
    otpExpireTime: null,
    isOtpVerify: false,
    timerKey: null,
    isPasswordUpdate: false,
    isEmailVerify: false,
    emailForOtp: null,

    isCheckingAuth: true,

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
           const res = await axiosInstance.get('/auth/check');
           set({ authUser: res.data });
        } catch (error) {
            console.error('Error checking auth:', error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data, navigate) => {
        set({ isSigningUp: true });
        try {
            await axiosInstance.post('/auth/signup', data);
            set({ emailForOtp: data.email });
            toast.success("Account created successfully. Please verify your email.");
            navigate('/verifyemail');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    verifyEmail: async (otp) => {
        set({ isEmailVerify: true });
        try {
           const res = await axiosInstance.post('/auth/email/verify', { otp });
           const user = res.data;
           set({ authUser: user });
           set({ emailForOtp: null });
           toast.success("Email verified successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isEmailVerify: false });
        }
    },

    logIn: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', data);
            const user = res.data?.user;
            console.log("Login User:", user);
            set({ authUser: user });
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logOut: async (navigate) => {
        try {
            await axiosInstance.post('/auth/logout');
            navigate('/login');
            set({ authUser: null });
            toast.success("Logout Successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    forgotPassword: async (email, navigate) => {
        set({ isSendingOtp: true });
        try {
            await axiosInstance.post('/auth/password/forgot', { email });
            toast.success("OTP send successfully to your email");
            navigate('/verifyotp');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSendingOtp: false });
        }
    },

    Timer: async (email, type) => {
        try {
            const res = await axiosInstance.post('/auth/otp/time', { email, type });
            const time = res?.data?.time;
            if(time){
                set({ otpExpireTime: time });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    },

    verifyOtp: async (otp, navigate) => {
        set({ isOtpVerify: true });
        try {
           await axiosInstance.post('auth/otp/verify', { otp });
           toast.success("OTP verified successfully");
           navigate('/updatepassword'); 
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isOtpVerify: false });
        }
    },

    resendOtp: async (email) => {
        set({ isSendingOtp: true });
        try {
            await axiosInstance.post('/auth/password/forgot', { email });
            toast.success("OTP send successfully to your email");
            await get().Timer(email);
            set({ timerKey: Date.now() });
        } catch (error) {
            toast.error(error.response.data.message);
            set({ otpExpireTime: null });
        } finally {
            set({ isSendingOtp: false });
        }
    },

    updatePassword: async (password, navigate) => {
        set({ isPasswordUpdate: true });
        try {
            await axiosInstance.put('/auth/password/update', { password });
            toast.success("Password updated successfully");
            localStorage.removeItem('email');
            navigate('/login');
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isPasswordUpdate: false });
        }
    },

    validateResetToken: async(navigate) => {
        try {
            await axiosInstance.get('/auth/validate-reset-token');
        } catch (error) {
            navigate('/login');
        }
    }
}));