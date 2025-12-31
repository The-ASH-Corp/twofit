import React from 'react'
import BaseTable from '../../components/table/BaseTable'
import { ProgramListColumns } from './ProgramListColumns'
import { programListData } from './programListData'
import { useDispatch } from 'react-redux'
import { getAllPrograms } from '@/redux/features/program/program.thunk'
import { useAppSelector } from '@/redux/store/hooks'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectAllPrograms, selectProgramError, selectProgramStatus } from '@/redux/features/program/program.selector'

export default function ProgramTable() {

   const dispatch = useDispatch();

  const programs = useAppSelector(selectAllPrograms);
  const status = useAppSelector(selectProgramStatus);
  const error = useAppSelector(selectProgramError);
  // const programState = useSelector((state) => state.program);
// console.log("PROGRAM STATE 👉", programState);


  useEffect(() => {
    dispatch(getAllPrograms());

  }, [dispatch]);

  if (status === "loading") return <p>Loading programs...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <BaseTable columns={ProgramListColumns} data={programs} pageLabel={"Program List"}  actionLabel="Add Program" actionPath="/add-program"/>
    </div>
  )
}
