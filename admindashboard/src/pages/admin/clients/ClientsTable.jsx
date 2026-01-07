import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { getClientsBasedOnCoach } from "@/redux/features/client/client.thunk";
import { useNavigate } from "react-router-dom";
import { selectAllCoaches } from "@/redux/features/coach/coach.selector";
import { getAllCoachesByAdminId } from "@/redux/features/admins/admin.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";

export default function ClientsTable() {
  const coachIds = useAppSelector(selectAllCoaches);
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);
  const [clients, setClients] = useState([]);
  const [clientsLength, setClientsLength] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  if (coachIds.length === 0) {
    dispatch(getAllCoachesByAdminId(user._id, page, limit));
  }

  const fetchClientData = async () => {
    const client = await dispatch(
      getClientsBasedOnCoach({ coachIds, page, limit })
    ).unwrap();
    setClients(client.data);
    setClientsLength(client.total);
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
    navigate(`/admin/clients/profile/${id}`);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    fetchClientData();
  }, [page, limit, dispatch]);

  if (status === "loading") return <p>Loading clients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <BaseTable
        columns={ClientColumns}
        data={clients}
        actionLabel="Add Client"
        actionPath="/admin/clients/addclient"
        profilePath={profilePath}
        pageLabel={"Clients"}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearchInput={searchInpiutHandler}
        page={page}
        limit={limit}
        totalCount={clientsLength}
      />
    </div>
  );
}
