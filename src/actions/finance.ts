"use server";

import prisma from "@/lib/db";
import { handleActionError, success, failure, type ActionResult } from "@/lib/errors";
import { createFeePlanSchema, recordPaymentSchema, type CreateFeePlanInput, type RecordPaymentInput } from "@/lib/validators/fee";
import { buildFeePaymentWhatsAppPayload } from "@/lib/whatsapp";

export async function createFeePlan(data: CreateFeePlanInput): Promise<ActionResult> {
    try {
        const validated = createFeePlanSchema.parse(data);
        const netPayable = validated.totalFee - validated.discount;

        // Create fee plan and initial ledger entries in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const feePlan = await tx.studentFeePlan.create({
                data: {
                    studentId: validated.studentId,
                    totalFee: validated.totalFee,
                    discount: validated.discount,
                    netPayable,
                },
            });

            // Always create a CHARGE entry
            await tx.studentFeeLedgerEntry.create({
                data: {
                    studentId: validated.studentId,
                    feePlanId: feePlan.id,
                    type: "CHARGE",
                    amount: validated.totalFee,
                    meta: JSON.stringify({ description: "Fee plan charge" }),
                },
            });

            // If there's a discount, create a DISCOUNT entry
            if (validated.discount > 0) {
                await tx.studentFeeLedgerEntry.create({
                    data: {
                        studentId: validated.studentId,
                        feePlanId: feePlan.id,
                        type: "DISCOUNT",
                        amount: validated.discount,
                        meta: JSON.stringify({ description: "Fee plan discount" }),
                    },
                });
            }

            return feePlan;
        });

        return success(result);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function recordPayment(data: RecordPaymentInput): Promise<ActionResult> {
    try {
        const validated = recordPaymentSchema.parse(data);

        const result = await prisma.$transaction(async (tx) => {
            // Verify fee plan exists
            const feePlan = await tx.studentFeePlan.findUnique({
                where: { id: validated.feePlanId },
                include: { student: { include: { course: true } } },
            });
            if (!feePlan) throw new Error("Fee plan not found.");

            // Create payment ledger entry
            const entry = await tx.studentFeeLedgerEntry.create({
                data: {
                    studentId: validated.studentId,
                    feePlanId: validated.feePlanId,
                    type: "PAYMENT",
                    amount: validated.amount,
                    meta: JSON.stringify({
                        paymentMode: validated.paymentMode,
                        notes: validated.notes,
                        receiptNo: validated.receiptNo,
                    }),
                },
            });

            // Optimization: Use database aggregation instead of fetching all entries into memory.
            const summary = await tx.studentFeeLedgerEntry.groupBy({
                by: ['type'],
                where: { studentId: validated.studentId },
                _sum: { amount: true },
            });

            const totals = { CHARGE: 0, DISCOUNT: 0, PAYMENT: 0 };
            summary.forEach(s => {
                if (s.type in totals) {
                    totals[s.type as keyof typeof totals] = s._sum.amount || 0;
                }
            });

            const totalCharged = totals.CHARGE;
            const totalDiscount = totals.DISCOUNT;
            const totalPaid = totals.PAYMENT;

            const balance = totalCharged - totalDiscount - totalPaid;
            const student = feePlan.student;

            // Generate WhatsApp payload
            const whatsappPayload = buildFeePaymentWhatsAppPayload(
                `${student.firstName} ${student.lastName}`,
                student.primaryParentName,
                student.primaryPhone,
                student.course.name,
                validated.amount,
                balance
            );

            return {
                entry,
                financialSummary: { totalCharged, totalDiscount, totalPaid, balanceDue: balance },
                whatsappPayload,
            };
        });

        return success(result);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getStudentLedger(studentId: string): Promise<ActionResult> {
    try {
        const entries = await prisma.studentFeeLedgerEntry.findMany({
            where: { studentId },
            orderBy: { createdAt: "desc" },
            include: { feePlan: true },
        });
        return success(entries);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getCollectionsReport(filters?: {
    startDate?: string;
    endDate?: string;
    courseId?: string;
}): Promise<ActionResult> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = { type: "PAYMENT" };
        if (filters?.startDate || filters?.endDate) {
            where.createdAt = {};
            if (filters?.startDate) where.createdAt.gte = new Date(filters.startDate);
            if (filters?.endDate) where.createdAt.lte = new Date(filters.endDate);
        }
        if (filters?.courseId) {
            where.student = { courseId: filters.courseId };
        }

        const entries = await prisma.studentFeeLedgerEntry.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                student: {
                    select: { firstName: true, lastName: true, studentCode: true, course: { select: { name: true } } },
                },
            },
        });

        const totalCollected = entries.reduce((sum, e) => sum + e.amount, 0);
        return success({ entries, totalCollected });
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getDuesReport(): Promise<ActionResult> {
    try {
        const students = await prisma.student.findMany({
            include: {
                course: { select: { name: true } },
                batch: { select: { name: true } },
                feeLedger: true,
            },
        });

        const studentsWithDues = students
            .map((student) => {
                let totalCharged = 0;
                let totalDiscount = 0;
                let totalPaid = 0;

                for (const entry of student.feeLedger) {
                    if (entry.type === "CHARGE") totalCharged += entry.amount;
                    if (entry.type === "DISCOUNT") totalDiscount += entry.amount;
                    if (entry.type === "PAYMENT") totalPaid += entry.amount;
                }

                const balanceDue = totalCharged - totalDiscount - totalPaid;
                return {
                    id: student.id,
                    studentCode: student.studentCode,
                    name: `${student.firstName} ${student.lastName}`,
                    course: student.course.name,
                    batch: student.batch.name,
                    primaryPhone: student.primaryPhone,
                    totalCharged,
                    totalDiscount,
                    totalPaid,
                    balanceDue,
                };
            })
            .filter((s) => s.balanceDue > 0)
            .sort((a, b) => b.balanceDue - a.balanceDue);

        return success(studentsWithDues);
    } catch (err) {
        return handleActionError(err);
    }
}
