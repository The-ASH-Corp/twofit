import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectAllClients,
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { getAllClients } from "@/redux/features/client/client.thunk";
import { useNavigate } from "react-router-dom";

export default function ClientsTable() {
  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);
  const [clients, setClients] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchClientData = async () => {
    const client = await dispatch(getAllClients({ page, limit })).unwrap();
    setClients(client);
  };

  const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const searchInpiutHandler = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredAdmins = clients.filter((admin) => {
      return admin.name.toLowerCase().includes(value);
    });
    setClients(filteredAdmins);
    if (value == "") {
      fetchClientData();
    }
  };

  const profilePath = (id) => {
    navigate(`/head/clients/profile/${id}`);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    fetchClientData();
  }, [page, limit]);

  if (status === "loading") return <p>Loading clients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <BaseTable
        columns={ClientColumns}
        data={clients}
        profilePath={profilePath}
        pageLabel={"Clients"}
        onSearchInputChange={searchInpiutHandler}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
      />
    </div>
  );
}
