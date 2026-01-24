import BaseTable from "@/components/table/BaseTable";
import React, { useEffect, useState } from "react";
import { therapyColumns } from "./Therapycolumns";
import { useDispatch, useSelector } from "react-redux";
import { getAllTherapies } from "@/redux/features/therapy/therapy.thunk";
import {
  selectAllTherapies,
  selectTherapyStatus,
} from "@/redux/features/therapy/therapy.selectors";
import { SyncLoader } from "react-spinners";

const TherapyTable = () => {
  // const therapyData = [
  //   {
  //     name: "Therapy A",
  //     sets: 5,
  //     attachment: "attachmentA.pdf",
  //     media: "mediaA.mp4",
  //   },
  //   {
  //     name: "Therapy A",
  //     sets: 5,
  //     attachment: "attachmentA.pdf",
  //     media: "mediaA.mp4",
  //   },
  //   {
  //     name: "Therapy A",
  //     sets: 5,
  //     attachment: "attachmentA.pdf",
  //     media: "mediaA.mp4",
  //   },
  // ];

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    dispatch(getAllTherapies({ page, limit }));
  }, [dispatch, page, limit]);

  const data = useSelector(selectAllTherapies);
  const status = useSelector(selectTherapyStatus);
  // const error = useSelector(selectTherapyError);

  const [therapy, setTherapy] = useState([]);

  useEffect(() => {
    setTherapy(data);
  }, [data]);

  const searchInputHandler = (e) => {
    const value = e.target.value.toLowerCase();

    if (!value) {
      setTherapy(data);
      return;
    }

    const filtered = data.filter((therapy) =>
      therapy.name?.toLowerCase().includes(value)
    );

    setTherapy(filtered);
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  // if (error) return <p className="text-red-500">{error?.error}</p>;

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto  no-scrollbar">
      <BaseTable
        data={therapy}
        columns={therapyColumns}
        actionLabel="Add Therapy"
        actionPath="/founder/therapy/add-therapy"
        // profilePath= {profilePath}
        pageLabel={"Therapies"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
      />
    </div>
  );
};

export default TherapyTable;
