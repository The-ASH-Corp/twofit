import React, { useEffect } from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import ProfileCenterSide from "@/components/clients/ProfileCenterSide";
import ProfileRightSide from "@/components/clients/ProfileRightSide";
import { useDispatch } from "react-redux";
import { getClient } from "@/redux/features/client/client.thunk";
import { useParams } from "react-router-dom";


const ClientProfile = () => {
  let data = null

  const dispatch = useDispatch();
  const { clientId } = useParams()

  const handleLogin =async () => {    
      await  dispatch(getClient(clientId));
  
    };

 
  

 

  
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
