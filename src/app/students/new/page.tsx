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
        <div style={{ maxWidth: "840px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>Student Registration</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1.0625rem" }}>
                        Enroll a new student into the institutional academic registry
                    </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => router.back()} style={{
                    height: "44px",
                    padding: "0 20px",
                    borderRadius: "10px",
                    fontWeight: 800,
                    background: "#ffffff",
                    border: "1px solid var(--border-default)",
                    fontSize: "0.875rem"
                }}>
                    Cancel
                </button>
            </div>

            <div className="section-card" style={{ padding: "32px", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", borderRadius: "20px" }}>
                {serverError && (
                    <div style={{
                        padding: "16px 20px",
                        background: "rgba(239, 68, 68, 0.04)",
                        color: "var(--status-overdue)",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: 800,
                        border: "1px solid rgba(239, 68, 68, 0.1)",
                        marginBottom: "var(--space-2xl)",
                    }}>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-grid" style={{ gap: "var(--space-xl)" }}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Registry ID <span style={{ color: "var(--status-overdue)" }}>*</span></label>
                            <input className={`form-input ${errors.studentCode ? "error" : ""}`} {...register("studentCode")} placeholder="STU-2024-001" style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }} />
                            {errors.studentCode && <span className="form-error" style={{ fontWeight: 800, fontSize: "0.75rem", marginTop: "4px" }}>{errors.studentCode.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Enrollment Date</label>
                            <input type="date" className="form-input" {...register("enrollmentDate")} style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }} />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>First Name <span style={{ color: "var(--status-overdue)" }}>*</span></label>
                            <input className={`form-input ${errors.firstName ? "error" : ""}`} {...register("firstName")} style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }} />
                            {errors.firstName && <span className="form-error" style={{ fontWeight: 800, fontSize: "0.75rem", marginTop: "4px" }}>{errors.firstName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Last Name <span style={{ color: "var(--status-overdue)" }}>*</span></label>
                            <input className={`form-input ${errors.lastName ? "error" : ""}`} {...register("lastName")} style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }} />
                            {errors.lastName && <span className="form-error" style={{ fontWeight: 800, fontSize: "0.75rem", marginTop: "4px" }}>{errors.lastName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Academic Program <span style={{ color: "var(--status-overdue)" }}>*</span></label>
                            <select className={`form-select ${errors.courseId ? "error" : ""}`} {...register("courseId")} style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }}>
                                <option value="">Select program</option>
                                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.courseId && <span className="form-error" style={{ fontWeight: 800, fontSize: "0.75rem", marginTop: "4px" }}>{errors.courseId.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Allocated Batch <span style={{ color: "var(--status-overdue)" }}>*</span></label>
                            <select className={`form-select ${errors.batchId ? "error" : ""}`} {...register("batchId")} style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }}>
                                <option value="">Select batch</option>
                                {batches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                            {errors.batchId && <span className="form-error" style={{ fontWeight: 800, fontSize: "0.75rem", marginTop: "4px" }}>{errors.batchId.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Primary Guardian <span style={{ color: "var(--status-overdue)" }}>*</span></label>
                            <input className={`form-input ${errors.primaryParentName ? "error" : ""}`} {...register("primaryParentName")} style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }} />
                            {errors.primaryParentName && <span className="form-error" style={{ fontWeight: 800, fontSize: "0.75rem", marginTop: "4px" }}>{errors.primaryParentName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Secondary Guardian</label>
                            <input className="form-input" {...register("secondaryParentName")} style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }} />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Primary Contact <span style={{ color: "var(--status-overdue)" }}>*</span></label>
                            <input className={`form-input ${errors.primaryPhone ? "error" : ""}`} {...register("primaryPhone")} placeholder="+91" style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }} />
                            {errors.primaryPhone && <span className="form-error" style={{ fontWeight: 800, fontSize: "0.75rem", marginTop: "4px" }}>{errors.primaryPhone.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Emergency Contact</label>
                            <input className="form-input" {...register("secondaryPhone")} style={{ height: "48px", borderRadius: "12px", border: "1px solid var(--border-default)", fontWeight: 700 }} />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: "var(--space-xl)" }}>
                        <label className="form-label" style={{ fontWeight: 900, fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Registry Address</label>
                        <textarea className="form-textarea" {...register("address")} rows={3} style={{ borderRadius: "16px", padding: "16px", fontWeight: 700, background: "var(--bg-secondary)", border: "1px solid var(--border-default)", fontSize: "0.9375rem" }} />
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-2xl)", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--border-default)" }}>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{
                            height: "56px",
                            padding: "0 48px",
                            borderRadius: "14px",
                            fontWeight: 800,
                            fontSize: "1.0625rem",
                            boxShadow: "0 10px 20px rgba(37, 99, 235, 0.15)"
                        }}>
                            {isSubmitting ? "Processing..." : "Confirm & Register Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>


    );
}
