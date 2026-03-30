import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ClientColumns } from "./ClientColumns";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectClientError,
} from "@/redux/features/client/client.selectors";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { getAllUsersByHead } from "@/redux/features/head/head.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";

export default function ClientsTable() {
  const user =useAppSelector(selectUser)
  const navigate = useNavigate();
  const error = useAppSelector(selectClientError);
  const [clients, setClients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const client = await dispatch(getAllUsersByHead({ headId:user?._id,page, limit })).unwrap();
      setClients(client.data);
      setTotalCount(client.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


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
  }, [page, limit, dispatch]);

  if (loading) return (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
          <SyncLoader color="#0A4F48" loading margin={2} size={20} />
        </div>
      );
  if (error) return <p>{error}</p>;

  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
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
        totalCount={totalCount}
      />
    </div>
  );
}
