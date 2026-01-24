import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from "react-icons/io";
import DeletePopUp from './DeletePopUp';

const ActionMenu = ({ row, editActionPath }) => {

  const [activeRowId, setActiveRowId] = useState(null);  
  const [showDelete, setShowDelete] = useState(false);
  const isOpen = activeRowId === row.id;
  const navigate = useNavigate();
  

  const handelEdit = (id) => {
    // console.log(id);
    setActiveRowId(false);
    navigate(`${editActionPath}${id}`);
  };

  const handleDelete = () => {
    setShowDelete(false);
    setActiveRowId(null);
    console.log("Delete ID:", row.id);
    // dispatch(deleteCategory(row.id))
  };
  const handleClose = () => {
    setShowDelete(false);
    console.log("Delete ID2:", row.id);
  };

  return (
    <div className="relative h-3">
      <button
        className="w-full  text-start pl-2"
        onClick={(e) => {
          e.stopPropagation();
          setActiveRowId(isOpen ? null : row.id);
        }}
      >
        ...
      </button>

      {isOpen && !showDelete && (
        <>
          <div
            onClick={() => setActiveRowId(null)}
            className="fixed inset-0 z-30 bg-black/2 w-full h-screen"
          ></div>
          <div
            className="absolute z-40 rounded-lg   shadow-[0_10px_30px_rgba(0,0,0,0.25)] w-30 h-fit p-2 bg-white flex flex-col items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => setActiveRowId(false)}
              className="w-full flex items-center justify-end px-1"
            >
              <IoMdClose />
            </div>
            <button
              onClick={() => handelEdit(row.id)}
              className="w-full bg-[#EBF3F2] hover:bg-[#0A4F48] hover:text-white p-2 rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setShowDelete(true);
                setActiveRowId(null);
              }}
              className=" w-full bg-[#EBF3F2] hover:bg-red-400 hover:text-white p-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </>
      )}
      {showDelete && (
        <DeletePopUp onClose={handleClose} onConfirm={handleDelete} />
      )}
    </div>
  );
};

export default ActionMenu