"use server";

import prisma from "@/lib/db";
import { handleActionError, success, failure, type ActionResult } from "@/lib/errors";
import { createCourseSchema, updateCourseSchema, type CreateCourseInput } from "@/lib/validators/course";

export async function getCourses(): Promise<ActionResult> {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { students: true, batches: true } } },
        });
        return success(courses);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function getCourse(id: string): Promise<ActionResult> {
    try {
        const course = await prisma.course.findUnique({
            where: { id },
            include: { batches: true, _count: { select: { students: true } } },
        });
        if (!course) return failure("Course not found.");
        return success(course);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function createCourse(data: CreateCourseInput): Promise<ActionResult> {
    try {
        const validated = createCourseSchema.parse(data);
        const course = await prisma.course.create({ data: validated });
        return success(course);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function updateCourse(id: string, data: Partial<CreateCourseInput>): Promise<ActionResult> {
    try {
        const validated = updateCourseSchema.parse(data);
        const course = await prisma.course.update({ where: { id }, data: validated });
        return success(course);
    } catch (err) {
        return handleActionError(err);
    }
}

export async function deleteCourse(id: string): Promise<ActionResult> {
    try {
        await prisma.course.delete({ where: { id } });
        return success(null);
    } catch (err) {
        return handleActionError(err);
    }
}
