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

        const [totalStudents, totalStaff] = await Promise.all([
            prisma.student.count(),
            prisma.staff.count({ where: { isActive: true } }),
        ]);

        // Get all fee ledger entries for outstanding balance
        const allFeeEntries = await prisma.studentFeeLedgerEntry.findMany();
        let totalCharged = 0, totalDiscount = 0, totalPaid = 0;
        for (const e of allFeeEntries) {
            if (e.type === "CHARGE") totalCharged += e.amount;
            if (e.type === "DISCOUNT") totalDiscount += e.amount;
            if (e.type === "PAYMENT") totalPaid += e.amount;
        }
        const outstandingFees = totalCharged - totalDiscount - totalPaid;

        // This month's collections
        const monthPayments = await prisma.studentFeeLedgerEntry.findMany({
            where: {
                type: "PAYMENT",
                createdAt: { gte: startOfMonth, lte: endOfMonth },
            },
        });
        const thisMonthCollections = monthPayments.reduce((sum, e) => sum + e.amount, 0);

        // Pending payroll
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const payrollEntries = await prisma.payrollLedgerEntry.findMany({
            where: { month: currentMonth, year: currentYear },
        });
        const pendingPayroll = payrollEntries.reduce((sum, e) => sum + e.pendingBalance, 0);

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
