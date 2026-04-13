import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";

const ActionMenu = ({ row, editActionPath, deleteActionPath, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Close menu when clicking outside
  React.useEffect(() => {
    const closeMenu = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', closeMenu);
    }
    return () => document.removeEventListener('click', closeMenu);
  }, [isOpen]);

  const handleEdit = (e) => {
    e.stopPropagation(); // Stop event from bubbling to document
    setIsOpen(false);
    // Use row.original._id primarily, fallout to row.id if needed
    const id = row.original?._id || row.original?.id || row.id;
    if (onEdit) {
      onEdit(row);
    } else if (editActionPath && id) {
      navigate(`${editActionPath}${id}`);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Stop event from bubbling to document
    setIsOpen(false);
    const id = row.original?._id || row.original?.id || row.id;
    if (onDelete) {
        onDelete(row);
    } else if (deleteActionPath && id) {
      navigate(`${deleteActionPath}${id}`);
    }
  };

  return (
    <div className="relative z-50"> 
    {/* Added z-50 to ensure menu appears above other elements */}
      <button
        type="button" 
        // Added type='button' to prevent form submission if inside a form
        className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault(); // Prevent default button behavior
          setIsOpen((prev) => !prev);
        }}
      >
        <BsThreeDotsVertical size={18} />
      </button>

      {isOpen && (
        <div
            role="menu"
            className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-[100] flex flex-col"
            onClick={(e) => e.stopPropagation()} 
        >
            {(editActionPath || onEdit) && (
              <button
                type="button"
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0A4F48] transition-colors"
              >
                Edit
              </button>
            )}
            {(deleteActionPath || onDelete) && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
