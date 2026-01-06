import BaseForm from '@/components/form/BaseForm';
import { createHead } from '@/redux/features/head/head.thunk';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TherapyForm = () => {
    const fields = [
      {
        section: "Personal Information",
        position: "left",
        fields: [
          {
            name: "name",
            label: "Full Name",
            type: "text",
          },
          {
            name: "dob",
            label: "Date Of Birth",
            type: "date",
          },
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
          {
            name: "email",
            label: "Email",
            type: "email",
          },
          {
            name: "phone",
            label: "phone number",
            type: "text",
          },
          {
            name: "address",
            label: "Address",
            type: "text",
          },
        ],
      },
      {
        section: "Role Assignment",
        position: "right",
        fields: [
          {
            name: "specialization",
            label: "Specialization",
            type: "text",
          },
          {
            name: "experience",
            label: "Experience",
            type: "text",
          },
          {
            name: "qualification",
            label: "Qualification",
            type: "text",
          },
        ],
      },
      {
        section: "Program Assignment",
        position: "right",
        fields: [
          {
            name: "programCategory",
            label: "Program Category",
            type: "dropdown",
          },
        ],
      },
      {
        section: "Salary",
        position: "right",
        fields: [
          {
            name: "salary",
            label: "Base Salary",
            type: "dropdown",
          },
        ],
      },
      {
        section: "Password",
        position: "right",
        fields: [
          {
            name: "password",
            label: "Create password",
            type: "dropdown",
          },
        ],
      },
    ];
    const initialValues = {
      name: "",
    };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  

    const handelSubmit = (value) => {
      console.log(value);
      dispatch(createHead(value));
      navigate("/founder/heads")
    };

  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        heading = {"Head"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
}

export default TherapyForm