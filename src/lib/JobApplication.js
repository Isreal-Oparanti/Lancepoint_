import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  applicationText: z.string().min(1, "Application is required"),
  portfolioLink: z.string().url("Invalid URL").optional(),

  jobTitle: z.string().min(1),
  jobDescription: z.string().min(1),
  userId: z.string().min(1),
  applicantId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  paymentAmount: z.union([z.string(), z.number()]),
  paymentToken: z.string().min(1),

  services: z.array(z.string()).optional(),
  milestones: z
    .array(
      z.object({
        header: z.string(),
        body: z.string(),
        date: z.string(),
      })
    )
    .optional(),
});
