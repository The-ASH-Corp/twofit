import BaseTable from "@/components/table/BaseTable";
import React, { useEffect, useState } from "react";
import { therapyColumns } from "./Therapycolumns";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTherapyPlans } from "@/redux/features/therapy/therapy.thunk";

const TherapyTable = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      try {
        const data = await dispatch(fetchTherapyPlans()).unwrap();
        setPlans(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [dispatch]);

  return (
    <div className="h-[calc(100vh-120px)] overflow-y-auto  no-scrollbar">
      <BaseTable
        data={plans}
        columns={therapyColumns}
        actionLabel="Add Therapy"
        actionPath="/founder/therapy/create"
        meta={{ navigate }}
        
        // profilePath= {profilePath}
        pageLabel={"Therapies"}
      />
    </div>
  );
};

export default TherapyTable;
