import BaseForm from "@/components/form/BaseForm";
import { createAdmin } from "@/redux/features/admins/admin.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getAllProgramsByCategory } from "@/redux/features/program/program.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function AdminForm() {
  const user = useAppSelector(selectUser)
  const [programs, setPrograms] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[isLoading,setIsLoading]=useState(false)

  const fetchPrograms = useCallback(async () => {
    const response = await dispatch(
      getAllProgramsByCategory({category: user.programCategory, page: 1, limit: 1000})
    ).unwrap();
    setPrograms(response.data);
  }, [dispatch, user.programCategory]);
  
  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

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
              { label: "pcod", value: "pcod" },
              { label: "thyroid", value: "thyroid" },
              {label:"wight loss",value:"weight loss"},
              {label:"muscle gain",value:"muscle gain"},
              {label:"weight gain",value:"weight gain"},
            ],
            allowCustom: true,
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
          options:programs?.map((program) => ({
            key: program?._id,
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
    gender: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    specialization: [],
    experience: "",
    qualification: "",
    chooseProgram: [],
    baseSalary: "",
    // Account Setup
    autoSendWelcome: false,
    autoSendGuide: false,
    automatedReminder: false,
  };

  const validationSchema = Yup.object({
    fullname: Yup.string()
      .trim()
      .required("Full Name is required")
      .min(3, "Full Name must be at least 3 characters"),

    dob: Yup.date()
      .required("Date Of Birth is required")
      .max(new Date(), "Date Of Birth cannot be in the future"),

    gender: Yup.string()
      .oneOf(["male", "female"], "Gender is required")
      .required("Gender is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email Address is required"),

    phone: Yup.string()
      .required("Phone Number is required")
      .matches(/^[0-9]{10}$/, "Phone Number must be 10 digits"),

    address: Yup.string()
      .trim()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),

    specialization: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one specialization")
      .required("Specialization is required"),

    experience: Yup.string().trim().required("Experience is required"),

    qualification: Yup.string().trim().required("Qualification is required"),

    chooseProgram: Yup.array()
      .of(Yup.string())
      .min(1, "Choose at least one program")
      .required("Choose Program is required"),

    baseSalary: Yup.number()
      .typeError("Base Salary must be a number")
      .required("Base Salary is required")
      .positive("Base Salary must be greater than 0"),
  });

  const handleAdminCreation = async (values) => {
    setIsLoading(true);
    const selectedProgramIds = values.chooseProgram.map(title => 
      programs.find(program => program.title === title)?._id
    ).filter(Boolean);
    try {
      await dispatch(
        createAdmin({
          ...values,
          chooseProgram: selectedProgramIds,
          headId: user?._id,
        })
      ).unwrap();
      toast("Admin created successfully", { type: "success" });
      navigate("/head/admins");
    } catch (error) {
      toast(error?.message || "Failed to create admin", { type: "error" });
    } finally {
      setIsLoading(false);
    }

  };
  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => handleAdminCreation(values)}
      heading={"Admin"}
      submitButton={"Create Admin"}
      isLoading={isLoading}
    ></BaseForm>
  );
}
