import React from "react";
import RatingStars from "./RatingStars";

const CommentCard = ({ comment }) => {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{comment.userName}</h4>
        <RatingStars rating={comment.rating} />
      </div>
      <p className="text-gray-700 mb-2">{comment.text}</p>
      <p className="text-xs text-gray-500">
        {new Date(comment.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default CommentCard;