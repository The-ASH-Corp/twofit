import React, { useEffect, useMemo, useState } from "react";
import BaseTable from '../../../components/table/BaseTable'
import { ProgramListColumns } from './ProgramListColumns'
import { useDispatch } from 'react-redux'
import { getAllPrograms } from '@/redux/features/program/program.thunk'
import { useAppSelector } from '@/redux/store/hooks'
import {
  selectAllPrograms,
  selectProgramError,
  selectProgramStatus,
  selectTotalProgramCount,
} from '@/redux/features/program/program.selector'
import { selectUser } from '@/redux/features/auth/auth.selectores'
import { SyncLoader } from 'react-spinners'

export default function ProgramTable() {

  const user =useAppSelector(selectUser)
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllPrograms({ page, limit }));
  }, [dispatch, page, limit]);

  const allPrograms = useAppSelector(selectAllPrograms);
  const totalPrograms = useAppSelector(selectTotalProgramCount);
  const status = useAppSelector(selectProgramStatus);
  const error = useAppSelector(selectProgramError);

  const visiblePrograms = useMemo(() => {
    const assignedPrograms = Array.isArray(user?.program) ? user.program : [];
    const assignedProgramIds = new Set(
      assignedPrograms
        .map((program) =>
          typeof program === "string" ? program : program?._id?.toString(),
        )
        .filter(Boolean),
    );

    const mappedPrograms = (allPrograms || []).map((program) => ({
      ...program,
      isAssignedToAdmin: assignedProgramIds.has(program?._id?.toString()),
    }));

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return mappedPrograms;
    }

    return mappedPrograms.filter((program) =>
      program.title?.toLowerCase().includes(normalizedSearch),
    );
  }, [allPrograms, searchTerm, user]);

  const searchInputHandler = (e) => {
    setSearchTerm(e.target.value || "");
  };
    
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
        columns={ProgramListColumns}
        data={visiblePrograms}
        pageLabel={"Program List"}
        actionLabel="Add Program"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={totalPrograms}
      />
    </div>
  );
}
