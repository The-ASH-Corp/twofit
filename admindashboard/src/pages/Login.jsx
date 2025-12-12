import React from 'react'
import {assets} from "../assets/asset";

const Login = () => {
  return (
    <div className="h-screen w-full flex items-center justify-between ">
      {/* image */}
      <div className="w-[50%] h-full bg-[#0A4F48] flex flex-col items-center pt-30 gap-25 px-16.5">
        <h1 className="text-white font-bold text-[60px] tracking-[-4%] text-center BricolageGrotesque leading-[100%]">
          Your <br /> Transformation <br /> Starts Now
        </h1>
        <div className="w-full pb-0 p-[3px] bg-[#FFCDFD33] rounded-t-xl overflow-hidden flex  justify-center">
          <img
            src={assets.loginPageImg}
            alt="login page image"
            className="rounded-t-xl object-right w-full"
          />
        </div>
      </div>
      {/* content */}
      <div className="w-[50%] h-full flex flex-col items-center justify-center gap-10 px-30">
        {/* heading */}
        <div className="flex flex-col items-center gap-6">
          <img src={assets.NavBarLogo} alt="logo" className="w-[133px]" />
          <div className="flex items-center flex-col justify-center gap-2">
            <h2 className="font-bold text-[24px] tracking-[-4%] leading-[118%] text-[#0A4F48]">
              Login to Your Account
            </h2>
            <p className="text-[12px] text-[#63716E] leading-[150%]">
              Access your dashboard securely.
            </p>
          </div>
        </div>
        {/* form */}
        <div className="flex flex-col items-center w-full gap-6">
          <div></div>
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center justify-center gap-1">
              <input
                type="checkbox"
                class="h-4 w-4 appearance-none rounded-[4px] border border-[#DBDEDD] bg-[#F0F0F0]"
              />
              <span className="text-[12px] ">Remember me</span>
            </div>
            <p className="text-[12px] font-semibold ">Forgot Password?</p>
          </div>
          <div className="w-full">
            <button className="bg-[#0A4F48] w-full py-3.5 rounded-lg text-white font-semibold text-[16px]">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login