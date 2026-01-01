import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { AdminColumns } from './AdminColumns'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllAdmins } from '@/redux/features/admins/admin.thunk';

export default function AdminsList() {

  const [admins,setAdmins]=useState([])
  const page =1
  const limit =10
  const dispatch = useDispatch();
  const fetchAdminData=async()=>{
    const admin =await dispatch(getAllAdmins({page,limit})).unwrap()
    setAdmins(admin)
  }

  const navigate = useNavigate();
  const profilePath = (id) => {
    navigate(`/head/admins/profile/${id}`);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);
  
  return (
    <div>
      <BaseTable
        columns={AdminColumns}
        data={admins}
        actionLabel="Add Admins"
        actionPath="/head/admins/add-admin"
        profilePath={profilePath}
        pageLabel={"Admins"}
      />
    </div>
  );
}
