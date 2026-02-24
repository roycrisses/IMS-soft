"use server";

import prisma from "@/lib/db";
import { handleActionError, success, type ActionResult } from "@/lib/errors";

export async function recordAttendance(
    studentId: string,
    date: string,
    status: "PRESENT" | "ABSENT" | "LATE",
    markedBy: string = "admin"
): Promise<ActionResult> {
    try {
        const entry = await prisma.attendance.upsert({
            where: {
                studentId_date: {
                    studentId,
                    date: new Date(date),
                },
            },
            create: {
                studentId,
                date: new Date(date),
                status,
                markedBy,
            },
            update: {
                status,
                markedBy,
            },
        });
        return success(entry);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getAttendance(
    studentId: string,
    startDate?: string,
    endDate?: string
): Promise<ActionResult> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = { studentId };
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const records = await prisma.attendance.findMany({
            where,
            orderBy: { date: "desc" },
        });
        return success(records);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getDashboardStats(): Promise<ActionResult> {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Optimization: Use database aggregation instead of fetching all records into memory.
        // This reduces memory usage from O(N) to O(1) and significantly decreases network transfer.
        const [totalStudents, totalStaff, feeSummary, monthCollections, payrollSummary] = await Promise.all([
            prisma.student.count(),
            prisma.staff.count({ where: { isActive: true } }),
            prisma.studentFeeLedgerEntry.groupBy({
                by: ['type'],
                _sum: { amount: true },
            }),
            prisma.studentFeeLedgerEntry.aggregate({
                where: {
                    type: "PAYMENT",
                    createdAt: { gte: startOfMonth, lte: endOfMonth },
                },
                _sum: { amount: true },
            }),
            prisma.payrollLedgerEntry.aggregate({
                where: {
                    month: now.getMonth() + 1,
                    year: now.getFullYear(),
                },
                _sum: { pendingBalance: true },
            }),
        ]);

        const feeTotals = { CHARGE: 0, DISCOUNT: 0, PAYMENT: 0 };
        feeSummary.forEach(s => {
            if (s.type in feeTotals) {
                feeTotals[s.type as keyof typeof feeTotals] = s._sum.amount || 0;
            }
        });

        const outstandingFees = feeTotals.CHARGE - feeTotals.DISCOUNT - feeTotals.PAYMENT;
        const thisMonthCollections = monthCollections._sum.amount || 0;
        const pendingPayroll = payrollSummary._sum.pendingBalance || 0;

        return success({
            totalStudents,
            totalStaff,
            outstandingFees,
            thisMonthCollections,
            pendingPayroll,
        });
    } catch (err) {
        return handleActionError(err);
    }
}
