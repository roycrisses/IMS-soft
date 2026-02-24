"use server";

import prisma from "@/lib/db";
import { handleActionError, success, failure, type ActionResult } from "@/lib/errors";
import { createBatchSchema, type CreateBatchInput } from "@/lib/validators/batch";

export async function getBatches(courseId?: string): Promise<ActionResult> {
    try {
        const where = courseId ? { courseId } : {};
        const batches = await prisma.batch.findMany({
            where,
            orderBy: { startDate: "desc" },
            include: { course: true, _count: { select: { students: true } } },
        });
        return success(batches);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getBatch(id: string): Promise<ActionResult> {
    try {
        const batch = await prisma.batch.findUnique({
            where: { id },
            include: { course: true, students: true },
        });
        if (!batch) return failure("Batch not found.");
        return success(batch);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function createBatch(data: CreateBatchInput): Promise<ActionResult> {
    try {
        const validated = createBatchSchema.parse(data);
        const batch = await prisma.batch.create({ data: validated });
        return success(batch);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function updateBatch(id: string, data: Partial<CreateBatchInput>): Promise<ActionResult> {
    try {
        const validated = createBatchSchema.partial().parse(data);
        const batch = await prisma.batch.update({ where: { id }, data: validated });
        return success(batch);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function deleteBatch(id: string): Promise<ActionResult> {
    try {
        await prisma.batch.delete({ where: { id } });
        return success(null);
    } catch (err) {
        return handleActionError(err);
    }
}
