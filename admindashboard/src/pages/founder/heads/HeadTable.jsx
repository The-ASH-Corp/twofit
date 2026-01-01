import BaseTable from '@/components/table/BaseTable'
import React, { useEffect } from 'react'
import { therapyColumns } from './Headcolumns';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHeads } from '@/redux/features/head/head.thunk';
import { selectAllHeads, selectHeadError, selectHeadStatus } from '@/redux/features/head/head.selectors';

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

  const heads = useSelector(selectAllHeads);
  const status = useSelector(selectHeadStatus);
  const error = useSelector(selectHeadError);

  useEffect(() => {
    dispatch(getAllHeads({ page: 1, limit: 11 }));
  }, [dispatch]);

  console.log(heads)

  if (status === "loading") return <p>Loading...</p>;
  // if (error) return <p className="text-red-500">{error?.error}</p>;

  return (
    <div>
      <BaseTable
        data={heads}
        columns={therapyColumns}
        // data={clients}
        actionLabel="Add Head"
        actionPath="/founder/create-head"
        // profilePath= {profilePath}
        pageLabel={"Heads"}
      />
    </div>
  );
}

export default TherapyTable