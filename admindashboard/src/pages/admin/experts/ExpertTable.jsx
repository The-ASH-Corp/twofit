import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ExpertColumns } from './ExpertColumns'
import { useDispatch } from 'react-redux';
import { getAllCoaches } from '@/redux/features/coach/coach.thunk';
import { useNavigate } from 'react-router-dom';

export default function ExpertTable() {

  const [coaches,setCoaches]=useState([])
   const [page, setPage] = useState(1);
     const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();

  const fetchCoachData = async () => {
    const coaches = await dispatch(getAllCoaches({ page, limit })).unwrap();
    const formattedCoaches = coaches.map(coach => ({
      ...coach,
      clients: coach.assignedUsers.length
    }));
    setCoaches(formattedCoaches);
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
      return (
        admin.name.toLowerCase().includes(value)
      )
    })
    setCoaches(filteredAdmins)
    if (value == '') {
      fetchCoachData();
    }
  };

  const navigate = useNavigate();
  const profilePath = (id) => {
    navigate(`/admin/experts/profile/${id}`);
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
        actionPath="/admin/experts/addexpert"
        profilePath={profilePath}
        pageLabel={"Experts"}
         onSearchInputChange={searchInpiutHandler}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        page={page}
        limit={limit}
      />
    </div>
  );
}
