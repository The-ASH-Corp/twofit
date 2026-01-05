import BaseTable from '@/components/table/BaseTable'
import React, { useEffect, useState } from 'react'
import { therapyColumns } from './Headcolumns';
import { useDispatch, useSelector } from 'react-redux';
import { getAllHeads } from '@/redux/features/head/head.thunk';
import { selectAllHeads, selectHeadStatus } from '@/redux/features/head/head.selectors';
import { useNavigate } from 'react-router-dom';

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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profilePath = (id) => {
    navigate(`/founder/heads/profile/${id}`);
  };

  useEffect(() => {
    dispatch(getAllHeads({ page, limit }));
  }, [dispatch, page, limit]);

    const data = useSelector(selectAllHeads);
    const status = useSelector(selectHeadStatus);
    // const error = useSelector(selectHeadError);

    const [ heads, setHeads] = useState([])

    useEffect(()=>{
      setHeads(data)
    },[data])

    const searchInputHandler = (e) => {
      const value = e.target.value.toLowerCase();

      if (!value) {
        setHeads(data);
        return;
      }

      const filtered = data.filter((head) =>
        head.name?.toLowerCase().includes(value)
      );

      setHeads(filtered);
    };


  console.log(heads)

  if (status === "loading") return <p>Loading...</p>;
  // if (error) return <p className="text-red-500">{error?.error}</p>;

  return (
    <div>
      <BaseTable
        data={heads}
        columns={therapyColumns}
        actionLabel="Add Head"
        actionPath="/founder/heads/create"
        profilePath= {profilePath}
        pageLabel={"Heads"}
        onSearchInputChange={searchInputHandler}
        handlePageChange={setPage}
        handleLimitChange={setLimit}
        page={page}
        limit={limit}
      />
    </div>
  );
}

export default TherapyTable