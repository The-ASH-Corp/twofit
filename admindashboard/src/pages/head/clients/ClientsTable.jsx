import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ClientColumns } from "./ClientColumns";
import { useDispatch, } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";

import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getAllUsersByHead } from "@/redux/features/head/head.thunk";

export default function ClientsTable() {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clients, setClients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(
        getAllUsersByHead({
          headId: user?._id,
          page,
          limit,
        })
      ).unwrap();

      // Handle both response.data and direct response
      const responseData = result.data || result;
      setClients(responseData || []);
      setTotalCount(responseData?.totalCount || 0);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err?.message || "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const searchInpiutHandler = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredClients = clients.filter((client) => {
      return client.name?.toLowerCase().includes(value);
    });
    setClients(filteredClients);
    if (value == "") {
      fetchClientData();
    }
  };

  const profilePath = (id) => {
    navigate(`/head/clients/profile/${id}`);
  };

  useEffect(() => {
    if (user?._id) {
      fetchClientData();
    }
  }, [page, limit, user?._id, dispatch]);

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-120px)]">
      <SyncLoader color="#0A4F48" loading margin={2} size={20} />
    </div>
  );
  if (error) return <p className="text-red-500">{error}</p>;

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
