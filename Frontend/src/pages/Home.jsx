// Home.jsx
import React, { useEffect, useRef } from "react";
import Video from "../components/Home/Video";
import Programs from "../components/Home/programs";
import DesignedForYou from "../components/Home/DesignedForYou";
import SeeWhatPossible from "../components/Home/SeeWhatPossible";
import Faq from "../components/shared/Faq";
import JoinTheMovement from "../components/Home/JoinTheMovement";

const Home = ({ onVideoVisible }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        onVideoVisible(entries[0].isIntersecting);
      },
      { threshold: 0.4 }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <Video videoRef={videoRef} />
      <Programs />
      <DesignedForYou />
      <SeeWhatPossible />
      <Faq />
      <JoinTheMovement />
    </div>
  );
};

export default Home;
