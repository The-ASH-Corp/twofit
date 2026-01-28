import BaseForm from '@/components/form/BaseForm';
import { selectCategoryError, selectCategoryStatus } from '@/redux/features/category/category.selector';
import { selectHead } from '@/redux/features/head/head.selectors';
import { getHead } from '@/redux/features/head/head.thunk';
import { useAppSelector } from '@/redux/store/hooks';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const HeadEditForm = () => {
  const dispatch = useDispatch();
  const {id} = useParams()

  useEffect(() => {
    dispatch(getHead  (id));
  }, [dispatch, id]);

  const data = useAppSelector(selectHead);
  const status = useAppSelector(selectCategoryStatus);
  const error = useAppSelector(selectCategoryError);

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
            { label: "PCOD", value: "pcod" },
            { label: "Thyroid", value: "Thyroid" },
            { label: "Diabetes", value: "Diabetes" },
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
    // {
    //   section: "Program Assignment",
    //   position: "right",
    //   fields: [
    //     {
    //       name: "programCategory",
    //       label: "Program Category",
    //       type: "select",
    //       options: categories?.map((items) => ({
    //         label: items?.name,
    //         value: items?._id,
    //       })),
    //     },
    //   ],
    // },
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
   
  ];
  const initialValues = {
    name: data.name,
    dob: data.dob,
    gender: data.gender,
    email: data.email,
    phone: data.phone,
    address: data.address,
    specialization: data.specialization,
    experience: data.experience,
    qualification: data.qualification,
    salary: data.salary,
  };

  // const navigate = useNavigate();

  const handelSubmit = async (value) => {
    // try {
    //   const result = await dispatch(createHead(value)).unwrap();
    //   if (result.success) {
    //     toast.success("Head created successfully");
    //     navigate("/founder/heads");
    //   } else {
    //     toast.error("Failed to create head");
    //   }
    // } catch (error) {
    //   toast.error(error || "Failed to create head");
    // }
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
    if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <BaseForm
        fields={fields}
        initialValues={initialValues}
        enableReinitialize
        heading={"Head"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
}

export default HeadEditForm