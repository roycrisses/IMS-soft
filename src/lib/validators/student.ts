import { z } from "zod";

const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;

export const createStudentSchema = z.object({
    studentCode: z.string().min(1, "Student code is required").max(20),
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    photoUrl: z.string().url("Invalid photo URL").optional().or(z.literal("")),
    courseId: z.string().min(1, "Course is required"),
    batchId: z.string().min(1, "Batch is required"),
    primaryParentName: z.string().min(1, "Primary parent name is required").max(200),
    secondaryParentName: z.string().max(200).optional().or(z.literal("")),
    primaryPhone: z.string().regex(phoneRegex, "Invalid phone number"),
    secondaryPhone: z.string().regex(phoneRegex, "Invalid phone number").optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    enrollmentDate: z.coerce.date().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
