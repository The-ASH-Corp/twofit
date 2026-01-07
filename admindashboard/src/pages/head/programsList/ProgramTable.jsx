import React, { useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ProgramListColumns } from './ProgramListColumns'
import { useDispatch } from 'react-redux'
import { getAllPrograms } from '@/redux/features/program/program.thunk'
import { useAppSelector } from '@/redux/store/hooks'
import { useEffect } from 'react'
import { selectAllPrograms, selectProgramError, selectProgramStatus, selectTotalProgramCount } from '@/redux/features/program/program.selector'

export default function ProgramTable() {

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(getAllPrograms({ page, limit }));
  }, [dispatch, page, limit]);

  const totalProgramCount = useAppSelector(selectTotalProgramCount);
  const data = useAppSelector(selectAllPrograms);
  const status = useAppSelector(selectProgramStatus);
  const error = useAppSelector(selectProgramError);

  const [ programs, setProgram ] = useState([]);

  useEffect(()=>{
    setProgram(data)
  },[data])

    const searchInputHandler = (e) => {
      const value = e.target.value.toLowerCase();

      if (!value) {
        setProgram(data);
        return;
      }

      const filtered = data.filter((programs) =>
        programs.title?.toLowerCase().includes(value)
      );

      setProgram(filtered);
    };
  if (status === "loading") return <p>Loading programs...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <BaseTable
        columns={ProgramListColumns}
        data={programs}
        pageLabel={"Program List"}
        actionLabel="Add Program"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
        totalCount={totalProgramCount}
      />
    </div>
  );
}
