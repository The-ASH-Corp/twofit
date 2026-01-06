import BaseForm from "@/components/form/BaseForm";
import { createAdmin } from "@/redux/features/admins/admin.thunk";
import { getAllPrograms } from "@/redux/features/program/program.thunk";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminForm() {
  const [programs, setPrograms] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fields = [
    {
      section: "Personal Information",
      position: "left",
      fields: [
        { name: "fullname", label: "Full Name", type: "text" },
        { name: "dob", label: "Date Of Birth", type: "date" },
        {
          name: "gender",
          label: "Gender",
          type: "radio",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
      ],
    },

    {
      section: "Contact Information",
      position: "left",
      fields: [
        { name: "email", label: "Email Address", type: "email" },
        { name: "phone", label: "Phone Number", type: "text" },
        { name: "address", label: "Address", type: "text" },
        { name: "password", label: "Password", type: "text" },
      ],
    },

    {
      section: "Role Assignment",
      position: "right",
      fields: [
        {
          name: "specialization",
          label: "Specialization",
          type: "multiple",
          options: [
            { label: "thyroid", value: "thyroid" },
            { label: "weight loss", value: "weight loss" },
            { label: "fun", value: "fun" },
          ],
        },
        { name: "experience", label: "Experience", type: "text" },
        { name: "qualification", label: "Qualification", type: "text" },
      ],
    },
    {
      section: "Program Assignment",
      position: "right",
      fields: [
        {
          name: "chooseProgram",
          label: "Choose Program",
          type: "multiple",
          options: programs.map((program) => ({
            key: program._id,
            label: program.title,
            value: program.title,
          })),
        },
      ],
    },

    {
      section: "Salary",

      position: "right",
      fields: [{ name: "baseSalary", label: "Base Salary", type: "number" }],
    },

    {
      section: "Account Setup",
      position: "right",
      fields: [
        {
          name: "autoSendWelcome",
          label: "Auto-send welcome message",
          type: "toggle",
        },
        {
          name: "autoSendGuide",
          label: "Auto-send Onboarding Guide",
          type: "toggle",
        },
        {
          name: "automatedReminder",
          label: "Automated Reminders",
          type: "toggle",
        },
      ],
    },
  ];

  const initialValues = {
    fullname: "",
    dob: "",
    gender: "", //need to add
    // Account Setup
    autoSendWelcome: false,
    autoSendGuide: false,
    automatedReminder: false,
  };

  const fetchPrograms = async () => {
    const response = await dispatch(
      getAllPrograms({ page: 1, limit: 10 })
    ).unwrap();
    setPrograms(response);
  };
  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleAdminCreation = async (values) => {
    const selectedProgram = programs.find(
      (program) => program.title == values.chooseProgram
    );

    try {
      await dispatch(
        createAdmin({ ...values, chooseProgram: selectedProgram._id })
      ).unwrap();
      toast("Admin created successfully", { type: "success" });
      navigate("/head/admins");
    } catch (error) {
      toast("Failed to create admin", { type: "error" });
    }
  };

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      onSubmit={(values) => handleAdminCreation(values)}
      heading={"Admin"}
    ></BaseForm>
  );
}
