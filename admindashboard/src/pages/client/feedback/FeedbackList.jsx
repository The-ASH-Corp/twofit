import BaseTable from "@/components/table/BaseTable";
import React from "react";
import { feedbackColumns } from "./Feedbackolumns";

export default function FeedbackList({
  feedbackData,
  page,
  limit,
  totalCount,
  onPageChange,
  onLimitChange,
}) {
  return (
    <div>
      <BaseTable
        columns={feedbackColumns}
        data={feedbackData}
        pageLabel="Feedbacks"
        onPageChange={onPageChange}
        handleLimitChange={onLimitChange}
        onSearchInputChange={() => {}}
        page={page}
        limit={limit}
        totalCount={totalCount}
      />
    </div>
  );
}
