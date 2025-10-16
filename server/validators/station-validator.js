const { z } = require("zod");

const createStationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),

  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().min(5, "Address must be at least 5 characters long"),
  }),

  totalPorts: z.number().int().positive("Total ports must be a positive integer"),

  description: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),

  pricing: z
    .object({
      perHour: z.number().nonnegative().optional(),
      perKWh: z.number().nonnegative().optional(),
    })
    .optional(),

  chargerTypes: z
    .array(z.enum(["Type1", "Type2", "CCS", "CHAdeMO", "AC", "DC","Bharat DC-001"]))
    .optional(),

  amenities: z
    .array(
      z.enum([
        "wifi",
        "restroom",
        "cafe",
        "parking",
        "wheelchair_accessible",
        "24x7",
        "etc",
      ])
    )
    .optional(),

  operatingHours: z
    .object({
      open: z.string().optional(),
      close: z.string().optional(),
      is24x7: z.boolean().optional(),
    })
    .optional(),

  images: z.array(z.string().url().or(z.string())).optional(),

  // Ports validation (optional during creation)
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
              status: z
                .enum([
                  "pending",
                  "accepted",
                  "rejected",
                  "active",
                  "completed",
                  "cancelled",
                ])
                .optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

module.exports = { createStationSchema };
