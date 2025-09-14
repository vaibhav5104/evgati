import React from "react";
import BookingCard from "./BookingCard";

const BookingHistory = ({ bookings }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Booking History</h2>
      <div className="space-y-4">
        {bookings.map(booking => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;


