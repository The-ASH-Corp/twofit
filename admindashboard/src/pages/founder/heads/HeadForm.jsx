import BaseForm from '@/components/form/BaseForm';
import { createHead } from '@/redux/features/head/head.thunk';
import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TherapyForm = () => {
    const fields = [
      {
        section: "Create new head",
        position: "left",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
          },
          {
            name: "dob",
            label: "DOB",
            type: "text",
          },
          {
            name: "gender",
            label: "gender",
            type: "text",
          },
          {
            name: "email",
            label: "email",
            type: "email",
          },
          {
            name: "phone",
            label: "phone number",
            type: "text",
          },
          {
            name: "password",
            label: "password",
            type: "text"
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
            <BaseForm fields={fields} initialValues={initialValues} onSubmit={(value)=> handelSubmit(value)}/>
          
        </div>
  )
}

export default TherapyForm