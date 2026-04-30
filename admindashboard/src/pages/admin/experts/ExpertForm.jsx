import BaseForm from "@/components/form/BaseForm";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { createCoach } from "@/redux/features/coach/coach.thunk";
import { refreshProfile } from "@/redux/features/auth/auth.thunk";
import {
  getAllPrograms,
} from "@/redux/features/program/program.thunk";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchTherapyPlans } from "@/redux/features/therapy/therapy.thunk";
import * as Yup from "yup";

export default function ExpertForm() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [program, setProgram] = useState(null);
  const [therapy, setTherapy] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getAllPrograms({ page: 1, limit: 10000 }),
    ).then((res) => {
      setProgram(res.payload.data);
    });
    dispatch(fetchTherapyPlans({ page: 1, limit: 10000 })).then((res) => {
      setTherapy(res.payload.data.therapy);
    });
  }, [dispatch, user?._id]);

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
      position: "left",
      fields: [
        {
          name: "role",
          label: "Choose Role",
          type: "select",
          options: [
            { label: "Trainer", value: "Trainer" },
            { label: "Dietician", value: "Dietician" },
            { label: "Therapist", value: "Therapist" },
          ],
          onChange: (e, form) => {
            setSelectedRole(e.target.value);
            form.setFieldValue("chooseProgram", []);
            form.setFieldValue("chooseTherapy", []);
          },
        },
        {
          name: "specialization",
          label: "Specialization",
          type: "multiple",
          options: user?.specialization?.map((spec) => ({
            label: spec,
            value: spec,
          })),
          allowCustom: true,
        },
        { name: "experience", label: "Experience", type: "number" },
        { name: "qualification", label: "Qualification", type: "text" },
        {
          name: "languages",
          label: "Languages",
          type: "multiple",
          options: [
            { label: "English", value: "english" },
            { label: "Malayalam", value: "malayalam" },
            { label: "Tamil", value: "tamil" },
            { label: "Hindi", value: "hindi" },
          ],
          allowCustom: true,
        },
      ],
    },
    {
      section: "Program Assignment",
      position: "left",
      fields: [
        selectedRole === "Therapist"
          ? {
              name: "chooseTherapy",
              label: "Choose Therapy",
              type: "multiple",
              options: therapy?.map((thr) => ({
                label: thr.name,
                value: thr?._id,
              })),
            }
          : {
              name: "chooseProgram",
              label: "Choose Program",
              type: "multiple",
              options: program?.map((prog) => ({
                label: prog.title,
                value: prog?._id,
              })),
            },
      ],
    },
    {
      section: "Work Assignment",
      position: "right",
      fields: [
        { name: "clientLimit", label: "Max Client Limit", type: "text" },
        {
          name: "workingdays",
          label: "Working Days",
          type: "checkbox-group",
          options: [
            { label: "Monday", value: "monday" },
            { label: "Tuesday", value: "tuesday" },
            { label: "Wednesday", value: "wednesday" },
            { label: "Thursday", value: "thursday" },
            { label: "Friday", value: "friday" },
            { label: "Saturday", value: "saturday" },
            { label: "Sunday", value: "sunday" },
          ],
        },
        {
          type: "time-range",
          label: "Working Hours",
          startName: "workingHours.startTime",
          endName: "workingHours.endTime",
        },
        {
          type: "time-range",
          label: "Break Slots",
          startName: "breakSlots.startTime",
          endName: "breakSlots.endTime",
        },
        { name: "dailyConsults", label: "Max Daily Consults", type: "text" },
        { name: "responseTime", label: "Response Time", type: "text" },
      ],
    },
    {
      section: "Salary",

      position: "right",
      fields: [{ name: "baseSalary", label: "Base Salary", type: "text" }],
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
    role: "",
    specialization: [],
    experience: "",
    qualification: "",
    languages: [],
    clientLimit: "",
    workingdays: [],
    workingHours: {
      startTime: "",
      endTime: "",
    },
    breakSlots: {
      startTime: "",
      endTime: "",
    },
    ratingIncentive: false,
    responseTimeIncentive: false,
    complianceIncentive: false,
    autoSendWelcome: false,
    autoSendGuide: false,
    automatedReminder: false,
    chooseProgram: Array.isArray(user?.program) ? user.program : [],
    chooseTherapy: Array.isArray(user?.therapy) ? user.therapy : [],
    dailyConsults: "",
    responseTime: "",
    baseSalary: "",
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

    role: Yup.string()
      .oneOf(["Trainer", "Dietician", "Therapist"], "Choose a valid role")
      .required("Role is required"),

    specialization: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one specialization")
      .required("Specialization is required"),

    experience: Yup.number()
      .required("Experience is required")
      .min(0, "Experience must be at least 0")
      .max(100, "Experience must be less than 100"),

    qualification: Yup.string().trim().required("Qualification is required"),

    languages: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one language")
      .required("Languages are required"),

    chooseProgram: Yup.array().when("role", {
      is: (role) => role !== "Therapist",
      then: (schema) =>
        schema
          .of(Yup.string())
          .min(1, "Choose at least one program")
          .required("Choose Program is required"),
      otherwise: (schema) => schema.of(Yup.string()),
    }),

    chooseTherapy: Yup.array().when("role", {
      is: "Therapist",
      then: (schema) =>
        schema
          .of(Yup.string())
          .min(1, "Choose at least one therapy")
          .required("Choose Therapy is required"),
      otherwise: (schema) => schema.of(Yup.string()),
    }),

    clientLimit: Yup.number()
      .typeError("Max Client Limit must be a number")
      .required("Max Client Limit is required")
      .positive("Max Client Limit must be greater than 0"),

    workingdays: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one working day")
      .required("Working Days are required"),

    workingHours: Yup.object({
      startTime: Yup.string().required("Working start time is required"),
      endTime: Yup.string()
        .required("Working end time is required")
        
    }),

    breakSlots: Yup.object({
      startTime: Yup.string().required("Break start time is required"),
      endTime: Yup.string()
        .required("Break end time is required")
    }),

    dailyConsults: Yup.number()
      .typeError("Max Daily Consults must be a number")
      .required("Max Daily Consults is required")
      .positive("Max Daily Consults must be greater than 0"),

    responseTime: Yup.string().trim().required("Response Time is required"),

    baseSalary: Yup.number()
      .typeError("Base Salary must be a number")
      .required("Base Salary is required")
      .positive("Base Salary must be greater than 0"),
  });

  const handleCoachCreation = async (values) => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      // Append all form values to FormData
      Object.keys(values).forEach((key) => {
        if (key === "workingHours" || key === "breakSlots") {
          // For nested objects, stringify them
          formData.append(key, JSON.stringify(values[key]));
        } else if (Array.isArray(values[key])) {
          // For arrays, stringify
          formData.append(key, JSON.stringify(values[key]));
        } else if (typeof values[key] === "boolean") {
          // For booleans, convert to string explicitly
          formData.append(key, values[key].toString());
        } else if (
          values[key] !== null &&
          values[key] !== undefined &&
          values[key] !== ""
        ) {
          // For other values
          formData.append(key, values[key]);
        }
      });

      if (user?._id) {
        formData.append("adminId", user?._id);
      }
      const coach = await dispatch(createCoach(formData));

      if (coach.meta.requestStatus === "fulfilled") {
        await dispatch(
          refreshProfile({ id: user?._id, role: user.role }),
        ).unwrap();
        toast("Coach created successfully", { type: "success" });
        navigate(-1);
      } else {
        toast(coach.message || "Failed to create coach 1", { type: "error" });
      }
    } catch (err) {
      toast(err?.message || "Failed to create coach 1", { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
       validationSchema={validationSchema}
      onSubmit={(values) => handleCoachCreation(values)}
      heading="Expert"
      submitButton="Create Expert"
      isLoading={isLoading}
    ></BaseForm>
  );
}
