import React, { useRef } from 'react'
import Heading from '../shared/Heading';
import PossibleCard from './PossibleCard';
// import { possible } from "../../utils/constants"
import SlidingArrow from './SlidingArrow';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

const SeeWhatPossible = () => {
  const[user,setUser]=useState([])
  const scrollRef = useRef(null);
  
    // Scroll Left
    const slideLeft = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: -300,
          behavior: "smooth",
        });
      }
    };
  
    // Scroll Right
    const slideRight = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 300,
          behavior: "smooth",
        });
      }
    };

    useEffect(()=>{
      axios
        .get('https://outstanding-stillness-production.up.railway.app/api/v1/testimonials/')
        .then((res)=>{
          setUser(res.data.data)
        })
        .catch((Error)=>{
          console.log(Error)
        })
    })

  return (
    <div className="w-full py-15">
      <div className="flex flex-col items-center justify-center w-full gap-10">
        <Heading
          heading={"See What’s Possible"}
          description={"Transformations made possible with TwoFit"}
        />

        <div className="flex items-center justify-center gap-2 w-full">
          <PossibleCard cardData={user} scrollRef={scrollRef} />
        </div>

        <SlidingArrow slideLeft={slideLeft} slideRight={slideRight} />
      </div>
    </div>
  );
}

export default SeeWhatPossible