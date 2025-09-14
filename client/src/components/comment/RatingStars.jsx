import React from "react";

const RatingStars = ({ rating, onRatingChange, interactive = false }) => {
  const handleClick = (newRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          className={`text-lg ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : 'cursor-default'}`}
          onClick={() => handleClick(star)}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default RatingStars;


