import * as Yup from "yup";
import BaseForm from "../../../components/form/BaseForm";
import { createClient } from "../../../redux/features/auth/auth.thunk";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getProgramById } from "@/redux/features/program/program.thunk";
import { useEffect, useState } from "react";
import { getAllCoachesByAdmin } from "@/redux/features/coach/coach.thunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const initialValues = {
  fullname: "",
  dob: "",
  gender: "", //need to add
};

const schema = Yup.object({
  fullname: Yup.string().required("Required"),
  dob: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
});

export default function ClientForm() {

  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [coachesOfAdmin, setCoachesOfAdmin] = useState([]);
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const fetchProgram = async () => {
    const program = await dispatch(getProgramById(user.program));
    const coachessOfAdmin = await dispatch(getAllCoachesByAdmin(user.experts));
    console.log(coachessOfAdmin.payload);
    setProgram(program.payload);
    setCoachesOfAdmin(coachessOfAdmin.payload);
  };

  useEffect(() => {
    fetchProgram();
  }, []);

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
            { label: "Obesity", value: "obesity" },
            { label: "None", value: "none" },
          ],
        },
        { name: "allergy", label: "Allergies", type: "multiple", options: [
          { label: "Peanuts", value: "peanuts" },
          { label: "Seafood", value: "seafood" },
        ] },
        {
          name: "foodPreference",
          label: "Food Preference",
          type: "select",
          options: [
            { label: "Vegetarian", value: "vegetarian" },
            { label: "Non-Vegetarian", value: "non_vegetarian" },
          ],
        },
        {
          name: "fitnessGoal",
          label: "Fitness Goal",
          type: "select",
          options: [
            { label: "Weight Loss", value: "weight_loss" },
            { label: "Muscle Gain", value: "muscle_gain" },
          ],
        },
        { name: "currentWeight", label: "Current Weight", type: "text" },
        { name: "targetWeight", label: "Target Weight", type: "text" },
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
          options: program
            ? [{ label: program.title, value: program._id }]
            : [],
        },
        {
          name: "duration",
          label: "Duration",
          type: "select",
          options: program
            ? program.duration.map((d) => ({ label: d, value: d }))
            : [],
        },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "endDate", label: "End Date", type: "date" },
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
            ?coachesOfAdmin?.filter((coach) => coach.role==="Dietician")
            .map((coach) => ({ label: coach.name, value: coach._id })) :[],
        },
        {
          name: "trainer",
          label: "Trainer",
          type: "select",
          options: coachesOfAdmin
            ?coachesOfAdmin.filter((coach) => coach.role ==="Trainer")
            .map((coach) => ({ label: coach.name, value: coach._id })) :[],
        },
        {
          name: "therapist",
          label: "Therapist",
          type: "select",
          options: coachesOfAdmin
            ?coachesOfAdmin.filter((coach) => coach.role ==="Therapist")
            .map((coach) => ({ label: coach.name, value: coach._id })) :[],
        },
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
    const updatedValues = { ...values, adminId: user._id };
   const client = await dispatch(createClient(updatedValues));
   if(client.payload.success){
    toast.success("Client created successfully");
    navigate(-1);
   }else{
    toast.error("Failed to create client");
   }
  };

  return (
    <BaseForm
      fields={fields}
      initialValues={initialValues}
      validationSchema={schema}
      submitLabel="Login"
      onSubmit={(values) => handleUserCreation(values)}
    />
  );
}
