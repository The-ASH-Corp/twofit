import React from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import ProfileCenterSide from "@/components/clients/ProfileCenterSide";
import { Calendar } from "@/components/ui/calendar";
import ProfileRightSide from "@/components/clients/profileRightSide";


const ClientProfile = () => {
  return (
    <div className="flex justify-between w-full gap-4 ">
      {/* left */}
      <ProfileLeftSide />
      {/* center */}
      <ProfileCenterSide />
      {/* right */}
      <ProfileRightSide/>
    </div>
  );
};

export default ClientProfile;
