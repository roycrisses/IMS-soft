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
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
            <div className="tabs" style={{
                background: "var(--bg-secondary)",
                padding: "6px",
                borderRadius: "14px",
                display: "inline-flex",
                width: "fit-content",
                border: "1px solid var(--border-default)"
            }}>
                {([
                    { id: "profile", label: "Administrative Profile" },
                    { id: "salary", label: "Compensation Ledger" },
                    { id: "payroll", label: "Disbursement Records" }
                ] as const).map(tab => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: "10px 24px",
                            fontSize: "0.875rem",
                            fontWeight: 800,
                            borderRadius: "10px",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="section-card" style={{ padding: "var(--space-2xl)", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="section-header" style={{ marginBottom: "var(--space-2xl)", padding: 0, border: "none" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Employment Particulars</h3>
                    </div>
                    <div className="form-grid" style={{ gap: "var(--space-xl) var(--space-2xl)" }}>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Full Legal Name</div>
                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{staff.firstName} {staff.lastName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Designation / Role</div>
                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{staff.role}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Corporate Email</div>
                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{staff.email || <span style={{ color: "var(--text-tertiary)", fontWeight: 500, fontStyle: "italic" }}>Credentials pending</span>}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Contact Number</div>
                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{staff.phone || <span style={{ color: "var(--text-tertiary)", fontWeight: 500, fontStyle: "italic" }}>No record</span>}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Date of Induction</div>
                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{new Date(staff.joinDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Current Status</div>
                            <div style={{ marginTop: "4px" }}>
                                <span style={{
                                    background: staff.isActive ? "var(--status-paid-bg)" : "var(--status-pending-bg)",
                                    color: staff.isActive ? "var(--status-paid)" : "var(--text-tertiary)",
                                    fontWeight: 900,
                                    fontSize: "0.625rem",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    padding: "5px 14px",
                                    borderRadius: "100px",
                                    border: staff.isActive ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid var(--border-default)"
                                }}>
                                    {staff.isActive ? "Authorized" : "Deactivated"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Salary History Tab */}
            {activeTab === "salary" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
                    {showSalaryForm && (
                        <div className="section-card" style={{ padding: "var(--space-2xl)", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                            <SalaryForm
                                staffId={staff.id}
                                onSuccess={() => {
                                    setShowSalaryForm(false);
                                    router.refresh();
                                }}
                            />
                        </div>
                    )}

                    <div className="section-card" style={{ background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                        <div className="section-header" style={{ padding: "24px", borderBottom: "1px solid var(--border-default)" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Remuneration Architecture</h3>
                            <button className="btn btn-primary" onClick={() => setShowSalaryForm(!showSalaryForm)} style={{ height: "40px", padding: "0 20px", borderRadius: "10px", fontWeight: 800, fontSize: "0.875rem" }}>
                                {showSalaryForm ? "Dismiss Command" : "Define New Structure"}
                            </button>
                        </div>

                        <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                            <table className="data-table">
                                <thead>
                                    <tr style={{ background: "var(--bg-secondary)" }}>
                                        <th style={{ paddingLeft: "24px" }}>Validity Period</th>
                                        <th className="text-right">Base Remuneration</th>
                                        <th className="text-right">Benefit Allowances</th>
                                        <th className="text-right">Gross Total</th>
                                        <th style={{ paddingRight: "24px" }}>Term Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staff.salaryStructures?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5}>
                                                <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                                    <p style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)" }}>No compensation data</p>
                                                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>Mapped architecture is required for payroll processing.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        staff.salaryStructures?.map((ss: any) => (
                                            <tr key={ss.id}>
                                                <td style={{ paddingLeft: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
                                                    {new Date(ss.effectiveFrom).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    <span style={{ margin: "0 12px", opacity: 0.3, fontWeight: 400 }}>→</span>
                                                    {ss.effectiveTo ? new Date(ss.effectiveTo).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : <span style={{ color: "var(--status-paid)", fontWeight: 800, letterSpacing: "0.02em" }}>PERMANENT</span>}
                                                </td>
                                                <td className="text-right font-mono" style={{ fontWeight: 700, color: "var(--text-secondary)" }}>₹{ss.base.toLocaleString()}</td>
                                                <td className="text-right font-mono" style={{ color: "var(--status-partial)", fontWeight: 700 }}>₹{ss.allowances.toLocaleString()}</td>
                                                <td className="text-right font-mono" style={{ fontWeight: 900, color: "var(--text-primary)", fontSize: "1.0625rem" }}>₹{(ss.base + ss.allowances).toLocaleString()}</td>
                                                <td style={{ paddingRight: "24px" }}>
                                                    {!ss.effectiveTo ? (
                                                        <span style={{
                                                            background: "var(--status-paid-bg)",
                                                            color: "var(--status-paid)",
                                                            fontWeight: 900,
                                                            fontSize: "0.625rem",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.06em",
                                                            padding: "4px 12px",
                                                            borderRadius: "100px",
                                                            border: "1px solid rgba(16, 185, 129, 0.2)"
                                                        }}>ACTIVE</span>
                                                    ) : (
                                                        <span style={{
                                                            background: "var(--bg-secondary)",
                                                            color: "var(--text-tertiary)",
                                                            fontWeight: 800,
                                                            fontSize: "0.625rem",
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.04em",
                                                            padding: "4px 12px",
                                                            borderRadius: "100px",
                                                            border: "1px solid var(--border-default)"
                                                        }}>ARCHIVED</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Payroll Tab */}
            {activeTab === "payroll" && (
                <div className="section-card" style={{ background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="section-header" style={{ padding: "24px", borderBottom: "1px solid var(--border-default)" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Disbursement Timeline</h3>
                    </div>
                    <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr style={{ background: "var(--bg-secondary)" }}>
                                    <th style={{ paddingLeft: "24px" }}>Settlement Cycle</th>
                                    <th className="text-right">Gross Pay</th>
                                    <th className="text-right">Adjustments</th>
                                    <th className="text-right">Net Value</th>
                                    <th className="text-right">Actual Paid</th>
                                    <th style={{ paddingRight: "24px" }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.payrollEntries?.length === 0 ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                                <p style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)" }}>Zero disbursement history</p>
                                                <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>No payroll cycles have been finalized for this personnel.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    staff.payrollEntries?.map((pe: any) => {
                                        const isFullyPaid = pe.pendingBalance <= 0;
                                        const isPartial = pe.paidAmount > 0 && pe.pendingBalance > 0;

                                        return (
                                            <tr key={pe.id}>
                                                <td style={{ paddingLeft: "24px", fontWeight: 800, color: "var(--text-primary)" }}>
                                                    {new Date(pe.year, pe.month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase()}
                                                </td>
                                                <td className="text-right font-mono" style={{ fontWeight: 700, color: "var(--text-secondary)" }}>₹{pe.grossSalary.toLocaleString()}</td>
                                                <td className="text-right font-mono" style={{ color: "var(--status-overdue)", fontWeight: 700 }}>−₹{pe.deductions.toLocaleString()}</td>
                                                <td className="text-right font-mono" style={{ fontWeight: 900, color: "var(--text-primary)", fontSize: "1.0625rem" }}>₹{pe.netPayable.toLocaleString()}</td>
                                                <td className="text-right font-mono" style={{ color: "var(--status-paid)", fontWeight: 900 }}>₹{pe.paidAmount.toLocaleString()}</td>
                                                <td style={{ paddingRight: "24px" }}>
                                                    <span style={{
                                                        background: isFullyPaid ? "var(--status-paid-bg)" : isPartial ? "var(--status-partial-bg)" : "var(--status-pending-bg)",
                                                        color: isFullyPaid ? "var(--status-paid)" : isPartial ? "var(--status-partial)" : "var(--text-tertiary)",
                                                        fontWeight: 900,
                                                        fontSize: "0.625rem",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.06em",
                                                        padding: "4px 14px",
                                                        borderRadius: "100px",
                                                        border: isFullyPaid ? "1px solid rgba(16, 185, 129, 0.2)" : isPartial ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid var(--border-default)"
                                                    }}>
                                                        {isFullyPaid ? "Cleared" : isPartial ? "Partial" : "Arrears"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
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
        <div style={{ maxWidth: "800px" }}>
            <h4 style={{ marginBottom: "var(--space-xl)", fontWeight: 800, fontSize: "1.25rem" }}>Executive Compensation Definition</h4>
            {serverError && (
                <div style={{ padding: "16px 20px", background: "rgba(239, 68, 68, 0.04)", color: "var(--status-overdue)", borderRadius: "12px", fontSize: "0.875rem", fontWeight: 700, border: "1px solid rgba(239, 68, 68, 0.1)", marginBottom: "var(--space-xl)" }}>
                    {serverError}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("staffId")} />
                <div className="form-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "var(--space-lg) var(--space-xl)" }}>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700 }}>Base Remuneration (INR)</label>
                        <input type="number" step="0.01" className="form-input" {...register("base")} style={{ height: "48px", borderRadius: "10px", fontSize: "1rem", fontWeight: 700 }} />
                        {errors.base && <span className="form-error">{errors.base.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700 }}>Benefit Allowances (INR)</label>
                        <input type="number" step="0.01" className="form-input" {...register("allowances")} style={{ height: "48px", borderRadius: "10px", fontSize: "1rem", fontWeight: 700 }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700 }}>Commencement Date</label>
                        <input type="date" className="form-input" {...register("effectiveFrom")} style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                        {errors.effectiveFrom && <span className="form-error">{errors.effectiveFrom.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 700 }}>Termination Date (Optional)</label>
                        <input type="date" className="form-input" {...register("effectiveTo")} style={{ height: "48px", borderRadius: "10px", fontWeight: 600 }} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-2xl)", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ height: "48px", padding: "0 32px", borderRadius: "10px", fontWeight: 800 }}>
                        {isSubmitting ? "Authorizing..." : "Commit Structure"}
                    </button>
                </div>
            </form>
        </div>
    );
}

