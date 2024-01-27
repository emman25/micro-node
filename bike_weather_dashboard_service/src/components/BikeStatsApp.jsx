import React, { useState, useEffect } from "react";
import BikeStats from "./BikeStats";
import axios from "axios";

const BikeStatsApp = () => {
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3003/data");
        setBikes(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 600000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-center text-white bg-slate-800 py-2 rounded">
          Bike Dashboard
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bikes.map((bike) => (
          <BikeStats key={bike.id} data={bike} />
        ))}
      </div>
    </div>
  );
};

export default BikeStatsApp;
