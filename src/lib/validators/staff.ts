import { z } from "zod";

export const createStaffSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    role: z.string().min(1, "Role is required").max(100),
    joinDate: z.coerce.date().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().max(20).optional().or(z.literal("")),
    isActive: z.boolean().default(true),
});

export const updateStaffSchema = createStaffSchema.partial();

export const createSalaryStructureSchema = z.object({
    staffId: z.string().min(1, "Staff is required"),
    base: z.coerce.number().min(0, "Base salary must be non-negative"),
    allowances: z.coerce.number().min(0, "Allowances must be non-negative").default(0),
    effectiveFrom: z.coerce.date(),
    effectiveTo: z.coerce.date().optional().nullable(),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type CreateSalaryStructureInput = z.infer<typeof createSalaryStructureSchema>;
