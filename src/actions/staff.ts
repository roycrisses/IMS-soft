"use server";

import prisma from "@/lib/db";
import { handleActionError, success, failure, type ActionResult } from "@/lib/errors";
import { createStaffSchema, updateStaffSchema, createSalaryStructureSchema, type CreateStaffInput, type CreateSalaryStructureInput } from "@/lib/validators/staff";

export async function getStaffList(): Promise<ActionResult> {
    try {
        const staff = await prisma.staff.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                salaryStructures: { orderBy: { effectiveFrom: "desc" }, take: 1 },
            },
        });
        return success(staff);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getStaffMember(id: string): Promise<ActionResult> {
    try {
        const staff = await prisma.staff.findUnique({
            where: { id },
            include: {
                salaryStructures: { orderBy: { effectiveFrom: "desc" } },
                payrollEntries: { orderBy: [{ year: "desc" }, { month: "desc" }] },
            },
        });
        if (!staff) return failure("Staff member not found.");
        return success(staff);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function createStaffMember(data: CreateStaffInput): Promise<ActionResult> {
    try {
        const validated = createStaffSchema.parse(data);
        const staff = await prisma.staff.create({
            data: {
                ...validated,
                email: validated.email || null,
                phone: validated.phone || null,
            },
        });
        return success(staff);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function updateStaffMember(id: string, data: Partial<CreateStaffInput>): Promise<ActionResult> {
    try {
        const validated = updateStaffSchema.parse(data);
        const staff = await prisma.staff.update({ where: { id }, data: validated });
        return success(staff);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function deleteStaffMember(id: string): Promise<ActionResult> {
    try {
        await prisma.staff.delete({ where: { id } });
        return success(null);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function createSalaryStructure(data: CreateSalaryStructureInput): Promise<ActionResult> {
    try {
        const validated = createSalaryStructureSchema.parse(data);
        const structure = await prisma.salaryStructure.create({ data: validated });
        return success(structure);
    } catch (err) {
        return handleActionError(err);
    }
}
