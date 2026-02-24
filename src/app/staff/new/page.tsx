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
        <div>
            <div className="page-header">
                <h1>Add Staff Member</h1>
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
                            <label className="form-label">Role *</label>
                            <input className={`form-input ${errors.role ? "error" : ""}`} {...register("role")} placeholder="e.g. Teacher, Administrator" />
                            {errors.role && <span className="form-error">{errors.role.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Join Date</label>
                            <input type="date" className="form-input" {...register("joinDate")} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className={`form-input ${errors.email ? "error" : ""}`} {...register("email")} />
                            {errors.email && <span className="form-error">{errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-input" {...register("phone")} />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-xl)" }}>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Staff Member"}
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
