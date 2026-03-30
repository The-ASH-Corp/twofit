import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { ExpertColumns } from './ExpertColumns'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllCoachesByHead } from '@/redux/features/head/head.thunk';
import { useAppSelector } from '@/redux/store/hooks';
import { selectUser } from '@/redux/features/auth/auth.selectores';
import { SyncLoader } from 'react-spinners';
import { selectCoachError, selectCoachStatus } from '@/redux/features/coach/coach.selector';

export default function ExpertTable() {

  const user =useAppSelector(selectUser)
    const status = useSelector(selectCoachStatus);
  const error = useSelector(selectCoachError);
  const [coaches,setCoaches]=useState([])
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
  
  const dispatch = useDispatch();
  const fetchCoachData=async()=>{
    const coache =await dispatch(getAllCoachesByHead({page,limit,headId:user?._id})).unwrap()
    setCoaches(coache.data)
  }

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
    navigate(`/head/experts/profile/${id}`);
  };

  useEffect(() => {
    fetchCoachData();
  }, []);
   if (status === "loading")
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
        totalCount={coaches.length}
      />
    </div>
  );
}
