import React, { useState } from "react";
import { commentService } from "../../services/commentService";
import Button from "../ui/Button";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";

const CommentForm = ({ stationId, userId, onSuccess }) => {
  const [form, setForm] = useState({
    rating: 5,
    text: ""
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // In your component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await commentService.addComment({
        stationId,
        userId: user._id,
        text: form.text.trim(),
        rating: parseInt(form.rating)
      });
      toast.success("Comment added successfully!");
      setForm({ rating: 5, text: "" });
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={form.rating}
          onChange={(e) => setForm({...form, rating: parseInt(e.target.value)})}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          value={form.text}
          onChange={(e) => setForm({...form, text: e.target.value})}
          rows={3}
          required
        />
      </div>
      <Button type="submit" color="primary" disabled={loading}>
        {loading ? "Submitting..." : "Submit Comment"}
      </Button>
    </form>
  );
};

export default CommentForm;


