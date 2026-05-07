import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { AdminColumns } from "./AdminColumns";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAdmin, getFounderAllAdmins } from "@/redux/features/admins/admin.thunk";
import {
  getAdminError,
  getAdminStatus,
  selectAdminCount,
  selectFounderAllAdmins,
} from "@/redux/features/admins/admins.selecters";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function AdminsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFounderAllAdmins({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useSelector(selectFounderAllAdmins);
  const totalCount = useSelector(selectAdminCount);
  const status = useSelector(getAdminStatus);
  const error = useSelector(getAdminError);

  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    setAdmins(data);
  }, [data]);

  useEffect(() => {
    const handleOpenDelete = (e) => {
      setAdminToDelete(e.detail);
      setDeleteModalOpen(true);
    };

    window.addEventListener("open-delete-founder-admin", handleOpenDelete);

    return () =>
      window.removeEventListener("open-delete-founder-admin", handleOpenDelete);
  }, []);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setAdmins(data);
      return;
    }

    const filtered = data.filter((admin) =>
      admin.adminName?.toLowerCase().includes(value),
    );

    setAdmins(filtered);
  };

  const profilePath = (id) => {
    navigate(`/founder/admins/profile/${id}`);
  };

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete?.id) return;
    try {
      await dispatch(deleteAdmin(adminToDelete.id)).unwrap();
      toast.success("Admin deleted successfully");
      setDeleteModalOpen(false);
      setAdminToDelete(null);
      dispatch(getFounderAllAdmins({ page, limit }));
    } catch (err) {
      toast.error(err || "Failed to delete admin");
    }
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-156px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className=" pb-4 overflow-auto no-scrollbar">
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
        totalCount={totalCount}
      />

      {deleteModalOpen && (
        <div className="relative flex items-center justify-center w-full h-[calc(100vh-120px)]">
          <div
            className="fixed inset-0 z-30 bg-black/5 w-full h-screen"
            onClick={() => setDeleteModalOpen(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-white rounded-lg w-80 p-5 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete Admin?</h3>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete {adminToDelete?.name}? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded bg-[#EBF3F2]"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteAdmin}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
