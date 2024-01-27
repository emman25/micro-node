import React, { useEffect, useRef } from "react";

import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiRaindrops,
  WiCloudy,
  WiDaySunny,
  WiMoonAltWaningCrescent5,
} from "react-icons/wi";

const WeatherVisualization = ({ weatherData }) => {
  const { current } = weatherData;

  return (
    <div className="flex items-center mb-2">
      <div className="flex items-center mb-2">
        <WiDaySunny className="text-yellow-500" />
        <div className="ml-2">{current.condition.text}</div>
      </div>

      <div className="flex items-center mb-2">
        <WiThermometer className="text-red-500" />
        <div className="ml-2">
          {current.temp_c}°C / {current.temp_f}°F
        </div>
      </div>
      <div className="flex items-center mb-2">
        <WiHumidity className="text-blue-500" />
        <div className="ml-2">{current.humidity}%</div>
      </div>
      <div className="flex items-center mb-2">
        <WiStrongWind className="text-gray-700" />
        <div className="ml-2">
          {current.wind_mph} mph / {current.wind_kph} kph
        </div>
      </div>
      <div className="flex items-center mb-2">
        <WiBarometer className="text-gray-700" />
        <div className="ml-2">
          {current.pressure_mb} mb / {current.pressure_in} in
        </div>
      </div>
      <div className="flex items-center mb-2">
        <WiRaindrops className="text-blue-500" />
        <div className="ml-2">
          {current.precip_mm} mm / {current.precip_in} in
        </div>
      </div>
      <div className="flex items-center mb-2">
        <WiCloudy className="text-gray-700" />
        <div className="ml-2">{current.cloud}%</div>
      </div>
      <div className="flex items-center">
        <div className="text-lg text-yellow-500">☀️</div>
        <div className="ml-2">UV Index: {current.uv}</div>
      </div>
    </div>
  );
};

export default WeatherVisualization;
