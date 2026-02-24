"use server";

import prisma from "@/lib/db";
import { handleActionError, success, failure, type ActionResult } from "@/lib/errors";
import { postPayrollSchema, recordSalaryPaymentSchema, type PostPayrollInput, type RecordSalaryPaymentInput } from "@/lib/validators/payroll";

export async function postMonthlyPayroll(data: PostPayrollInput): Promise<ActionResult> {
    try {
        const validated = postPayrollSchema.parse(data);

        // Look up the current salary structure for the staff member
        const salaryStructure = await prisma.salaryStructure.findFirst({
            where: {
                staffId: validated.staffId,
                effectiveFrom: { lte: new Date() },
                OR: [
                    { effectiveTo: null },
                    { effectiveTo: { gte: new Date() } },
                ],
            },
            orderBy: { effectiveFrom: "desc" },
        });

        if (!salaryStructure) {
            return failure("No active salary structure found for this staff member.");
        }

        // Check for existing payroll entry for this month
        const existing = await prisma.payrollLedgerEntry.findFirst({
            where: {
                staffId: validated.staffId,
                month: validated.month,
                year: validated.year,
            },
        });

        if (existing) {
            return failure(`Payroll already posted for ${validated.month}/${validated.year}.`);
        }

        const grossSalary = salaryStructure.base + salaryStructure.allowances;
        const netPayable = grossSalary - validated.deductions;

        const entry = await prisma.payrollLedgerEntry.create({
            data: {
                staffId: validated.staffId,
                month: validated.month,
                year: validated.year,
                grossSalary,
                deductions: validated.deductions,
                netPayable,
                paidAmount: 0,
                pendingBalance: netPayable,
            },
        });

        return success(entry);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function recordSalaryPayment(data: RecordSalaryPaymentInput): Promise<ActionResult> {
    try {
        const validated = recordSalaryPaymentSchema.parse(data);

        const payrollEntry = await prisma.payrollLedgerEntry.findUnique({
            where: { id: validated.payrollId },
        });

        if (!payrollEntry) return failure("Payroll entry not found.");

        const newPaidAmount = payrollEntry.paidAmount + validated.amount;
        const newPendingBalance = payrollEntry.netPayable - newPaidAmount;

        if (newPendingBalance < -0.01) {
            return failure("Payment amount exceeds pending balance.");
        }

        // Record payment history in meta
        const existingMeta = payrollEntry.meta ? JSON.parse(payrollEntry.meta) : {};
        const payments = existingMeta.payments || [];
        payments.push({
            amount: validated.amount,
            date: new Date().toISOString(),
            notes: validated.notes,
        });

        const updated = await prisma.payrollLedgerEntry.update({
            where: { id: validated.payrollId },
            data: {
                paidAmount: newPaidAmount,
                pendingBalance: Math.max(0, newPendingBalance),
                paidDate: newPendingBalance <= 0.01 ? new Date() : payrollEntry.paidDate,
                meta: JSON.stringify({ ...existingMeta, payments }),
            },
        });

        return success(updated);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getPayrollReport(filters?: {
    month?: number;
    year?: number;
}): Promise<ActionResult> {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};
        if (filters?.month) where.month = filters.month;
        if (filters?.year) where.year = filters.year;

        const entries = await prisma.payrollLedgerEntry.findMany({
            where,
            orderBy: [{ year: "desc" }, { month: "desc" }],
            include: {
                staff: { select: { firstName: true, lastName: true, role: true } },
            },
        });

        const totalGross = entries.reduce((sum, e) => sum + e.grossSalary, 0);
        const totalDeductions = entries.reduce((sum, e) => sum + e.deductions, 0);
        const totalPaid = entries.reduce((sum, e) => sum + e.paidAmount, 0);
        const totalPending = entries.reduce((sum, e) => sum + e.pendingBalance, 0);

        return success({ entries, totalGross, totalDeductions, totalPaid, totalPending });
    } catch (err) {
        return handleActionError(err);
    }
}
