import React, { useEffect, useState } from 'react'
import BaseTable from '../../components/table/BaseTable'
import { ExpertColumns } from './ExpertColumns'
import { useDispatch } from 'react-redux';
import { getAllCoaches } from '@/redux/features/coach/coach.thunk';
import { useNavigate } from 'react-router-dom';

export default function ExpertTable() {

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
    navigate(`/experts/profile/${id}`);
  };

  useEffect(() => {
    fetchCoachData();
  }, []);
  
  return (
    <div>
      <BaseTable
        columns={ExpertColumns}
        data={coaches}
        actionLabel="Add Expert"
        actionPath="/addexpert"
        profilePath={profilePath}
        pageLabel={"Experts"}
      />
    </div>
  );
}
