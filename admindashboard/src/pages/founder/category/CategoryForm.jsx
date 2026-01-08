import BaseForm from "@/components/form/BaseForm";
import { createCategory } from "@/redux/features/category/category.thunk";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

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
    name: "",
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelSubmit = (value) => {
        console.log(value);
        dispatch(createCategory(value))
        navigate("/founder/category");
      };

  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
}
