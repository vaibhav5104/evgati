import React, { useState } from "react";

const BookingCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = (date) => {
    onDateSelect?.(date);
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-4">Select Date</h3>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}
        {Array.from({ length: 30 }, (_, i) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          return (
            <button
              key={i}
              className={`p-2 text-sm rounded ${
                isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleDateClick(date)}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;


