import React, { useEffect, useState } from 'react'
import FaqCard from './FaqCard';
import { FAQs } from '../../utils/constants';
import axios from 'axios';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqs,setFaqs]=useState([])

  useEffect(() => {
    axios
      .get('https://outstanding-stillness-production.up.railway.app/api/v1/faq')
      .then((response) => {
        setFaqs(response.data.data);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="w-full px-4 md:px-[150px] py-15 bg-[#0A4F48]">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10 md:gap-40 w-full">
        <div className="flex flex-col justify-between items-start gap-10">
          <div className="flex flex-col items-start gap-4 text-white">
            <h2 className="md:text-[75px] text-[36px] tracking-[-4%] leading-none font-bold">
              Frequently <br /> asked <br className="hidden md:block" />{" "}
              questions
            </h2>
            <p className="text-[13px] md:text-[20px] leading-[150%]">
              Have more questions? Reach <br className="hidden md:block" /> out
              to our team.
            </p>
          </div>
          <button className="py-4 px-13 rounded-full text-white text-4 font-semibold border-white border">
            Start Today
          </button>
        </div>

        <div className="flex flex-col justify-between items-start gap-6 w-full text-white">
          {faqs.map((item, i) => (
            <FaqCard
              key={i}
              index={i}
              question={item.question}
              answer={item.answer}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Faq