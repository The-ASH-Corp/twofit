import React, { useEffect, useState } from 'react'
import Heading from '../shared/Heading'
import MemberCard from './MemberCard';
import { users } from '../../utils/constants';
// import { cardData } from '../../utils/constants';
import ProgramCard from './ProgramCard';
import axios from 'axios';

const JoinTheMovement = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/v1/testimonials/')
      .then((res) => {
        setUsers(res.data.data)
      })
      .catch((Error)=>{
        console.log(Error)
      })
  }, [])

  return (
    <div className="py-15 w-full flex flex-col gap-15">
      <Heading
        heading={"Join the Movement"}
        description={"Stronger, healthier lives together."}
      />
      <div className=" flex flex-col gap-5">
        <MemberCard cardData={users} />
        {/* <MemberCard cardData={users} /> */}
        {/* <ProgramCard cardData={cardData}/> */}
      </div>
    </div>
  );
}

export default JoinTheMovement