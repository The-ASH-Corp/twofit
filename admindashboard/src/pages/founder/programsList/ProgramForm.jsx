import BaseForm from "@/components/form/BaseForm";
import React from "react";

export default function ProgramForm() {
  const fields = [
    {
      section: "Program Information",
      position:"left",
      fields: [
        { name: "title", label: "Program Name", type: "text" },
        { name: "image", label: "Choose Image", type: "file" },
        { name: "category", label: "Choose Your Category", type: "select" ,options:[]},
        {
          name: "duration",
          label: "Duration",
          type: "select",
          options: [
            { label: "30 Days", value: 30 },
            { label: "60 Days", value: 60 },
            { label: "90 Days", value: 90 },
          ],
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Draft", value: "Draft" },
            { label: "Published", value: "Published" },
          ],
        },
      ],
    },
  ];

  const initialValues = {
    title: "",
    image: "",
    category: "",
    duration: "",
    status: "",
  };
  return (
    <div>
      <BaseForm fields={fields} initialValues={initialValues} onSubmit={()=>{}}/>
    </div>
  );
}
