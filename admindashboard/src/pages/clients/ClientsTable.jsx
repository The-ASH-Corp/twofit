import React, { useEffect } from "react";
import BaseTable from "../../components/table/BaseTable";
import { ClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectAllClients,
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { getAllClients } from "@/redux/features/client/client.thunk";

export default function ClientsTable() {
  const dispatch = useDispatch();

  const clients = useAppSelector(selectAllClients);
  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);

  useEffect(() => {
    dispatch(getAllClients({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (status === "loading") return <p>Loading clients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <BaseTable
        columns={ClientColumns}
        data={clients}
        actionLabel="Add Client"
        actionPath="/addclient"
        profilePath="/clients/profile/69425703ceaa579bbe149425"
        pageLabel={"Clients"}
        // profilePath="/clients/profile/:clientId"
        // pageLabel="Clients"
      />
    </div>
  );
}
