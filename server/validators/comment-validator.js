const { z } = require("zod");

const createCommentSchema = z.object({
  stationId: z.string().length(24, "Invalid station ID"),
  userId: z.string().length(24, "Invalid user ID"),
  text: z.string().min(1, "Comment cannot be empty"),
  rating: z.number().min(1, "rating cannot be less than 1").max(5,"rating cannot be more than 5"),
});

module.exports = { createCommentSchema };
