import BaseForm from "@/components/form/BaseForm";
import { editAdmin, getAdminProfile } from "@/redux/features/admins/admin.thunk";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { SyncLoader } from "react-spinners";

export default function AdminEditForm() {
  const { id } = useParams();
  const user = useAppSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[isLoading,setIsLoading]=useState(false);
  const[fetching,setFetching]=useState(true);
  const[initialData, setInitialData] = useState(null);

  const fetchAdminDetails = useCallback(async () => {
    try {
      const admin = await dispatch(getAdminProfile(id)).unwrap();
      
      setInitialData({
        fullname: admin.name || "",
        dob: admin.dob || "",
        gender: admin.gender || "",
        email: admin.email || "",
        phone: admin.phone || "",
        address: admin.address || "",
        specialization: admin.specialization || [],
        experience: admin.experience || "",
        qualification: admin.qualification || "",
        baseSalary: admin.salary || "",
      });

    } catch {
      toast.error("Failed to load data");
    } finally {
      setFetching(false);
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    fetchAdminDetails();
  }, [fetchAdminDetails]);

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
      section: "Salary",

      position: "right",
      fields: [{ name: "baseSalary", label: "Base Salary", type: "number" }],
    },
  ];

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

    specialization: Yup.array()
      .of(Yup.string())
      .min(1, "Select at least one specialization")
      .required("Specialization is required"),

    experience: Yup.string().trim().required("Experience is required"),

    qualification: Yup.string().trim().required("Qualification is required"),

    baseSalary: Yup.number()
      .typeError("Base Salary must be a number")
      .required("Base Salary is required")
      .positive("Base Salary must be greater than 0"),
  });

  const handleAdminUpdate = async (values) => {
    setIsLoading(true);
    try {
      await dispatch(
        editAdmin({
          id,
          adminData: values
        })
      ).unwrap();
      toast("Admin updated successfully", { type: "success" });
      navigate(user?.role === "founder" ? "/founder/admins" : "/head/admins");
    } catch (error) {
      toast(error?.message || "Failed to update admin", { type: "error" });
    } finally {
      setIsLoading(false);
    }

  };

  if (fetching) {
     return (
        <div className="flex justify-center items-center h-[calc(100vh-120px)]">
           <SyncLoader color="#0A4F48" loading margin={2} size={20} />
        </div>
     );
  }

  return (
    <BaseForm
      fields={fields}
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={(values) => handleAdminUpdate(values)}
      heading={"Edit Admin"}
      submitButton={"Update Admin"}
      isLoading={isLoading}
    ></BaseForm>
  );
}
