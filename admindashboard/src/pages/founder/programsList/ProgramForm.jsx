import BaseForm from "@/components/form/BaseForm";
import { createProgram } from "@/redux/features/program/program.thunk";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
 
export default function ProgramForm() {
  const navigate=useNavigate()
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
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
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

   const dispatch = useDispatch()

  const handleProgramCreation =async(values)=>{
    try{
      const program=await dispatch(createProgram(values)).unwrap()
      navigate('/programs')
      
    }catch(error){
       console.error("Program creation failed:", error);
    }
  
    // navigate('/programs')
        
  }
  return (
    <div>
      <BaseForm fields={fields} initialValues={initialValues} onSubmit={(values)=>{handleProgramCreation(values)}}/>
    </div>
  );
}
