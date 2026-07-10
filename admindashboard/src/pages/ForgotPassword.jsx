import React, { useEffect, useState, useRef } from "react";
import { assets } from "../assets/asset";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword, verifyOTP } from "@/redux/features/auth/auth.thunk";
import { toast } from "react-toastify";
import LoginBgImage from "../assets/twofit_landing_bg2.jpeg";

const ForgotPasswordEmail = () => {
  useEffect(() => {
    document.title = "Forgot Password | Twofit";
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    otp: ["", "", "", ""],
    newPassword: "",
    confirmPassword: "",
  });

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Send OTP to email
      await dispatch(forgotPassword({ email: formData.email })).unwrap();
      setStep(2);
    } catch (err) {
      setError(err || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    if (value && !/^\d$/.test(value)) return; // Only allow numbers

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    // Auto-focus next input
    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const otpCode = formData.otp.join("");
    if (otpCode.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }

    setLoading(true);
    try {
      await dispatch(verifyOTP({ email: formData.email, otp: otpCode })).unwrap();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const otpCode = formData.otp.join("");
      await dispatch(resetPassword({ email: formData.email, otp: otpCode, newPassword: formData.newPassword })).unwrap(); 
      
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="relative min-h-[100svh] w-full overflow-x-hidden overflow-y-auto bg-[#f6f8f4] md:grid md:grid-cols-2 lg:grid lg:grid-cols-2">
      <div
        className="relative hidden min-h-[100svh] overflow-hidden md:block lg:block"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-[#0A4F48]"
          style={{
            backgroundImage: `url(${LoginBgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/20 to-[#041815]/45" />
      </div>

      <div className="relative flex min-h-[100svh] items-end justify-center px-4 pb-4 pt-6 sm:px-6 sm:pb-6 sm:pt-8 lg:items-center lg:px-8 lg:py-0 xl:px-12">
        <div
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url(${LoginBgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute inset-0 lg:hidden bg-gradient-to-b from-[#061b18]/20 via-[#061b18]/40 to-[#061b18]/60" />

        <div className="relative z-10 mt-8 w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/20 bg-[#062f2a]/72 text-white shadow-[0_24px_80px_rgba(9,29,25,0.18)] backdrop-blur-lg sm:mt-6 sm:max-w-[560px] sm:rounded-[32px] md:mt-0 lg:mt-0 lg:max-w-[620px] lg:rounded-[34px] lg:border-white/60 lg:bg-white/90 lg:text-[#0A4F48] lg:shadow-[0_26px_90px_rgba(9,29,25,0.14)] lg:backdrop-blur-md">
          <div className="flex w-full flex-col gap-6 px-5 py-4 sm:px-8 sm:py-6 lg:px-14 lg:py-12 xl:px-16 xl:py-14">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="font-bold text-[20px] sm:text-[22px] lg:text-[24px] tracking-[-4%] leading-[118%] text-white lg:text-[#0A4F48]">
                  {step === 1 && "Forgot Password?"}
                  {step === 2 && "Password reset"}
                  {step === 3 && "Set new password"}
                </h2>
                <p className="text-[11px] sm:text-[12px] text-white/75 leading-[150%] text-center lg:text-[#63716E]">
                  {step === 1 && "No worries, we'll send you reset instructions."}
                  {step === 2 && `We sent a code to ${formData.email}`}
                  {step === 3 && "Must be at least 6 characters."}
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-6">
              {error && (
                <div className="w-full rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-center text-sm text-red-100 lg:border-red-200 lg:bg-red-50 lg:text-red-600">
                  {error}
                </div>
              )}

              {step === 1 && (
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex w-full flex-col gap-5 sm:gap-6"
                >
                  <div className="flex flex-col items-start gap-2">
                    <label
                      htmlFor="email"
                      className="text-[11px] font-medium text-white/90 lg:text-slate-900"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      autoComplete="email"
                      className="h-10 w-full rounded-md border border-white/20 bg-white p-3 text-[12px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#0A4F48] sm:h-11 sm:p-4 sm:text-[13px] lg:border-slate-200"
                      placeholder="yourname@example.com"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="w-full">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-white py-2.5 text-[14px] font-semibold text-[#0A4F48] transition-colors duration-200 hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-[15px] lg:bg-[#0A4F48] lg:text-white lg:hover:bg-[#083d38] lg:text-[16px]"
                    >
                      {loading ? "Sending..." : "Reset Password"}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <GoArrowLeft className="h-5 w-5 text-white/90 lg:text-[#0A4F48]" />
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="cursor-pointer font-bold text-white/90 lg:text-[#0A4F48]"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form
                  onSubmit={handleOtpSubmit}
                  className="flex w-full flex-col gap-5 sm:gap-6"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex w-full justify-center gap-2.5 sm:gap-3">
                      {formData.otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpRefs.current[index] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="h-14 w-14 rounded-lg border border-white/20 bg-white text-center text-xl font-bold text-slate-900 transition-all focus:border-[#0A4F48] focus:outline-none focus:ring-2 focus:ring-[#0A4F48] sm:h-20 sm:w-20 sm:text-3xl lg:border-slate-200"
                          required
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-white py-2.5 text-[14px] font-semibold text-[#0A4F48] transition-colors duration-200 hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-[15px] lg:bg-[#0A4F48] lg:text-white lg:hover:bg-[#083d38] lg:text-[16px]"
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                    <div className="mt-2 flex w-full flex-wrap justify-center gap-2 text-[11px] sm:text-[12px]">
                      <span className="text-white/75 lg:text-gray-500">
                        Didn't receive the email?
                      </span>
                      <button
                        type="button"
                        className="font-bold underline text-white/90 lg:text-[#0A4F48]"
                        onClick={handleEmailSubmit}
                      >
                        Click to resend
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <GoArrowLeft className="h-5 w-5 text-white/90 lg:text-[#0A4F48]" />
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="cursor-pointer font-bold text-white/90 lg:text-[#0A4F48]"
                    >
                      Back to Email
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form
                  onSubmit={handlePasswordReset}
                  className="flex w-full flex-col gap-5 sm:gap-6"
                >
                  <div className="flex flex-col items-start gap-2">
                    <label
                      htmlFor="newPassword"
                      className="text-[11px] font-medium text-white/90 lg:text-slate-900"
                    >
                      New Password
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        required
                        value={formData.newPassword}
                        autoComplete="new-password"
                        className="h-10 w-full rounded-md border border-white/20 bg-white p-3 pr-12 text-[12px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#0A4F48] sm:h-11 sm:p-4 sm:pr-14 sm:text-[13px] lg:border-slate-200"
                        placeholder="Enter new password"
                        onChange={(e) =>
                          setFormData({ ...formData, newPassword: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-[#64748B] transition-colors hover:text-[#334155]"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff size={20} className="h-5 w-5" />
                        ) : (
                          <Eye size={20} className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-[11px] font-medium text-white/90 lg:text-slate-900"
                    >
                      Confirm Password
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        autoComplete="new-password"
                        className="h-10 w-full rounded-md border border-white/20 bg-white p-3 pr-12 text-[12px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#0A4F48] sm:h-11 sm:p-4 sm:pr-14 sm:text-[13px] lg:border-slate-200"
                        placeholder="Confirm new password"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-[#64748B] transition-colors hover:text-[#334155]"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={
                          showConfirmPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} className="h-5 w-5" />
                        ) : (
                          <Eye size={20} className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="w-full">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-white py-2.5 text-[14px] font-semibold text-[#0A4F48] transition-colors duration-200 hover:bg-white/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3.5 sm:text-[15px] lg:bg-[#0A4F48] lg:text-white lg:hover:bg-[#083d38] lg:text-[16px]"
                    >
                      {loading ? "Resetting..." : "Reset Password"}
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <GoArrowLeft className="h-5 w-5 text-white/90 lg:text-[#0A4F48]" />
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="cursor-pointer font-bold text-white/90 lg:text-[#0A4F48]"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
