const { z } = require("zod");

const createStationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().min(5, "Address must be at least 5 characters long")
  }),
  totalPorts: z.number().int().positive("Ports must be a positive integer"),
  ports: z
    .array(
      z.object({
        portNumber: z.number().int().positive(),
        bookings: z
          .array(
            z.object({
              userId: z.string().length(24).optional(),
              startTime: z.string().datetime().optional(),
              endTime: z.string().datetime().optional(),
              status: z.enum(["active", "completed", "cancelled"]).optional()
            })
          )
          .optional()
      })
    )
    .optional()
});

module.exports = { createStationSchema };
