import React from "react";

const TimeSlotPicker = ({ selectedTime, onTimeSelect, availableSlots = [] }) => {
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Select Time</h3>
      <div className="grid grid-cols-5 gap-2">
        {timeSlots.map(time => {
          const isAvailable = availableSlots.includes(time);
          const isSelected = selectedTime === time;
          return (
            <button
              key={time}
              className={`p-2 text-sm rounded border ${
                isSelected
                  ? 'bg-blue-500 text-white border-blue-500'
                  : isAvailable
                  ? 'hover:bg-gray-100 border-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => isAvailable && onTimeSelect?.(time)}
              disabled={!isAvailable}
            >
              {time}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;


