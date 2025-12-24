import React, { useEffect } from "react";
import ProfileLeftSide from "@/components/clients/ProfileLeftSide";
import ProfileCenterSide from "@/components/clients/ProfileCenterSide";
import ProfileRightSide from "@/components/clients/ProfileRightSide";
import { useDispatch, useSelector } from "react-redux";
import { getClient } from "@/redux/features/client/client.thunk";
import { useParams } from "react-router-dom";
import {
  selectSelectedClient,
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";

const ClientProfile = () => {
  const dispatch = useDispatch();
  const { clientId } = useParams();

  const client = useSelector(selectSelectedClient);
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);

  useEffect(() => {
    if (clientId) {
      dispatch(getClient({ id: clientId }));
      // console.log(client)
    }
  }, [clientId, dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex justify-between w-full gap-4 h-[calc(100vh-120px)]">
      <ProfileLeftSide client={client} />
      <ProfileCenterSide client={client} />
      <ProfileRightSide client={client} />
    </div>
  );
};

export default ClientProfile;
