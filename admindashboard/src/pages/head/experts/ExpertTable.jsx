import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { ExpertColumns } from "./ExpertColumns";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { SyncLoader } from "react-spinners";
import { getAllProgramsByCategory } from "@/redux/features/program/program.thunk";
import { getAllCoachesByProgramId, getAllTherapists } from "@/redux/features/coach/coach.thunk";

export default function ExpertTable() {
  const user = useAppSelector(selectUser);
  const [length, setLength] = useState(0);
  const [coaches, setCoaches] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const fetchCoachData = async () => {
    setLoading(true);
    try {
      // Get programs under the head's category
      const prgms = await dispatch(
        getAllProgramsByCategory({
          category: user?.programCategory,
          page: 1,
          limit: 10000,
        }),
      ).unwrap();
      const programIds = prgms.data.map((program) => program._id);

      // Fetch Trainers/Dieticians by program match
      const programCoaches = await dispatch(
        getAllCoachesByProgramId({ programId: programIds, page, limit })
      ).unwrap();

      // Fetch all Therapists (therapists don't have programs, they have therapyType)
      const therapists = await dispatch(getAllTherapists()).unwrap();

      // Merge and deduplicate
      const allCoaches = [...(programCoaches.data || []), ...(therapists || [])];
      const uniqueCoaches = Array.from(
        new Map(allCoaches.map((c) => [c._id, c])).values()
      );

      setCoaches(uniqueCoaches);
      setLength(uniqueCoaches.length);
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
    const filteredAdmins = coaches.filter((admin) => {
      return admin.name.toLowerCase().includes(value);
    });
    setCoaches(filteredAdmins);
    if (value == "") {
      fetchCoachData();
    }
  };

  const navigate = useNavigate();
  const profilePath = (id) => {
    navigate(`/head/experts/profile/${id}`);
  };

  useEffect(() => {
    fetchCoachData();
  }, [page, limit]);
  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        columns={ExpertColumns}
        data={coaches}
        profilePath={profilePath}
        pageLabel={"Experts"}
        onSearchInputChange={searchInpiutHandler}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
        totalCount={length}
      />
    </div>
  );
}
