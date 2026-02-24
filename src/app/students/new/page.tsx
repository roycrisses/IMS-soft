"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStudentSchema, type CreateStudentInput } from "@/lib/validators/student";
import { createStudent } from "@/actions/students";
import { useState, useEffect } from "react";
import { getCourses } from "@/actions/courses";
import { getBatches } from "@/actions/batches";

export default function NewStudentPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
    const [batches, setBatches] = useState<{ id: string; name: string }[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateStudentInput>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createStudentSchema) as any,
    });

    const selectedCourseId = watch("courseId");

    useEffect(() => {
        getCourses().then((res) => {
            if (res.success) setCourses(res.data as { id: string; name: string }[]);
        });
    }, []);

    useEffect(() => {
        if (selectedCourseId) {
            getBatches(selectedCourseId).then((res) => {
                if (res.success) setBatches(res.data as { id: string; name: string }[]);
            });
        }
    }, [selectedCourseId]);

    const onSubmit = async (data: CreateStudentInput) => {
        setServerError("");
        const result = await createStudent(data);
        if (result.success) {
            router.push("/students");
            router.refresh();
        } else {
            setServerError(result.error || "Failed to create student.");
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Add New Student</h1>
            </div>

            <div className="card" style={{ maxWidth: 720 }}>
                {serverError && (
                    <div style={{
                        padding: "var(--space-md)",
                        background: "var(--status-overdue-bg)",
                        color: "var(--status-overdue)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        marginBottom: "var(--space-lg)",
                    }}>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Student Code *</label>
                            <input className={`form-input ${errors.studentCode ? "error" : ""}`} {...register("studentCode")} placeholder="e.g. STU-001" />
                            {errors.studentCode && <span className="form-error">{errors.studentCode.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Enrollment Date</label>
                            <input type="date" className="form-input" {...register("enrollmentDate")} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">First Name *</label>
                            <input className={`form-input ${errors.firstName ? "error" : ""}`} {...register("firstName")} />
                            {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name *</label>
                            <input className={`form-input ${errors.lastName ? "error" : ""}`} {...register("lastName")} />
                            {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Course *</label>
                            <select className={`form-select ${errors.courseId ? "error" : ""}`} {...register("courseId")}>
                                <option value="">Select course</option>
                                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.courseId && <span className="form-error">{errors.courseId.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Batch *</label>
                            <select className={`form-select ${errors.batchId ? "error" : ""}`} {...register("batchId")}>
                                <option value="">Select batch</option>
                                {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            {errors.batchId && <span className="form-error">{errors.batchId.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Primary Parent Name *</label>
                            <input className={`form-input ${errors.primaryParentName ? "error" : ""}`} {...register("primaryParentName")} />
                            {errors.primaryParentName && <span className="form-error">{errors.primaryParentName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Secondary Parent Name</label>
                            <input className="form-input" {...register("secondaryParentName")} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Primary Phone *</label>
                            <input className={`form-input ${errors.primaryPhone ? "error" : ""}`} {...register("primaryPhone")} placeholder="+91-XXXXXXXXXX" />
                            {errors.primaryPhone && <span className="form-error">{errors.primaryPhone.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Secondary Phone</label>
                            <input className="form-input" {...register("secondaryPhone")} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Photo URL</label>
                            <input className="form-input" {...register("photoUrl")} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: "var(--space-lg)" }}>
                        <label className="form-label">Address</label>
                        <textarea className="form-textarea" {...register("address")} rows={3} />
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-xl)" }}>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Student"}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
