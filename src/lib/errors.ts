import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export type ActionResult<T = unknown> = {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: Record<string, string[]>;
};

export function success<T>(data: T): ActionResult<T> {
    return { success: true, data };
}

export function failure(error: string, fieldErrors?: Record<string, string[]>): ActionResult {
    return { success: false, error, fieldErrors };
}

export function handleActionError(err: unknown): ActionResult {
    if (err instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of err.issues) {
            const path = issue.path.join(".");
            if (!fieldErrors[path]) fieldErrors[path] = [];
            fieldErrors[path].push(issue.message);
        }
        return failure("Validation failed. Please check the form fields.", fieldErrors);
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return failure("A record with this unique value already exists.");
            case "P2003":
                return failure("This record references a related record that does not exist.");
            case "P2025":
                return failure("The record you are trying to update or delete was not found.");
            default:
                return failure(`Database error: ${err.code}`);
        }
    }

    if (err instanceof Error) {
        return failure(err.message);
    }

    return failure("An unexpected error occurred.");
}
