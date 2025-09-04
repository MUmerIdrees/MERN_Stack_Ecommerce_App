import { ArrowLeft, Loader2, Mail, SendHorizonal, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const { forgotPassword, isSendingOtp } = useAuthStore();

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email, navigate);
        localStorage.setItem("email", email);
    }

    return (
        <div className="w-full max-w-sm space-y-6 rounded-sm backdrop-blur-lg p-6 shadow-gray-400 shadow-2xl">
            {/* LOGO */}
            <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                    <div className="lg:hidden size-12 rounded-xl bg-black/10 flex items-center justify-center 
                    group-hover:bg-black/20 transition-colors">
                        <ShoppingBag className="size-6 text-black" />
                    </div>
                    <h1 className="text-2xl font-bold mt-2">Find Your Account</h1>
                    <p className="text-base-content/60">Enter your registered email</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label mb-1">
                        <span className="label-text font-medium">Email</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                            <Mail className="size-5 text-base-content/40" />
                        </div>
                        <input 
                            type="email"
                            className={`input input-bordered w-full pl-10 focus:border-none`}
                            placeholder="Enter your email to reset password"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-neutral w-full" disabled={isSendingOtp}>
                    {isSendingOtp ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        <>
                            SEND OTP
                            <SendHorizonal className="size-5 text-white" />
                        </>
                    )}
                </button>
            </form>

            <button onClick={() => navigate('/login')} className="btn btn-outline border-gray-300 w-full cursor-pointer">
                <ArrowLeft className="size-5 text-base-content/40" />
                Back To Login
            </button>
        </div>
    );
};

export default ForgotPassword;
