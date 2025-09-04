import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, ShoppingBag, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
  });

  const { signUp, isSigningUp } = useAuthStore();

  const navigate = useNavigate();

  const validateForm = () => {
    if((!formData.fullName.trim() && !formData.email.trim() && !formData.password.trim()) || 
    (!formData.fullName.trim() && !formData.email.trim()) || (!formData.email.trim() && !formData.password.trim()) || 
    (!formData.fullName.trim() && !formData.password.trim())) {
      return toast.error("All fields are required");
    }
    if(!formData.fullName.trim()) {
      return toast.error("Full name is required");
    }
    if(!formData.email.trim()) {
      return toast.error("Email is required");
    }
    if(!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Invalid email format");
    }
    if(!formData.password.trim()) {
      return toast.error("Password is required");
    }
    if(formData.password.length < 6) {
      return toast.error("Password must be atleast 6 characters");
    }

    return true;
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      const success = validateForm();

      if(success === true) {
        signUp(formData, navigate);
      }
  }

  const signupWithGoogle = () => {
    window.location.href = 'http://localhost:5001/api/auth/google';
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
          <h1 className="text-2xl font-bold mt-2">Create Account</h1>
          <p className="text-base-content/60">Get started with your free account</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label mb-1">
              <span className="label-text font-medium">Full Name</span>
          </label>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-50">
                  <User className="size-5 text-base-content/40" />
              </div>
              <input
                  type="text"
                  className={`input input-bordered w-full pl-10 focus:border-none`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
          </div>
        </div>

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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        <button type="submit" className="btn btn-neutral w-full" disabled={isSigningUp}>
          {isSigningUp ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="text-center w-full">
        OR
      </div>

      <button onClick={signupWithGoogle} className="btn bg-gray-300 w-full">
        <svg aria-label="Google logo" width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <g>
            <path d="m0 0H512V512H0" fill="transparent"></path>
            <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
            <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
            <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
            <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
          </g>
        </svg>
        Continue with Google
      </button>

      <div className="text-center">
        <p className="text-base-content/60">
          Already have an account?{" "}
          <Link to="/login" className="link link-neutral">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;