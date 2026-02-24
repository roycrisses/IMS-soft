"use server";

import prisma from "@/lib/db";
import { handleActionError, success, failure, type ActionResult } from "@/lib/errors";
import { createStudentSchema, updateStudentSchema, type CreateStudentInput } from "@/lib/validators/student";

export async function getStudents(filters?: {
    search?: string;
    courseId?: string;
    batchId?: string;
    page?: number;
    pageSize?: number;
}): Promise<ActionResult> {
    try {
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 20;
        const skip = (page - 1) * pageSize;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};
        if (filters?.courseId) where.courseId = filters.courseId;
        if (filters?.batchId) where.batchId = filters.batchId;
        if (filters?.search) {
            where.OR = [
                { firstName: { contains: filters.search, mode: "insensitive" } },
                { lastName: { contains: filters.search, mode: "insensitive" } },
                { studentCode: { contains: filters.search, mode: "insensitive" } },
                { primaryPhone: { contains: filters.search, mode: "insensitive" } },
            ];
        }


        const [students, total] = await Promise.all([
            prisma.student.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
                include: {
                    course: { select: { name: true } },
                    batch: { select: { name: true } },
                },
            }),
            prisma.student.count({ where }),
        ]);

        return success({ students, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getStudent(id: string): Promise<ActionResult> {
    try {
        const student = await prisma.student.findUnique({
            where: { id },
            include: {
                course: true,
                batch: true,
                feePlans: { orderBy: { createdAt: "desc" } },
                feeLedger: { orderBy: { createdAt: "desc" } },
                attendance: { orderBy: { date: "desc" }, take: 30 },
            },
        });
        if (!student) return failure("Student not found.");
        return success(student);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getStudentFinancialSummary(studentId: string): Promise<ActionResult> {
    try {
        // Optimization: Use database aggregation instead of fetching all ledger entries into memory.
        // This is more efficient for students with many transactions.
        const summary = await prisma.studentFeeLedgerEntry.groupBy({
            by: ['type'],
            where: { studentId },
            _sum: { amount: true },
        });

        const totals = {
            CHARGE: 0,
            DISCOUNT: 0,
            PAYMENT: 0,
            ADJUSTMENT: 0,
        };

        summary.forEach((item) => {
            if (item.type in totals) {
                totals[item.type as keyof typeof totals] = item._sum.amount || 0;
            }
        });

        const totalCharged = totals.CHARGE;
        const totalDiscount = totals.DISCOUNT;
        const totalPaid = totals.PAYMENT;
        const totalAdjustment = totals.ADJUSTMENT;

        const netPayable = totalCharged - totalDiscount + totalAdjustment;
        const balanceDue = netPayable - totalPaid;

        return success({
            totalCharged,
            totalDiscount,
            totalPaid,
            totalAdjustment,
            netPayable,
            balanceDue,
        });
    } catch (err) {
        return handleActionError(err);
    }
}

export async function createStudent(data: CreateStudentInput): Promise<ActionResult> {
    try {
        const validated = createStudentSchema.parse(data);
        const student = await prisma.student.create({
            data: {
                ...validated,
                photoUrl: validated.photoUrl || null,
                secondaryParentName: validated.secondaryParentName || null,
                secondaryPhone: validated.secondaryPhone || null,
                address: validated.address || null,
            },
        });
        return success(student);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function updateStudent(id: string, data: Partial<CreateStudentInput>): Promise<ActionResult> {
    try {
        const validated = updateStudentSchema.parse(data);
        const student = await prisma.student.update({ where: { id }, data: validated });
        return success(student);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function deleteStudent(id: string): Promise<ActionResult> {
    try {
        await prisma.student.delete({ where: { id } });
        return success(null);
    } catch (err) {
        return handleActionError(err);
    }
}
