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
        const entries = await prisma.studentFeeLedgerEntry.findMany({
            where: { studentId },
        });

        let totalCharged = 0;
        let totalDiscount = 0;
        let totalPaid = 0;
        let totalAdjustment = 0;

        for (const entry of entries) {
            switch (entry.type) {
                case "CHARGE":
                    totalCharged += entry.amount;
                    break;
                case "DISCOUNT":
                    totalDiscount += entry.amount;
                    break;
                case "PAYMENT":
                    totalPaid += entry.amount;
                    break;
                case "ADJUSTMENT":
                    totalAdjustment += entry.amount;
                    break;
            }
        }

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
