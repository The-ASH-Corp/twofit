import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { useEffect } from "react";
import {
  selectAllCategories,
  selectCategoryError,
  selectCategoryStatus,
} from "@/redux/features/category/category.selector";
import { getAllCategories } from "@/redux/features/category/category.thunk";
import { CategoryListColumns } from "./CategoryListColumns";
import BaseTable from "@/components/table/BaseTable";
import { SyncLoader } from "react-spinners";


export default function CategoryTable() {
  const dispatch = useDispatch(); 
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(getAllCategories({ page, limit }));
  }, [dispatch, page, limit]);

    const data = useAppSelector(selectAllCategories);
    const status = useAppSelector(selectCategoryStatus);
    const error = useAppSelector(selectCategoryError);

    const [ categories, setCategories] = useState([]);

    useEffect(()=>{
      setCategories(data)
    },[data])

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setCategories(data);
      return;
    }

    const filtered = data.filter((categories) =>
      categories.name?.toLowerCase().includes(value)
    );

    setCategories(filtered);
  };

  if (status === "loading") return (
    <div className="flex justify-center items-center h-[calc(100vh-120px)]">
      <SyncLoader color="#0A4F48" loading margin={2} size={20} />
    </div>
  );
  if (error) return <p>{error}</p>;
  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto  no-scrollbar">
      <BaseTable
        columns={CategoryListColumns}
        data={categories}
        pageLabel={"Category List"}
        actionLabel="Add Category"
        actionPath="/founder/category/create"
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
      />
    </div>
  );
}
