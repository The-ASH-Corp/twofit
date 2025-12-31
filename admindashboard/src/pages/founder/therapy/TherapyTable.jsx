import BaseTable from '@/components/table/BaseTable'
import React, { useEffect } from 'react'
import { therapyColumns } from './Therapycolumns';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTherapies } from '@/redux/features/therapy/therapy.thunk';
import { selectAllTherapies, selectTherapyStatus } from '@/redux/features/therapy/therapy.selectors';

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

  const therapy = useSelector(selectAllTherapies);
  const status = useSelector(selectTherapyStatus);
  // const error = useSelector(selectTherapyError);

  useEffect(() => {
       
         dispatch(getAllTherapies());
       
     }, [dispatch]);

        if (status === "loading") return <p>Loading...</p>;
        // if (error) return <p className="text-red-500">{error?.error}</p>;

  return (
    <div>
      <BaseTable
        data={therapy}
        columns={therapyColumns}
        // data={clients}
        actionLabel="Add Therapy"
        actionPath="/founder/add-therapy"
        // profilePath= {profilePath}
        pageLabel={"Therapies"}
      />
    </div>
  );
}

export default TherapyTable