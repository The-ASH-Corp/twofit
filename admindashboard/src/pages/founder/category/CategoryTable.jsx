import React from "react";
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

export default function CategoryTable() {
  const dispatch = useDispatch();

  const categories = useAppSelector(selectAllCategories);
  const status = useAppSelector(selectCategoryStatus);
  const error = useAppSelector(selectCategoryError);

  console.log("CATEGORIES 👉", categories, Array.isArray(categories));

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  if (status === "loading") return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div>
      <BaseTable
        columns={CategoryListColumns}
        data={categories}
        pageLabel={"Category List"}
        actionLabel="Add Category"
        actionPath="/add-category"
      />
    </div>
  );
}
