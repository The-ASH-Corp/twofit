import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/redux/features/auth/auth.thunk";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginBgImage from "../assets/twofit_landing_bg2.jpeg";
import MobileLoginBgImage from "../assets/twofit_Login_bg.png";

const Login = () => {
  useEffect(() => {
    document.title = "Login | Twofit";
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const ROLE_REDIRECT = {
    founder: "/founder",
    head: "/head",
    admin: "/admin",
    expert: "/expert",
    user: "/client",
  };

  const resolveRole = (role) => {
    if (!role) return null;

    const normalizedRole = role.toLowerCase();

    if (["therapist", "dietician", "trainer"].includes(normalizedRole)) {
      return "expert";
    }

    return normalizedRole;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(formData)).unwrap();

      const finalRole = resolveRole(result.user.role);

      localStorage.setItem("token", result.accessToken);
      localStorage.setItem("role", finalRole);

      const redirectPath = ROLE_REDIRECT[finalRole];

      if (!redirectPath) {
        throw new Error("Unknown role");
      }

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error?.message || "Invalid email or password");
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
          className="pointer-events-none absolute inset-0 md:hidden lg:hidden"
          style={{
            backgroundImage: `url(${MobileLoginBgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute inset-0 lg:hidden bg-gradient-to-b from-[#061b18]/20 via-[#061b18]/40 to-[#061b18]/60" />

        <div className="relative z-10 mt-8 w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/20 bg-[#062f2a]/72 text-white shadow-[0_24px_80px_rgba(9,29,25,0.18)] backdrop-blur-lg sm:mt-6 sm:max-w-[560px] sm:rounded-[32px] md:mt-0 lg:mt-0 lg:max-w-[620px] lg:rounded-[34px] lg:border-white/60 lg:bg-white/90 lg:text-[#0A4F48] lg:shadow-[0_26px_90px_rgba(9,29,25,0.14)] lg:backdrop-blur-md">
          <div className="flex w-full flex-col gap-6 px-5 py-4 sm:px-8 sm:py-6 lg:px-14 lg:py-12 xl:px-16 xl:py-14">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="inline-flex items-center rounded-full bg-white/14 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white lg:bg-[#0A4F48]/10 lg:text-[#0A4F48]">
                Welcome back
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-[20px] font-bold leading-tight tracking-[-0.04em] text-white sm:text-[22px] lg:text-[24px] lg:text-[#0A4F48]">
                  Login to Your Account
                </h2>
              </div>
            </div>

            <div className="flex w-full flex-col gap-6">
              <form
                onSubmit={handleLogin}
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
                    name="email"
                    autoComplete="email"
                    required
                    className="h-10 w-full rounded-md border border-white/20 bg-white p-3 text-[12px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#0A4F48] sm:h-11 sm:p-4 sm:text-[13px] lg:border-slate-200"
                    placeholder="yourname@example.com"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <label
                    htmlFor="password"
                    className="text-[11px] font-medium text-white/90 lg:text-slate-900"
                  >
                    Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      className="h-10 w-full rounded-md border border-white/20 bg-white p-3 pr-12 text-[12px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-transparent focus:ring-2 focus:ring-[#0A4F48] sm:h-11 sm:p-4 sm:pr-14 sm:text-[13px] lg:border-slate-200"
                      placeholder="Enter your password"
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-[#64748B] transition-colors hover:text-[#334155]"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={20} className="w-5 h-5" />
                      ) : (
                        <Eye size={20} className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 hidden w-4 cursor-pointer appearance-none rounded-[4px] border border-white/35 bg-white/10 lg:border-[#DBDEDD] lg:bg-[#F0F0F0]"
                    />
                  
                  </div>
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-white/90 hover:underline sm:text-[12px] lg:text-[#0A4F48]"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="w-full">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-white py-2.5 text-[14px] font-semibold text-[#0A4F48] transition-colors duration-200 hover:bg-white/90 active:scale-[0.98] sm:py-3.5 sm:text-[15px] lg:bg-[#0A4F48] lg:text-white lg:hover:bg-[#083d38] lg:text-[16px]"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
