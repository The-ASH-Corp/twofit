import React from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import ProfileCenterSide from "@/components/clients/ProfileCenterSide";
import ProfileRightSide from "@/components/clients/ProfileRightSide";


const ClientProfile = () => {

  
  return (
    <div className="flex justify-between w-full gap-4 h-[calc(100vh-120px)]">
      {/* left */}
      <ProfileLeftSide />
      {/* center */}
      <ProfileCenterSide />
      {/* right */}
      <ProfileRightSide />
    </div>
  );
};

export default ClientProfile;
