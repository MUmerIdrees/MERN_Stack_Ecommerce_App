import { ArrowLeft, Loader2, Lock, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
 
const UpdatePassword = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');

    const { updatePassword, isPasswordUpdate, validateResetToken } = useAuthStore();

    useEffect(() => {
        const verifyResetToken = async () => {
            await validateResetToken(navigate);
        }

        verifyResetToken();
    }, []);

    const validatePassword = () => {
        if(!password.trim()) {
            return toast.error("Password is required");
        }
        if(password.length < 6) {
            return toast.error("Password must be atleast 6 characters");
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = validatePassword();

        if(success === true) {
            await updatePassword(password, navigate);
        }
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
                    <h1 className="text-2xl font-bold mt-2">Update Your Password</h1>
                    <p className="text-base-content/60">Create a new password</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label mb-1">
                        <span className="label-text font-medium">Password</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                            <Lock className="size-5 text-base-content/40" />
                        </div>
                        <input 
                            type="text"
                            className={`input input-bordered w-full pl-10 focus:border-none`}
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-neutral w-full" disabled={isPasswordUpdate}>
                    {isPasswordUpdate ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        'Update Password'
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

export default UpdatePassword;
