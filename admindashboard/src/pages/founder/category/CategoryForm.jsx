import BaseForm from "@/components/form/BaseForm";
import { createCategory } from "@/redux/features/category/category.thunk";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CategoryForm() {
  const fields = [
    {
      section: "Category Information",
      position: "left",
      fields: [
        { name: "name", label: "Category Name", type: "text" },
        { name: "programLimit", label: "Max Program Limit", type: "number" },
      ],
    },
  ];
  const initialValues = {
    name: "shebin",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelSubmit = async (value) => {
    try {
      console.log(value);
      const category = await dispatch(createCategory(value)).unwrap();
      if (category.success) {
        toast.success("Category created successfully");
        navigate("/founder/category");
      } else {
        toast.error("Failed to create category");
      } 
    } catch (error) {
      console.error("Category creation failed:", error);
    }
  };

  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        heading={"Add Category"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
}
