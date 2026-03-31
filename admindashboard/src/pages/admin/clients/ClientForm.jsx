import * as Yup from "yup";
import BaseForm from "../../../components/form/BaseForm";
import { createClient } from "../../../redux/features/auth/auth.thunk";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getAllProgramsByAdmin } from "@/redux/features/program/program.thunk";
import { useEffect, useState } from "react";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchTherapyPlans } from "@/redux/features/therapy/therapy.thunk";

const initialValues = {
  fullname: "",
  dob: "",
  gender: "",
  email: "",
  phone: "",
  address: "",
  medicalconditions: [],
  allergy: [],
  foodPreference: "",
  fitnessGoal: "",
  height: "",
  currentWeight: "",
  targetWeight: "",
  workoutExperience: "",
  programType: "",
  therapyType: "",
  duration: "",
  startDate: "",
  endDate: "",
  dietician: "",
  trainer: "",
  therapist: "",
  autoSendWelcome: false,
  autoSendGuide: false,
  automatedReminder: false,
};

const schema = Yup.object({
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

  medicalconditions: Yup.array().of(Yup.string()),
  allergy: Yup.array().of(Yup.string()),

  foodPreference: Yup.string().required("Food Preference is required"),
  fitnessGoal: Yup.string().required("Fitness Goal is required"),
  workoutExperience: Yup.string().required("Workout Experience is required"),

  height: Yup.number()
    .typeError("Height must be a number")
    .required("Height is required")
    .positive("Height must be greater than 0"),

  currentWeight: Yup.number()
    .typeError("Current Weight must be a number")
    .required("Current Weight is required")
    .positive("Current Weight must be greater than 0"),

  targetWeight: Yup.number()
    .typeError("Target Weight must be a number")
    .required("Target Weight is required")
    .positive("Target Weight must be greater than 0"),

  programType: Yup.string().required("Program Type is required"),
  duration: Yup.string().required("Duration is required"),
  startDate: Yup.date().required("Start Date is required"),
  endDate: Yup.date()
    .required("End Date is required")
    .min(Yup.ref("startDate"), "End Date must be after Start Date"),

  therapyType: Yup.string(),

  dietician: Yup.string().required("Dietician is required"),
  trainer: Yup.string().required("Trainer is required"),
  therapist: Yup.string().when("therapyType", {
    is: (therapyType) => Boolean(therapyType),
    then: (fieldSchema) => fieldSchema.required("Therapist is required"),
    otherwise: (fieldSchema) => fieldSchema,
  }),
});

