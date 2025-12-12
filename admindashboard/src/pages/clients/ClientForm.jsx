import * as Yup from "yup";
import BaseForm from "../../components/form/BaseForm";

const fields = [
  {
    section: "Personal Information",
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
    fields: [
      { name: "email", label: "Email Address", type: "email" },
      { name: "phone", label: "Phone Number", type: "text" },
      { name: "address", label: "Address", type: "text" },
    ],
  },

  {
    section: "Health Profile",
    fields: [
      { name: "medicalconditions", label: "Medical Conditions", type: "text" },
      { name: "allergy", label: "Allergies", type: "text" },
      { name: "food-pref", label: "Food Preferance", type: "text" },
      {name:"fitnessgoal",label:"Fitness Goal",type:"text"},
      {name:"currentWeight",label:"Current Weight",type:"text"},
      {name:"targetWeight",label:"Target Weight",type:"text"}

    ],
  },

  {
    section:"Program Assignment",
    fields:[
        {name:"ptype",label:"Program Type",type:"text"},
        {name:"duration",label:"Duration",type:"text"},
        {name:"startDate",label:"Start Date",type:"date"},
        {name:"endDate",label:"End Date",type:"date"}
    ]
  },
  {
    section:"Expert Assignment",
    fields:[
        {name:"dietician",label:"Dietician",type:"text"},
        {name:"trainer",label:"Trainer",type:"text"},
        {name:"therapist",label:"Therapist",type:"text"}
        
    ]
  }
];

const initialValues = {
  fullname: "",
  dob: "",
  gender: "",//need to add
};

const schema = Yup.object({
  fullname: Yup.string().required("Required"),
  dob: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
});

export default function ClientForm() {
  return (
    <BaseForm
      heading="Personal Information"
      fields={fields}
      initialValues={initialValues}
      validationSchema={schema}
      submitLabel="Login"
      onSubmit={(values) => console.log(values)}
    />
  );
}
