import BaseForm from '@/components/form/BaseForm';
import { selectAllCategories } from '@/redux/features/category/category.selector';
import { getAllCategories } from '@/redux/features/category/category.thunk';
import { createHead } from '@/redux/features/head/head.thunk';
import { useAppSelector } from '@/redux/store/hooks';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const HeadForm = () => {
  const dispatch = useDispatch(); 
   
  
    useEffect(() => {
      dispatch(getAllCategories({ page: 1, limit: 100 }));
    }, [dispatch]);

    const data = useAppSelector(selectAllCategories);
    // const status = useAppSelector(selectCategoryStatus);
    // const error = useAppSelector(selectCategoryError);

    

    const [ categories, setCategories] = useState([]);
    
        useEffect(()=>{
          setCategories(data.data)
        },[data])

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
            type: "multiple",
            options: [
              { label: "pcod", value: "pcod" },
              { label: "thyroid", value: "thyroid" },
              { label: "diabetes", value: "diabetes" },
            ],
            allowCustom: true,
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
            type: "select",
            options: categories?.map((items) => ({
              label: items?.name,
              value: items?._id,
            })),
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

  const navigate = useNavigate();
  

  const handelSubmit = async (value) => {
    try {
      const result = await dispatch(createHead(value)).unwrap();
      if (result.success) {
        toast.success("Head created successfully");
        navigate("/founder/heads");
      } else {
        toast.error("Failed to create head");
      }
    } catch (error) {
      toast.error(error || "Failed to create head");
    }
  };


  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        heading = {"Add Head"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
}

export default HeadForm;
