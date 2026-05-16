import React, { useEffect, useState, useMemo, useCallback } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { getClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/redux/store/hooks";
import {
  selectClientStatus,
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { getClientsBasedOnCoach } from "@/redux/features/client/client.thunk";
import { useNavigate } from "react-router-dom";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { SyncLoader } from "react-spinners";

export default function ClientsTable() {
  const dispatch = useDispatch();

  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);
  const [clients, setClients] = useState([]);
  const [clientsLength, setClientsLength] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchClientData = useCallback(async () => {
    if (!user?._id) return;

    const programIds = Array.isArray(user?.program)
      ? user.program.map((program) =>
          typeof program === "object" ? program._id : program,
        )
      : [];

    if (programIds.length === 0) {
      setClients([]);
      setClientsLength(0);
      return;
    }

    const client = await dispatch(
      getClientsBasedOnCoach({ programIds, page, limit }),
    ).unwrap();
    setClients(client.data);
    setClientsLength(client.total);
  }, [dispatch, page, limit, user]);

  const columns = useMemo(() => getClientColumns(fetchClientData), [fetchClientData]);

  const navigate = useNavigate();


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const searchInpiutHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const profilePath = (id) => {
    navigate(`/admin/clients/profile/${id}`);
  };

  useEffect(() => {
    fetchClientData();
  }, [page, limit, dispatch, fetchClientData]);

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-156px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={columns}
        data={filteredClients}
        actionLabel={user?.program?.length > 0 ? "Add Client" : null}
        actionPath={user?.program?.length > 0 ? "/admin/clients/addclient" : null}
        profilePath={profilePath}
        pageLabel={"Clients"}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        onSearchInputChange={searchInpiutHandler}
        page={page}
        limit={limit}
        totalCount={clientsLength}
      />
    </div>
  );
}
