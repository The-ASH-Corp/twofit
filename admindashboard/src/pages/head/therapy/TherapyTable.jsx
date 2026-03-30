import BaseTable from "@/components/table/BaseTable";
import React, { useEffect, useState } from "react";
import { therapyColumns } from "./Therapycolumns";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapyPlans } from "@/redux/features/therapy/therapy.thunk";
import { SyncLoader } from "react-spinners";
import { selectTherapyError, selectTherapyLoading } from "@/redux/features/therapy/therapy.selectors";

const TherapyTable = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

    const status = useSelector(selectTherapyLoading);
    const error = useSelector(selectTherapyError);

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const data = await dispatch(
          fetchTherapyPlans({ page: 1, limit: 100 }),
        ).unwrap();
        setPlans(data.data.therapy);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [dispatch]);
  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <SyncLoader color="#0A4F48" loading margin={2} size={20} />
      </div>
    );
  return (
    <div className="h-[calc(100vh-120px)] pb-4 overflow-auto no-scrollbar">
      <BaseTable
        data={plans}
        columns={therapyColumns}
        meta={{ navigate }}
        pageLabel={"Therapies"}
      />
    </div>
  );
};

export default TherapyTable;
