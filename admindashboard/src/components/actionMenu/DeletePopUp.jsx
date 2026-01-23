import React from 'react'

const DeletePopUp = ({ onClose, onConfirm }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/10"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="bg-white rounded-lg w-80 p-5 shadow-xl"
          
        >
          <h3 className="text-lg font-semibold mb-2">Delete Category?</h3>

          <p className="text-sm text-gray-600 mb-4">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeletePopUp