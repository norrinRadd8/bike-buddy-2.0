import { useEffect } from "react";

import "./landing.css";

const Landing = () => {
  useEffect(() => {
    const fetchRides = async () => {
      const res = await fetch("/api/rides");
      const json = await res.json();

      console.log(json);
    };

    fetchRides();
  }, []);

  return (
    <>
      <h1>Let's Gooo!!</h1>
    </>
  );
};

export default Landing;
