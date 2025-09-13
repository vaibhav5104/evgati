const { z } = require("zod");

const bookPortSchema = z.object({
  stationId: z.string().length(24, "Invalid station ID"),
  portId: z.number().min(1, "Port ID is required"),
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time")
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: "End time must be after start time",
    path: ["endTime"]
  }
);

module.exports = { bookPortSchema };