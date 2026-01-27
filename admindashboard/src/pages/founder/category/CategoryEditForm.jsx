import BaseForm from '@/components/form/BaseForm';
import { selectCategoryById, selectCategoryError, selectCategoryStatus } from '@/redux/features/category/category.selector';
import { getCategory, updateCategories } from '@/redux/features/category/category.thunk';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";


const CategoryEditForm = () => {
  const fields = [
    {
      section: "Category Information",
      position: "left",
      fields: [
        { name: "name", label: "Category Name", type: "text" },
        { name: "programLimit", label: "Max Program Limit", type: "number" },
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

  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
      if (id) {
        dispatch(getCategory({id}));
      }
    }, [id, dispatch]);

  const category = useSelector(selectCategoryById);
  const status = useSelector(selectCategoryStatus);
  const error = useSelector(selectCategoryError);





  const initialValues = {
    name: category?.name,
    programLimit: category?.programLimit,
    status: category?.status
  };

//   const dispatch = useDispatch();
  

  const handelSubmit = async (value) => {
    try {
      const category = await dispatch(
        updateCategories({ id, updatedData: value }),
      ).unwrap();
      if (category.success) {
        toast.success("Category updated successfully");
        navigate("/founder/categories");
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      // console.log(error)
      toast.error(`Category updating failed: ${error}`);
    }
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
        heading={"Update Category"}
        onSubmit={(value) => handelSubmit(value)}
      />
    </div>
  );
}

export default CategoryEditForm