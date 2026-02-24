import { z } from "zod";

export const createBatchSchema = z.object({
    name: z.string().min(1, "Batch name is required").max(100),
    courseId: z.string().min(1, "Course is required"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    academicYear: z.string().min(1, "Academic year is required").max(20),
});

export const updateBatchSchema = createBatchSchema.partial();

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
