import React from 'react';
import { MdLocationOn } from 'react-icons/md';

const LocationName = ({ weatherData }) => {
  const { location } = weatherData;

  return (
    <div className="flex items-center mb-2">
      <MdLocationOn className="text-red-500" />
      <div className="ml-2">
          <div className="text-lg">{location.name}</div>
          <div className="text-sm text-gray-600">{location.region}, {location.country}</div>
        </div>
    </div>
  );
};

export default LocationName;