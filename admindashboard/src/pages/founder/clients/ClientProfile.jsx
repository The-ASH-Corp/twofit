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
import { SyncLoader } from "react-spinners";

const ClientProfile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const client = useSelector(selectSelectedClient);
  const status = useSelector(selectClientStatus);
  const error = useSelector(selectClientError);

  useEffect(() => {
    if (id) {
      dispatch(getClient({ id: id }));
      // console.log(client)
    }
  }, [id, dispatch]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#11b350" loading margin={2} size={20} />
      </div>
    );
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
