const BookingList = ({ bookings, onCancel }) => {
  if (bookings.length === 0) {
    return <p className="text-gray-500">No bookings found.</p>;
  }

  return (
    <ul className="space-y-4">
      {bookings.map((b) => (
        <li key={b._id} className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-purple-700">
            {b.station?.name}
          </h2>
          <p className="text-sm text-gray-600">{b.station?.location?.address}</p>
          <p>Status: <span className="font-medium">{b.status}</span></p>
          <p>
            {new Date(b.startTime).toLocaleString()} –{" "}
            {new Date(b.endTime).toLocaleString()}
          </p>
          {b.ownerMessage && (
            <p className="text-green-600 italic">{b.ownerMessage}</p>
          )}

          <button
            onClick={() => onCancel(b._id)}
            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </li>
      ))}
    </ul>
  );
};

export default BookingList
