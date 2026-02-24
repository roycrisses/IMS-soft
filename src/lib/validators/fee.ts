import { z } from "zod";

export const createFeePlanSchema = z.object({
    studentId: z.string().min(1, "Student is required"),
    totalFee: z.coerce.number().min(0, "Total fee must be non-negative"),
    discount: z.coerce.number().min(0, "Discount must be non-negative").default(0),
});

export const recordPaymentSchema = z.object({
    studentId: z.string().min(1, "Student is required"),
    feePlanId: z.string().min(1, "Fee plan is required"),
    amount: z.coerce.number().positive("Payment amount must be positive"),
    paymentMode: z.string().optional().default("CASH"),
    notes: z.string().max(500).optional().or(z.literal("")),
    receiptNo: z.string().max(50).optional().or(z.literal("")),
});

export type CreateFeePlanInput = z.infer<typeof createFeePlanSchema>;
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;
