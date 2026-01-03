import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { AdminColumns } from './AdminColumns'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllAdmins } from '@/redux/features/admins/admin.thunk';

export default function AdminsList() {

  const [admins,setAdmins]=useState([])
 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();
  const fetchAdminData=async()=>{
    const admin =await dispatch(getAllAdmins({page,limit})).unwrap()
    setAdmins(admin)
  }
 const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };
  const navigate = useNavigate();

  const profilePath = (id) => {
    navigate(`/head/admins/profile/${id}`);
  };

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();
    const filteredAdmins = admins.filter((admin) => {
      return (
        admin.name.toLowerCase().includes(value)
      )
    })
    setAdmins(filteredAdmins)
    if (value == '') {
      fetchAdminData();
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [page, limit]);
  return (
    <div>
      <BaseTable
        columns={AdminColumns}
        data={admins}
        actionLabel="Add Admins"
        actionPath="/head/admins/add-admin"
        profilePath={profilePath}
        pageLabel={"Admins"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
      />
    </div>
  );
}
