const { z } = require("zod");

const sendMessageSchema = z.object({
  stationId: z.string().length(24, "Invalid station ID"),
  message: z.string().min(1, "Message cannot be empty"),
});

module.exports = { sendMessageSchema };
