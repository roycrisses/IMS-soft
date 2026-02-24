import { z } from "zod";

export const postPayrollSchema = z.object({
    staffId: z.string().min(1, "Staff is required"),
    month: z.coerce.number().int().min(1).max(12),
    year: z.coerce.number().int().min(2000).max(2100),
    deductions: z.coerce.number().min(0).default(0),
});

export const recordSalaryPaymentSchema = z.object({
    payrollId: z.string().min(1, "Payroll entry is required"),
    amount: z.coerce.number().positive("Payment amount must be positive"),
    notes: z.string().max(500).optional().or(z.literal("")),
});

export type PostPayrollInput = z.infer<typeof postPayrollSchema>;
export type RecordSalaryPaymentInput = z.infer<typeof recordSalaryPaymentSchema>;
