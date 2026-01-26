import { deleteCategory } from '@/redux/features/category/category.thunk';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const DeletePopUp = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState(false)

      const handleDelete = async () => {
        // console.log("Delete ID:", row.id);
        try {
          await dispatch(deleteCategory({ id })).unwrap();
          toast.success("Category deleted successfully");
          navigate("/founder/categories");
        } catch (error) {
          setError(true)
          toast.error(error.message);
        }
      };
  return (
    <>
      {/* Overlay */}

      {/* Modal */}
      <div className="relative flex items-center justify-center w-full h-[calc(100vh-120px)]">
        <div className="fixed inset-0 z-30 bg-black/5 w-full h-screen"></div>
        <div className="absolute z-40 bg-white rounded-lg w-80 p-5 shadow-xl">
          <h3 className="text-lg font-semibold mb-2">Delete Category?</h3>

          <p className="text-sm text-gray-600 mb-4">
            {error ? "Cannot delete category" : "This action cannot be undone."}
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => navigate("/founder/categories")}
              className="px-4 py-2 rounded bg-gray-100"
            >
              Cancel
            </button>

            {!error && (
              <button
                onClick={() => handleDelete()}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePopUp