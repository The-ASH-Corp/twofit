import BaseForm from "@/components/form/BaseForm";
import { selectSopError, selectSopStatus, selectSopTask } from "@/redux/features/sop/sop.selector";
import {  getSopById, updateSOP } from "@/redux/features/sop/sop.thunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import * as Yup from "yup";

const TaskEditForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSopById({ SOPId: id }));
  }, [dispatch, id]);

  const task = useSelector(selectSopTask);
  const status = useSelector(selectSopStatus);
  const error = useSelector(selectSopError);

  const fields = [
    {
      section: "Task Information",
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
    title: task?.title,
    description: task?.description,
    timeSlot: task?.timeSlot,
  };

  const navigate = useNavigate();

  const handelSubmit = async (value) => {
    try {
       await dispatch(
        updateSOP({ SOPId: id, updatedData : value}),
      ).unwrap();

      toast.success("task updated successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error || "Failed to update task");
    }
  };

   if (status === "loading")
     return (
       <div className="flex justify-center items-center h-[calc(100vh-120px)]">
         <SyncLoader color="#0A4F48" loading margin={2} size={20} />
       </div>
     );
   if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-[calc(100vh-180px)]">
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        heading={"Edit Task"}
        submitButton={"Save & Update"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
};

export default TaskEditForm;
