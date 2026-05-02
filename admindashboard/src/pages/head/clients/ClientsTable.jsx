import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ClientColumns } from "./ClientColumns";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import {
  selectClientError,
  selectClientStatus,
} from "@/redux/features/client/client.selectors";
import { getClientsBasedOnCoach } from "@/redux/features/client/client.thunk";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getAllProgramsByCategory } from "@/redux/features/program/program.thunk";
import { getAllCoachesByProgramId, getAllTherapists } from "@/redux/features/coach/coach.thunk";

export default function ClientsTable() {
  const user = useAppSelector(selectUser);
  const status = useSelector(selectClientStatus);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useAppSelector(selectClientError);
  const [clients, setClients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      // Get programs under the head's category
      const prgms = await dispatch(
        getAllProgramsByCategory({
          category: user?.programCategory,
          page: 1,
          limit: 10000,
        })
      ).unwrap();
      const programIds = prgms.data.map((program) => program._id);

      // Fetch Trainers/Dieticians by program match
      const programCoaches = await dispatch(
        getAllCoachesByProgramId({ programId: programIds, page: 1, limit: 10000 })
      ).unwrap();

      // Fetch all Therapists (therapists don't have programs)
      const therapists = await dispatch(getAllTherapists()).unwrap();

      // Merge, deduplicate, and extract IDs
      const allCoaches = [...(programCoaches.data || []), ...(therapists || [])];
      const coachIds = [
        ...new Set(allCoaches.map((c) => c._id)),
      ];

      if (coachIds.length === 0) {
        setClients([]);
        setTotalCount(0);
        return;
      }

      // Fetch clients assigned to these coaches
      const client = await dispatch(
        getClientsBasedOnCoach({ coachIds, page, limit })
      ).unwrap();
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
