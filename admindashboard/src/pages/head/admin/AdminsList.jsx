import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/table/BaseTable";
import { AdminColumns } from "./AdminColumns";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAdminByProgramId,
} from "@/redux/features/admins/admin.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { SyncLoader } from "react-spinners";
import { deleteAdmin } from "@/redux/features/admins/admin.thunk";
import { toast } from "react-toastify";
import { getAllProgramsByCategory } from "@/redux/features/program/program.thunk";

export default function AdminsList() {
  const user = useAppSelector(selectUser);
  const [admins, setAdmins] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const dispatch = useDispatch();
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const prgms = await dispatch(
        getAllProgramsByCategory({
          category: user?.programCategory,
          page,
          limit,
        }),
      ).unwrap();
      const programIds = prgms.data.map((program) => program._id);

      const admin = await dispatch(
        getAdminByProgramId({ programId: programIds, page, limit })).unwrap();

      setAdmins(admin.data);
      setTotalCount(admin.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
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
      return admin.name.toLowerCase().includes(value);
    });
    setAdmins(filteredAdmins);
    if (value == "") {
      fetchAdminData();
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [page, limit]);

  useEffect(() => {
    const handleOpenDelete = (e) => {
      setAdminToDelete(e.detail);
      setDeleteModalOpen(true);
    };

    window.addEventListener("open-delete-admin", handleOpenDelete);
    return () =>
      window.removeEventListener("open-delete-admin", handleOpenDelete);
  }, []);

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      await dispatch(deleteAdmin(adminToDelete.id)).unwrap();
      toast.success("Admin deleted successfully");
      setDeleteModalOpen(false);
      setAdminToDelete(null);
      fetchAdminData();
    } catch (err) {
      toast.error(err || "Failed to delete admin");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );

  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
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
        totalCount={totalCount}
      />

      {deleteModalOpen && (
        <div className="relative flex items-center justify-center w-full h-[calc(100vh-120px)]">
          {/* Overlay */}
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
