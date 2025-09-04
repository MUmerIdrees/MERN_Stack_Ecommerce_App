import { useRef, useState } from "react";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import Countdown from "react-countdown";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
    const inputsRef = useRef([]);
    const [isOtpComplete, setIsOtpComplete] = useState(false);

    const navigate = useNavigate();

    const type = "verify";

    const { otpExpireTime, Timer, isEmailVerify, verifyEmail, emailForOtp } = useAuthStore();

    const checkOtpCompletion = () => {
        const allFilled = inputsRef.current.every(input => input && input.value.trim() !== "");
        setIsOtpComplete(allFilled);
    }

    const handleChange = (e, index) => {
        const value = e.target.value;

        if(/^\d$/.test(value)) {
            e.target.value = value;
            if(index < inputsRef.current.length - 1) {
                inputsRef.current[index + 1].focus();
            }
        } else {
            e.target.value = "";
        }

        checkOtpCompletion();
    }

    const handleKeyDown = (e, index) => {
        if(e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        } else if(e.key === "ArrowLeft" && index > 0) {
            inputsRef.current[index - 1].focus();
        } else if(e.key === "ArrowRight" && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if(inputsRef.current[index]) {
                inputsRef.current[index].value = char;
            }
        });

        checkOtpCompletion();
    }

    const handleSubmit = async () => {
        if(isOtpComplete) {
            const otp = inputsRef.current.map(input => input.value).join('');
            await verifyEmail(otp);
        }
    }

    useEffect(() => {
        if(emailForOtp) {
            Timer(emailForOtp, type);
        }
    }, []);

    return (
        <div className="w-full max-w-sm space-y-6 rounded-sm backdrop-blur-lg p-6 shadow-gray-400 shadow-2xl">
            {/* LOGO */}
            <div className="text-center mb-8">
                <div className="flex flex-col items-center gap-2 group">
                    <div className="lg:hidden size-12 rounded-xl bg-black/10 flex items-center justify-center 
                    group-hover:bg-black/20 transition-colors">
                        <ShoppingBag className="size-6 text-black" />
                    </div>
                    <h1 className="text-2xl font-bold mt-2">Verify Email</h1>
                    <p className="text-base-content/60">Enter The 6-digit OTP We Just Sent To Your Registered Email</p>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center space-x-3">
                    {[...Array(6)].map((_, i) => (
                        <input 
                            key={i}
                            type="text"
                            maxLength={1}
                            ref={(e) => (inputsRef.current[i] = e)}
                            onChange={(e) => handleChange(e, i)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            onPaste={(e) => handlePaste(e)}
                            className="w-11 h-11 text-center text-xl border rounded focus:outline-none focus:border-gray-500 transition-colors duration-200 border-gray-300"
                        />
                    ))}
                </div>
            
                <button onClick={handleSubmit} className={`btn btn-neutral w-full ${!isOtpComplete ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isEmailVerify}>
                    {isEmailVerify ? (
                        <>
                            <Loader2 className="size-5 animate-spin" />
                            Loading...
                        </>
                    ) : (
                        'Verify Email'
                    )}
                </button>
            </div>

            <button onClick={() => navigate('/signup')} className="btn btn-outline border-gray-300 w-full cursor-pointer">
                <ArrowLeft className="size-5 text-base-content/40" />
                Back To Sign up
            </button>

            {otpExpireTime && (
                <Countdown
                    date={otpExpireTime}
                    renderer={({ minutes, seconds, completed }) => {
                        if (completed) {
                            return (
                                <span className="text-red-500">Otp Expired</span>
                            );
                        } else {
                            return (
                                <span>
                                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                                </span>
                            );
                        }
                    }}
                />
            )}
        </div>
    );
};

export default EmailVerify;