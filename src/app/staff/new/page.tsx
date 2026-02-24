"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStaffSchema, type CreateStaffInput } from "@/lib/validators/staff";
import { createStaffMember } from "@/actions/staff";
import { useState } from "react";

export default function NewStaffPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateStaffInput>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createStaffSchema) as any,
        defaultValues: { isActive: true },
    });

    const onSubmit = async (data: CreateStaffInput) => {
        setServerError("");
        const result = await createStaffMember(data);
        if (result.success) {
            router.push("/staff");
            router.refresh();
        } else {
            setServerError(result.error || "Failed to create staff member.");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em" }}>Faculty Induction</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1rem" }}>
                        Onboard a new faculty member or institutional administrative staff
                    </p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => router.back()} style={{
                    height: "44px",
                    padding: "0 20px",
                    borderRadius: "10px",
                    fontWeight: 700
                }}>
                    Dismiss
                </button>
            </div>

            <div className="section-card" style={{ padding: "var(--space-2xl)", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                <div className="section-header" style={{ marginBottom: "var(--space-xl)", padding: 0, border: "none", background: "transparent" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Staff Particulars</h3>
                </div>

                {serverError && (
                    <div style={{
                        padding: "16px 20px",
                        background: "rgba(239, 68, 68, 0.04)",
                        color: "var(--status-overdue)",
                        borderRadius: "12px",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        border: "1px solid rgba(239, 68, 68, 0.1)",
                        marginBottom: "var(--space-2xl)",
                    }}>
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-grid" style={{ gap: "var(--space-xl)" }}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>
                                First Name <span style={{ color: "var(--status-overdue)" }}>*</span>
                            </label>
                            <input
                                className={`form-input ${errors.firstName ? "error" : ""}`}
                                {...register("firstName")}
                                placeholder="Enter given name"
                                style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }}
                            />
                            {errors.firstName && <span className="form-error" style={{ fontWeight: 700 }}>{errors.firstName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>
                                Last Name <span style={{ color: "var(--status-overdue)" }}>*</span>
                            </label>
                            <input
                                className={`form-input ${errors.lastName ? "error" : ""}`}
                                {...register("lastName")}
                                placeholder="Enter family name"
                                style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }}
                            />
                            {errors.lastName && <span className="form-error" style={{ fontWeight: 700 }}>{errors.lastName.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>
                                Designation / Role <span style={{ color: "var(--status-overdue)" }}>*</span>
                            </label>
                            <input
                                className={`form-input ${errors.role ? "error" : ""}`}
                                {...register("role")}
                                placeholder="e.g. Senior Faculty, Lead Admin"
                                style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }}
                            />
                            {errors.role && <span className="form-error" style={{ fontWeight: 700 }}>{errors.role.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>
                                Joining Date
                            </label>
                            <input
                                type="date"
                                className="form-input"
                                {...register("joinDate")}
                                style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>
                                Official Email
                            </label>
                            <input
                                type="email"
                                className={`form-input ${errors.email ? "error" : ""}`}
                                {...register("email")}
                                placeholder="name@institution.com"
                                style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }}
                            />
                            {errors.email && <span className="form-error" style={{ fontWeight: 700 }}>{errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>
                                Primary Contact
                            </label>
                            <input
                                className="form-input"
                                {...register("phone")}
                                placeholder="+91 00000 00000"
                                style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-2xl)", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--border-default)" }}>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{
                            height: "52px",
                            padding: "0 40px",
                            borderRadius: "12px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            boxShadow: "0 12px 24px rgba(37, 99, 235, 0.2)",
                            flex: 1.5
                        }}>
                            {isSubmitting ? "Processing..." : "Register Faculty Member"}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => router.back()} style={{ height: "52px", padding: "0 32px", borderRadius: "12px", fontWeight: 700, flex: 1 }}>
                            Discard
                        </button>
                    </div>
                </form>
            </div>
        </div>


    );
}