export default function ClientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [coachesOfAdmin, setCoachesOfAdmin] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedTherapyType, setSelectedTherapyType] = useState("");
  const [therapy, setTherapy] = useState([]);
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const programRes = await dispatch(
        getAllProgramsByAdmin({ adminId: user?._id, page: 1, limit: 120 }),
      );
      setProgram(programRes?.payload?.data || []);

      const coachessOfAdmin = await dispatch(
        getAllCoachesByAdmin(user?.experts),
      );
      setCoachesOfAdmin(coachessOfAdmin?.payload || []);

      const therapyRes = await dispatch(
        fetchTherapyPlans({ page: 1, limit: 100 }),
      );
      if (therapyRes?.payload?.data) {
        setTherapy(therapyRes.payload.data.therapy);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [dispatch, user]);

  const setProgramId = (programId) => {
    const selectedProgram = program?.find((p) => p?._id === programId);
    setSelectedProgram(selectedProgram);
  };

  const calculateEndDate = (start, durationValue, setFieldValue) => {
    if (start && durationValue) {
      const date = new Date(start);
      if (isNaN(date.getTime())) return;

      const durationString = String(durationValue).toLowerCase();
      // Match number, optionally followed by unit. Default unit to 'days' if missing.
      const match = durationString.match(/(\d+)(?:\s*([a-z]+))?/);

      if (match) {
        const number = parseInt(match[1], 10);
        const unit = match[2] || "days"; // Default to days

        let endDate = new Date(date);

        if (unit.includes("day")) {
          endDate.setUTCDate(date.getUTCDate() + number);
        } else if (unit.includes("week")) {
          endDate.setUTCDate(date.getUTCDate() + number * 7);
        } else if (unit.includes("month")) {
          endDate.setUTCMonth(date.getUTCMonth() + number);
        } else if (unit.includes("year")) {
          endDate.setUTCFullYear(date.getUTCFullYear() + number);
        }

        const formattedDate = endDate.toISOString().split("T")[0];
        setFieldValue("endDate", formattedDate);
      }
    }
  };

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
      ],
    },

    {
      section: "Health Profile",
      position: "left",
      fields: [
        {
          name: "medicalconditions",
          label: "Medical Conditions",
          type: "multiple",
          options: [
            { label: "Diabetes", value: "diabetes" },
            { label: "Hypertension", value: "hypertension" },
            { label: "Asthma", value: "asthma" },
            { label: "Heart Disease", value: "heart_disease" },
            { label: "None", value: "none" },
          ],
          allowCustom: true,
        },
        {
          name: "allergy",
          label: "Allergies",
          type: "multiple",
          options: [
            { label: "Peanuts", value: "peanuts" },
            { label: "Seafood", value: "seafood" },
          ],
          allowCustom: true,
        },
        {
          name: "foodPreference",
          label: "Food Preference",
          type: "select",
          options: [
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Non-Vegetarian", value: "non_vegetarian" },
          ],
          allowCustom: true,
        },
        {
          name: "fitnessGoal",
          label: "Fitness Goal",
          type: "select",
          options: [
            { label: "Weight Loss", value: "weight_loss" },
            { label: "Muscle Gain", value: "muscle_gain" },
          ],
          allowCustom: true,
        },
        { name: "height", label: "Height", type: "text" },
        { name: "currentWeight", label: "Current Weight", type: "text" },
        { name: "targetWeight", label: "Target Weight", type: "text" },
        {
          name: "workoutExperience",
          label: "Workout Experience",
          type: "select",
          options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Expert", value: "expert" },
          ],
          allowCustom: false,
        },
      ],
    },

    {
      section: "Program Assignment",
      position: "right",
      fields: [
        {
          name: "programType",
          label: "Program Type",
          type: "select",
          options: program?.map((prog) => ({
            label: prog.title,
            value: prog?._id,
          })),
          onChange: (e) => setProgramId(e.target.value),
        },
        {
          name: "duration",
          label: "Duration",
          type: "select",
          options: selectedProgram?.duration?.map((d) => ({
            label: d,
            value: d,
          })),
          onChange: (e, form) => {
            calculateEndDate(
              form.values.startDate,
              e.target.value,
              form.setFieldValue,
            );
          },
        },
        {
          name: "startDate",
          label: "Start Date",
          type: "date",
          onChange: (e, form) => {
            calculateEndDate(
              e.target.value,
              form.values.duration,
              form.setFieldValue,
            );
          },
        },
        { name: "endDate", label: "End Date", type: "date", readOnly: true },
      ],
    },
    {
      section: "Therapy Assignment",
      position: "right",
      fields: [
        {
          name: "therapyType",
          label: "Therapy",
          type: "select",
          options: therapy
            ? therapy.map((t) => ({
                label: t.name,
                value: t?._id,
              }))
            : [],
          onChange: (e) => setSelectedTherapyType(e.target.value),
        },
      ],
    },
    {
      section: "Expert Assignment",
      position: "right",
      fields: [
        {
          name: "dietician",
          label: "Dietician",
          type: "select",
          options: coachesOfAdmin
            ? coachesOfAdmin
                ?.filter((coach) => {
                  if (coach?.role !== "Dietician") return false;
                  // If a program is selected, only show dieticians assigned to that program
                  if (selectedProgram?._id) {
                    return coach.assignedPrograms?.some(
                      (p) => p?._id === selectedProgram?._id,
                    );
                  }
                  return true;
                })
                ?.map((coach) => ({ label: coach.name, value: coach?._id }))
            : [],
        },
        {
          name: "trainer",
          label: "Trainer",
          type: "select",
          options: coachesOfAdmin
            ? coachesOfAdmin
                ?.filter((coach) => {
                  if (coach?.role !== "Trainer") return false;
                  // If a program is selected, only show trainers assigned to that program
                  if (selectedProgram?._id) {
                    return coach.assignedPrograms?.some(
                      (p) => p?._id === selectedProgram?._id,
                    );
                  }
                  return true;
                })
                ?.map((coach) => ({ label: coach.name, value: coach?._id }))
            : [],
        },
        ...(selectedTherapyType
          ? [
              {
                name: "therapist",
                label: "Therapist",
                type: "select",
                options: coachesOfAdmin
                  ? coachesOfAdmin
                      ?.filter((coach) => coach?.role === "Therapist")
                      ?.map((coach) => ({
                        label: coach.name,
                        value: coach?._id,
                      }))
                  : [],
              },
            ]
          : []),
      ],
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

  const handleUserCreation = async (values) => {
    setIsLoading(true);
    try {
      const updatedValues = { ...values, adminId: user?._id };
      const client = await dispatch(createClient(updatedValues));
      if (client.payload.success) {
        toast.success("Client created successfully");
        navigate(-1);
      } else {
        toast.error("Failed to create client");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to create client");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      validationSchema={schema}
      submitLabel="Login"
      submitButton={"Create Client"}
      isLoading={isLoading}
      onSubmit={(values) => handleUserCreation(values)}
    />
  );
}
