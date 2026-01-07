import React, { useEffect, useState } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { AdminColumns } from './AdminColumns'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllAdmins } from '@/redux/features/admins/admin.thunk';
import {
  getAdminError,
  getAdminStatus,
  getAdmins,
} from "@/redux/features/admins/admins.selecters";

export default function AdminsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllAdmins({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useSelector(getAdmins);
  const status = useSelector(getAdminStatus);
  const error = useSelector(getAdminError);

  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    setAdmins(data);
  }, [data]);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setAdmins(data);
      return;
    }

    const filtered = data.filter((admin) =>
      admin.name?.toLowerCase().includes(value)
    );

    setAdmins(filtered);
  };

  const profilePath = (id) => {
    navigate(`/founder/admins/profile/${id}`);
  };

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto  no-scrollbar">
      <BaseTable
        columns={AdminColumns}
        data={admins}
        profilePath={profilePath}
        pageLabel="Admins"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
      />
    </div>
  );
}
