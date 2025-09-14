import React from "react";
import CommentCard from "./CommentCard";

const CommentList = ({ comments }) => {
  if (!comments.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No comments yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <CommentCard key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;


