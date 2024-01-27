import React, { useState } from "react";
import WeatherVisualization from "./WeatherVisualization";
import LocationName from "./LocationVisualization";

const BikeStats = ({ data }) => {
  return (
    <div className="transition-transform transform hover:-translate-y-1 cursor-pointer border p-4 bg-slate-500 border-slate-500 rounded shadow hover:shadow-lg">
      <div className="font-bold text-xl mb-2">
        {data.name.replace(/_/g, " ")}
      </div>
      <p className="text-gray-700 text-base">Bikes: {data.bikes}</p>
      <p className="text-gray-700 text-base mb-4">Free Slots: {data.free}</p>
      <div>
        <LocationName weatherData={data.weather} />
        <WeatherVisualization weatherData={data.weather} />
      </div>
    </div>
  );
};

export default BikeStats;
