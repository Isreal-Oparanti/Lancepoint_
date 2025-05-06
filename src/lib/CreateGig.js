import { z } from "zod";

const gigSchema = z.object({
  services: z.array(z.string().min(1)).optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date",
  }),
  payment: z.object({
    token: z.string().min(1, "Token is required"),
    amount: z.number().positive("Amount must be a positive number"),
  }),
  milestones: z
    .array(
      z.object({
        header: z.string().min(1, "Milestone header is required"),
        body: z.string().optional(),
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid milestone date",
        }),
      })
    )
    .optional(),
  userId: z.string().min(1, "User ID is required"),
});

export default gigSchema;
