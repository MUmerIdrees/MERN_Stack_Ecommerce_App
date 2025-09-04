import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const LogInPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // const navigate = useNavigate();

    const { logIn, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await logIn(formData);
    };

    return (
        <div className="w-full max-w-sm space-y-6 rounded-sm backdrop-blur-lg p-6 shadow-gray-400 shadow-2xl">
            {/* LOGO */}
            <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                    <div className="lg:hidden size-12 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors"
                    >
                        <ShoppingBag className="size-6 text-black" />
                    </div>
                    <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                    <p className="text-base-content/60">
                        Sign in to your account
                    </p>
                </div>
            </div>

            {/* Form */}
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
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })
                        }
                        />
                    </div>
                </div>

                <div className="form-control">
                    <label className="label mb-1">
                        <span className="label-text font-medium">Password</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                            <Lock className="size-5 text-base-content/40" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`input input-bordered w-full pl-10 focus:border-none`}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })
                        }
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center z-50"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="size-5 text-base-content/40" />
                            ) : (
                                <Eye className="size-5 text-base-content/60" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-neutral w-full"
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </button>

                <div className="text-center">
                    <p className="text-base-content/60">
                        Don't have an account?{" "}
                        <Link to="/signup" className="link link-neutral">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>

            <div className="text-center">
                <p className="text-base-content/60">
                    <Link to="/forgotpassword" className="link-error">
                        Forgotten Password?
                    </Link>
                </p>
            </div>
        </div>
            
    );
};

export default LogInPage;
