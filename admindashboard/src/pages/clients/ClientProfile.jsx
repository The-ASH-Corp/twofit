import React from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import ProfileCenterSide from "@/components/clients/ProfileCenterSide";





const ClientProfile = () => {
  
  return (
    <div className="flex justify-between w-full gap-4 ">
      {/* left */}
      <ProfileLeftSide />
      {/* center */}
      <ProfileCenterSide/>
      {/* right */}
      <div className="w-[25%] bg-amber-200"></div>
    </div>
  );
};

export default ClientProfile;
