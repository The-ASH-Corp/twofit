import React, { useEffect } from 'react'
import BaseTable from '../../../components/table/BaseTable'
import { AdminColumns } from './AdminColumns'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllAdmins } from '@/redux/features/admins/admin.thunk';
import { selectAdminError, selectAdminStatus, selectAllAdmin } from '@/redux/features/admins/admins.selecters';

export default function AdminsList() {
  const page = 1;
  const limit = 15;
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const profilePath = (id) => {
    navigate(`/founder/admins/profile/${id}`);
  };

  useEffect(() => {
    dispatch(getAllAdmins({ page, limit }));
  }, [dispatch]);

  const admins = useSelector(selectAllAdmin);
  const status = useSelector(selectAdminStatus);
  const error = useSelector(selectAdminError);

  console.log(admins);

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error?.error}</p>;

  return (
    <div>
      <BaseTable
        columns={AdminColumns}
        data={admins}
        // actionLabel="Add Admins"
        actionPath="/head/admins/add-admin"
        profilePath={profilePath}
        pageLabel={"Admins"}
      />
    </div>
  );
}
