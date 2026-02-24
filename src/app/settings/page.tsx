"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCourseSchema, type CreateCourseInput } from "@/lib/validators/course";
import { createBatchSchema, type CreateBatchInput } from "@/lib/validators/batch";
import { createCourse, getCourses } from "@/actions/courses";
import { createBatch } from "@/actions/batches";
import { useEffect } from "react";

export default function SettingsPage() {
    const [tab, setTab] = useState<"courses" | "batches">("courses");
    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Global Settings</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1rem" }}>
                        Configure institutional parameters and core academic infrastructures
                    </p>
                </div>
            </div>

            <div className="tabs" style={{ background: "var(--bg-secondary)", padding: "6px", borderRadius: "14px", display: "inline-flex", width: "auto", marginBottom: "var(--space-2xl)", border: "1px solid var(--border-default)" }}>
                <button
                    className={`tab ${tab === "courses" ? "active" : ""}`}
                    onClick={() => setTab("courses")}
                    style={{ padding: "10px 32px", fontSize: "0.875rem", fontWeight: 800, borderRadius: "10px", transition: "all 0.2s ease" }}
                >
                    Curriculum Strategy
                </button>
                <button
                    className={`tab ${tab === "batches" ? "active" : ""}`}
                    onClick={() => setTab("batches")}
                    style={{ padding: "10px 32px", fontSize: "0.875rem", fontWeight: 800, borderRadius: "10px", transition: "all 0.2s ease" }}
                >
                    Academic Batches
                </button>
            </div>

            <div style={{ maxWidth: "800px" }}>
                {tab === "courses" && <CourseManager />}
                {tab === "batches" && <BatchManager />}
            </div>
        </div>
    );
}

function CourseManager() {
    const router = useRouter();
    const [err, setErr] = useState("");
    const [ok, setOk] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateCourseInput>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createCourseSchema) as any, defaultValues: { active: true, defaultTotalFee: 0 },
    });
    const onSubmit = async (data: CreateCourseInput) => {
        setErr(""); setOk(false);
        const r = await createCourse(data);
        if (r.success) { setOk(true); reset(); router.refresh(); } else setErr(r.error || "Error");
    };
    return (
        <div className="section-card" style={{ padding: "var(--space-2xl)", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
            <div className="section-header" style={{ marginBottom: "var(--space-xl)", padding: 0, border: "none", background: "transparent" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Course Definition</h3>
            </div>

            {err && (
                <div style={{
                    padding: "16px 20px",
                    background: "rgba(239, 68, 68, 0.04)",
                    color: "var(--status-overdue)",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    border: "1px solid rgba(239, 68, 68, 0.1)",
                    marginBottom: "var(--space-xl)",
                }}>
                    {err}
                </div>
            )}
            {ok && (
                <div style={{
                    padding: "16px 20px",
                    background: "rgba(16, 185, 129, 0.04)",
                    color: "var(--status-paid)",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                    marginBottom: "var(--space-xl)",
                }}>
                    Course successfully registered in institutional system.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid" style={{ gap: "var(--space-xl)" }}>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Program Name *</label>
                        <input className={`form-input ${errors.name ? "error" : ""}`} {...register("name")} placeholder="e.g. Bachelor of Commerce" style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                        {errors.name && <span className="form-error" style={{ fontWeight: 700 }}>{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Unique Course Code *</label>
                        <input className={`form-input ${errors.code ? "error" : ""}`} {...register("code")} placeholder="e.g. BCOM-01" style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                        {errors.code && <span className="form-error" style={{ fontWeight: 700 }}>{errors.code.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Standard Fee (₹)</label>
                        <input type="number" className="form-input" {...register("defaultTotalFee")} placeholder="0.00" style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Description</label>
                        <input className="form-input" {...register("description")} placeholder="Brief overview of the curriculum" style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                    </div>
                </div>
                <div style={{ marginTop: "var(--space-2xl)", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--border-default)" }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{
                        height: "52px",
                        padding: "0 40px",
                        borderRadius: "12px",
                        fontWeight: 800,
                        fontSize: "1rem",
                        boxShadow: "0 12px 24px rgba(37, 99, 235, 0.2)"
                    }}>
                        {isSubmitting ? "Processing..." : "Register Course"}
                    </button>
                </div>
            </form>
        </div>
    );
}

function BatchManager() {
    const router = useRouter();
    const [err, setErr] = useState("");
    const [ok, setOk] = useState(false);
    const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateBatchInput>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createBatchSchema) as any,
    });

    useEffect(() => {
        getCourses().then(r => { if (r.success) setCourses(r.data as { id: string; name: string }[]); });
    }, []);

    const onSubmit = async (data: CreateBatchInput) => {
        setErr(""); setOk(false);
        const r = await createBatch(data);
        if (r.success) { setOk(true); reset(); router.refresh(); } else setErr(r.error || "Error");
    };
    return (
        <div className="section-card" style={{ padding: "var(--space-2xl)", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
            <div className="section-header" style={{ marginBottom: "var(--space-xl)", padding: 0, border: "none", background: "transparent" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Batch Provisioning</h3>
            </div>

            {err && (
                <div style={{
                    padding: "16px 20px",
                    background: "rgba(239, 68, 68, 0.04)",
                    color: "var(--status-overdue)",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    border: "1px solid rgba(239, 68, 68, 0.1)",
                    marginBottom: "var(--space-xl)",
                }}>
                    {err}
                </div>
            )}
            {ok && (
                <div style={{
                    padding: "16px 20px",
                    background: "rgba(16, 185, 129, 0.04)",
                    color: "var(--status-paid)",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    border: "1px solid rgba(16, 185, 129, 0.1)",
                    marginBottom: "var(--space-xl)",
                }}>
                    Academic batch initialized successfully.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid" style={{ gap: "var(--space-xl)" }}>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Batch Name *</label>
                        <input className={`form-input ${errors.name ? "error" : ""}`} {...register("name")} placeholder="e.g. Morning Session A" style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                        {errors.name && <span className="form-error" style={{ fontWeight: 700 }}>{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Parent Curriculum *</label>
                        <select className={`form-select ${errors.courseId ? "error" : ""}`} {...register("courseId")} style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }}>
                            <option value="">Select Course</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {errors.courseId && <span className="form-error" style={{ fontWeight: 700 }}>{errors.courseId.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Session Start *</label>
                        <input type="date" className={`form-input ${errors.startDate ? "error" : ""}`} {...register("startDate")} style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Session End *</label>
                        <input type="date" className={`form-input ${errors.endDate ? "error" : ""}`} {...register("endDate")} style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Academic Year *</label>
                        <input className={`form-input ${errors.academicYear ? "error" : ""}`} {...register("academicYear")} placeholder="e.g. 2025-2026" style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                    </div>
                </div>
                <div style={{ marginTop: "var(--space-2xl)", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--border-default)" }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{
                        height: "52px",
                        padding: "0 40px",
                        borderRadius: "12px",
                        fontWeight: 800,
                        fontSize: "1rem",
                        boxShadow: "0 12px 24px rgba(37, 99, 235, 0.2)"
                    }}>
                        {isSubmitting ? "Processing..." : "Initialize Batch"}
                    </button>
                </div>
            </form>
        </div>
    );
}


