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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();  
  const navigate = useNavigate();

  const profilePath = (id)=> {
        navigate(`/founder/clients/profile/${id}`);
  }

  useEffect(() => {
    dispatch(getAllClients({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useAppSelector(selectAllClients);
  const status = useAppSelector(selectClientStatus);
  const error = useAppSelector(selectClientError);

  const [clients, setClient] = useState([]);

  useEffect(()=>{
    setClient(data)
  },[data])

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setClient(data);
      return;
    }

    const filtered = data.filter((client) =>
      client.name?.toLowerCase().includes(value)
    );

    setClient(filtered);
  };

  if (status === "loading") return <p>Loading clients...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto  no-scrollbar">
      <BaseTable
        columns={ClientColumns}
        data={clients}
        profilePath={profilePath}
        pageLabel={"Clients"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
      />
    </div>
  );
}
