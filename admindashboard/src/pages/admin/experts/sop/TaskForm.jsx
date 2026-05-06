import BaseForm from "@/components/form/BaseForm";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { createSop } from "@/redux/features/sop/sop.thunk";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

const TaskForm = () => {
  const fields = [
    {
      section: "Category Information",
      position: "left",
      fields: [
        { name: "title", label: "Title", type: "text" },
        {
          name: "timeSlot",
          label: "Time Slot",
          type: "select",
          options: [
            { label: "Morning", value: "Morning" },
            { label: "Lunch", value: "Lunch" },
            { label: "Evening", value: "Evening" },
            { label: "Night", value: "Night" },
          ],
        },
        { name: "description", label: "description", type: "textarea" },
      ],
    },
  ];

   const validationSchema = Yup.object({
     title: Yup.string()
       .required("Title is required")
       .min(3, "Title must be at least 3 characters"),

     description: Yup.string().required("Description is required"),

     timeSlot: Yup.string().required("Select time slot"),

   });

  const initialValues = {
    title: "",
    description: "",
    timeSlot: "",
  };

  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector(selectUser);
  const navigate = useNavigate()

    const handelSubmit = async (value) => {
         try {

            const payload = {
              ...value,
              coachId: id,
              adminId: user._id, // from auth state
            };

             const task = await dispatch(createSop(payload)).unwrap();
              toast.success("task created successfully");
              navigate(`/admin/experts/tasks/${id}`);
            } catch (error) {
              console.error("Failed to create task:", error);
            }
    };

  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        validationSchema={validationSchema}
        heading={"Add Task"}
        submitButton={"Save"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
};

export default TaskForm;
