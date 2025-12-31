import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { AdminColumns } from './AdminColumns'
import { useDispatch } from 'react-redux';
import { getAllCoaches } from '@/redux/features/coach/coach.thunk';
import { useNavigate } from 'react-router-dom';

export default function AdminsList() {

  const [coaches,setCoaches]=useState([])
  const page =1
  const limit =10
  const dispatch = useDispatch();
  const fetchCoachData=async()=>{
    const coache =await dispatch(getAllCoaches({page,limit})).unwrap()
    const clients =coache[0].assignedUsers.length
    setCoaches([{...coache[0],clients}])
  }

  const navigate = useNavigate();
  const profilePath = (id) => {
    navigate(`/head/admins/profile/${id}`);
  };

  useEffect(() => {
    fetchCoachData();
  }, []);
  
  return (
    <div>
      <BaseTable
        columns={AdminColumns}
        data={coaches}
        actionLabel="Add Admins"
        actionPath="/head/admins/add-admin"
        profilePath={profilePath}
        pageLabel={"Admins"}
      />
    </div>
  );
}
