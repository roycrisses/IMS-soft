"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSalaryStructureSchema, type CreateSalaryStructureInput } from "@/lib/validators/staff";
import { createSalaryStructure } from "@/actions/staff";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StaffData = any;

export default function StaffDetailClient({ staff }: { staff: StaffData }) {
    const [activeTab, setActiveTab] = useState<"profile" | "salary" | "payroll">("profile");
    const [showSalaryForm, setShowSalaryForm] = useState(false);
    const router = useRouter();

    return (
        <div>
            <div className="tabs">
                <button className={`tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}>
                    Profile
                </button>
                <button className={`tab ${activeTab === "salary" ? "active" : ""}`} onClick={() => setActiveTab("salary")}>
                    Salary History
                </button>
                <button className={`tab ${activeTab === "payroll" ? "active" : ""}`} onClick={() => setActiveTab("payroll")}>
                    Payroll
                </button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="card">
                    <div className="form-grid">
                        <div>
                            <div className="text-muted text-sm">Full Name</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{staff.firstName} {staff.lastName}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Role</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{staff.role}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Email</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{staff.email || "—"}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Phone</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{staff.phone || "—"}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Join Date</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{new Date(staff.joinDate).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Status</div>
                            <div style={{ marginTop: 2 }}>
                                <span className={`status-pill ${staff.isActive ? "active" : "inactive"}`}>
                                    {staff.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Salary History Tab */}
            {activeTab === "salary" && (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
                        <h3>Salary Structures</h3>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowSalaryForm(!showSalaryForm)}>
                            Add Salary Structure
                        </button>
                    </div>

                    {showSalaryForm && (
                        <SalaryForm
                            staffId={staff.id}
                            onSuccess={() => {
                                setShowSalaryForm(false);
                                router.refresh();
                            }}
                        />
                    )}

                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Effective From</th>
                                    <th>Effective To</th>
                                    <th className="text-right">Base</th>
                                    <th className="text-right">Allowances</th>
                                    <th className="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.salaryStructures?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5}><div className="empty-state"><p>No salary structures configured</p></div></td>
                                    </tr>
                                ) : (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    staff.salaryStructures?.map((ss: any) => (
                                        <tr key={ss.id}>
                                            <td>{new Date(ss.effectiveFrom).toLocaleDateString()}</td>
                                            <td>{ss.effectiveTo ? new Date(ss.effectiveTo).toLocaleDateString() : "Current"}</td>
                                            <td className="text-right font-mono">₹{ss.base.toLocaleString()}</td>
                                            <td className="text-right font-mono">₹{ss.allowances.toLocaleString()}</td>
                                            <td className="text-right font-mono" style={{ fontWeight: 600 }}>₹{(ss.base + ss.allowances).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Payroll Tab */}
            {activeTab === "payroll" && (
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th className="text-right">Gross</th>
                                <th className="text-right">Deductions</th>
                                <th className="text-right">Net</th>
                                <th className="text-right">Paid</th>
                                <th className="text-right">Pending</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.payrollEntries?.length === 0 ? (
                                <tr>
                                    <td colSpan={7}><div className="empty-state"><p>No payroll entries yet</p></div></td>
                                </tr>
                            ) : (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                staff.payrollEntries?.map((pe: any) => (
                                    <tr key={pe.id}>
                                        <td style={{ fontWeight: 500 }}>{pe.month}/{pe.year}</td>
                                        <td className="text-right font-mono">₹{pe.grossSalary.toLocaleString()}</td>
                                        <td className="text-right font-mono">₹{pe.deductions.toLocaleString()}</td>
                                        <td className="text-right font-mono">₹{pe.netPayable.toLocaleString()}</td>
                                        <td className="text-right font-mono" style={{ color: "var(--status-paid)" }}>₹{pe.paidAmount.toLocaleString()}</td>
                                        <td className="text-right font-mono" style={{ color: pe.pendingBalance > 0 ? "var(--status-overdue)" : "inherit" }}>₹{pe.pendingBalance.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-pill ${pe.pendingBalance <= 0 ? "paid" : pe.paidAmount > 0 ? "partial" : "pending"}`}>
                                                {pe.pendingBalance <= 0 ? "Paid" : pe.paidAmount > 0 ? "Partial" : "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function SalaryForm({ staffId, onSuccess }: { staffId: string; onSuccess: () => void }) {
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateSalaryStructureInput>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createSalaryStructureSchema) as any,
        defaultValues: { staffId, allowances: 0 },
    });

    const onSubmit = async (data: CreateSalaryStructureInput) => {
        setServerError("");
        const result = await createSalaryStructure(data);
        if (result.success) {
            onSuccess();
        } else {
            setServerError(result.error || "Failed to create salary structure.");
        }
    };

    return (
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
            <h4 style={{ marginBottom: "var(--space-md)" }}>New Salary Structure</h4>
            {serverError && (
                <div style={{ padding: "var(--space-sm)", background: "var(--status-overdue-bg)", color: "var(--status-overdue)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginBottom: "var(--space-md)" }}>
                    {serverError}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("staffId")} />
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Base Salary *</label>
                        <input type="number" step="0.01" className={`form-input ${errors.base ? "error" : ""}`} {...register("base")} />
                        {errors.base && <span className="form-error">{errors.base.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Allowances</label>
                        <input type="number" step="0.01" className="form-input" {...register("allowances")} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Effective From *</label>
                        <input type="date" className={`form-input ${errors.effectiveFrom ? "error" : ""}`} {...register("effectiveFrom")} />
                        {errors.effectiveFrom && <span className="form-error">{errors.effectiveFrom.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Effective To</label>
                        <input type="date" className="form-input" {...register("effectiveTo")} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Structure"}
                    </button>
                </div>
            </form>
        </div>
    );
}
