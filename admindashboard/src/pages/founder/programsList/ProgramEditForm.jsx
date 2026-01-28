import BaseForm from '@/components/form/BaseForm';
import { selectAllCategories } from '@/redux/features/category/category.selector';
import { getAllCategories } from '@/redux/features/category/category.thunk';
import { selectProgramById } from '@/redux/features/program/program.selector';
import { clearSelectedProgram } from '@/redux/features/program/program.slice';
import { getProgramById, updateProgram } from '@/redux/features/program/program.thunk';
import { useAppSelector } from '@/redux/store/hooks';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProgramEditForm = () => {
   const navigate = useNavigate();
  
    const dispatch = useDispatch();
    const { id } = useParams();
  
    useEffect(() => {
      dispatch(getAllCategories({ page: 1, limit: 100 }));
      if (id) {
        dispatch(clearSelectedProgram());
        dispatch(getProgramById( id ));
      }
    }, [dispatch, id]);

    

  
    const data = useAppSelector(selectAllCategories);
  
    const fields = [
      {
        section: "Program Information",
        position: "left",
        fields: [
          { name: "title", label: "Program Name", type: "text" },
          
          {
            name: "category",
            label: "Choose Your Category",
            type: "select",
            options:data?.data?.map((items) => ({
              label: items.name,
              value: items._id,
            })),
          },
          {
            name: "duration",
            label: "Duration",
            type: "multiple",
            options: [
              { label: "30 Days", value: 30 },
              { label: "60 Days", value: 60 },
              { label: "90 Days", value: 90 },
            ],
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { label: "Draft", value: "Draft" },
              { label: "Published", value: "Published" },
            ],
          },
        ],
      },
    ];

    const program = useAppSelector(selectProgramById);
    console.log(program)

  
    const initialValues = {
      title: program?.title,
      
      category: program?.category ,
      duration: program?.duration,
      status: program?.status,
    };
  
    const handleProgramCreation = async (value) => {
      try {
           const category = await dispatch(
             updateProgram({ id, updatedData: value }),
           ).unwrap();
          //  console.log(category)
           if (category.success) {
             toast.success("Program updated successfully");
             navigate("/founder/programs");
           } else {
             toast.error("Failed to update program");
           }
         } catch (error) {
           // console.log(error)
           toast.error(`program updating failed: ${error}`);
         }
    };
    return (
      <div>
        <BaseForm
          fields={fields}
          initialValues={initialValues}
          enableReinitialize
          heading={"Program"}
          onSubmit={(values) => {
            handleProgramCreation(values);
          }}
        />
      </div>
    );
}

export default ProgramEditForm