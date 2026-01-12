import React, { useEffect } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { useNavigate } from "react-router-dom";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { selectAssignedClients } from "@/redux/features/coach/coach.selector";
import { getUsersAssignedToACoach } from "@/redux/features/coach/coach.thunk";

export default function ClientsTable() {
const navigate = useNavigate();
  const dispatch = useDispatch();

  const coachId = useAppSelector(selectUser);

    useEffect(() => {
    if (coachId) {
      dispatch(getUsersAssignedToACoach(coachId._id));
    }
  }, [dispatch, coachId]);
  // const navigate = useNavigate();



  const clients = useAppSelector(selectAssignedClients);

  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);



  if (status === "loading") return <p>Loading clients...</p>;
  if (error) return <p>{error}</p>;

 const profilePath = (id) => {
    navigate(`/expert/clients/profile/${id}`);
  };
  return (
    <BaseTable
      columns={ClientColumns}
      data={clients?.assignedUsers}
      pageLabel="My Clients"
      profilePath={profilePath}
    />
  );
}
