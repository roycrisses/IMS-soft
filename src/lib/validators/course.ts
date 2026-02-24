import { z } from "zod";

export const createCourseSchema = z.object({
    name: z.string().min(1, "Course name is required").max(200),
    code: z.string().min(1, "Course code is required").max(20).toUpperCase(),
    defaultTotalFee: z.coerce.number().min(0, "Fee must be non-negative"),
    description: z.string().max(500).optional().or(z.literal("")),
    active: z.boolean().default(true),
});

export const updateCourseSchema = createCourseSchema.partial();

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
