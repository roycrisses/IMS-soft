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
        <div>
            <div className="page-header"><h1>Settings</h1></div>
            <div className="tabs">
                <button className={`tab ${tab === "courses" ? "active" : ""}`} onClick={() => setTab("courses")}>Courses</button>
                <button className={`tab ${tab === "batches" ? "active" : ""}`} onClick={() => setTab("batches")}>Batches</button>
            </div>
            {tab === "courses" && <CourseManager />}
            {tab === "batches" && <BatchManager />}
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
        <div className="card" style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 16 }}>Add Course</h3>
            {err && <div style={{ padding: 8, background: "var(--status-overdue-bg)", color: "var(--status-overdue)", borderRadius: 6, fontSize: "0.875rem", marginBottom: 12 }}>{err}</div>}
            {ok && <div style={{ padding: 8, background: "var(--status-paid-bg)", color: "var(--status-paid)", borderRadius: 6, fontSize: "0.875rem", marginBottom: 12 }}>Course created!</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input className={`form-input ${errors.name ? "error" : ""}`} {...register("name")} />
                        {errors.name && <span className="form-error">{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Code *</label>
                        <input className={`form-input ${errors.code ? "error" : ""}`} {...register("code")} placeholder="e.g. CS101" />
                        {errors.code && <span className="form-error">{errors.code.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Default Fee</label>
                        <input type="number" className="form-input" {...register("defaultTotalFee")} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <input className="form-input" {...register("description")} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm mt-lg" disabled={isSubmitting}>{isSubmitting ? "..." : "Add Course"}</button>
            </form>
        </div>
    );
}

function BatchManager() {
    const router = useRouter();
    const [err, setErr] = useState("");
    const [ok, setOk] = useState(false);
    const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateBatchInput>({
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
        <div className="card" style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 16 }}>Add Batch</h3>
            {err && <div style={{ padding: 8, background: "var(--status-overdue-bg)", color: "var(--status-overdue)", borderRadius: 6, fontSize: "0.875rem", marginBottom: 12 }}>{err}</div>}
            {ok && <div style={{ padding: 8, background: "var(--status-paid-bg)", color: "var(--status-paid)", borderRadius: 6, fontSize: "0.875rem", marginBottom: 12 }}>Batch created!</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input className={`form-input ${errors.name ? "error" : ""}`} {...register("name")} />
                        {errors.name && <span className="form-error">{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Course *</label>
                        <select className={`form-select ${errors.courseId ? "error" : ""}`} {...register("courseId")}>
                            <option value="">Select</option>
                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        {errors.courseId && <span className="form-error">{errors.courseId.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Start Date *</label>
                        <input type="date" className={`form-input ${errors.startDate ? "error" : ""}`} {...register("startDate")} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">End Date *</label>
                        <input type="date" className={`form-input ${errors.endDate ? "error" : ""}`} {...register("endDate")} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Academic Year *</label>
                        <input className={`form-input ${errors.academicYear ? "error" : ""}`} {...register("academicYear")} placeholder="2025-26" />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary btn-sm mt-lg" disabled={isSubmitting}>{isSubmitting ? "..." : "Add Batch"}</button>
            </form>
        </div>
    );
}
