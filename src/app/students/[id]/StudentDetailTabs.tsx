"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recordPaymentSchema, type RecordPaymentInput } from "@/lib/validators/fee";
import { recordPayment } from "@/actions/finance";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StudentData = any;

export default function StudentDetailTabs({ student }: { student: StudentData }) {
    const [activeTab, setActiveTab] = useState<"profile" | "financials" | "attendance">("profile");
    const [showPayment, setShowPayment] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [paymentResult, setPaymentResult] = useState<any>(null);
    const router = useRouter();

    const tabs = [
        { id: "profile" as const, label: "Profile" },
        { id: "financials" as const, label: "Financials" },
        { id: "attendance" as const, label: "Attendance" },
    ];

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
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: "10px 28px",
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
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Biographical Information</h3>
                    </div>
                    <div className="form-grid" style={{ gap: "var(--space-xl) var(--space-2xl)" }}>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Legal Identity</div>
                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{student.firstName} {student.lastName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Institutional Identifier</div>
                            <div style={{ fontWeight: 800, color: "var(--accent-primary)", fontSize: "1.0625rem" }} className="font-mono">{student.studentCode}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Academic Program</div>
                            <div style={{ fontWeight: 700, color: "var(--text-secondary)", fontSize: "1.0625rem" }}>{student.course?.name}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Academic Cohort</div>
                            <div style={{ fontWeight: 700, color: "var(--text-secondary)", fontSize: "1.0625rem" }}>{student.batch?.name}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Primary Legal Guardian</div>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{student.primaryParentName}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Secondary Legal Guardian</div>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{student.secondaryParentName || <span style={{ color: "var(--text-tertiary)", fontWeight: 500 }}>Not Specified</span>}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Primary Communication</div>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{student.primaryPhone}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Alternative Communication</div>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{student.secondaryPhone || <span style={{ color: "var(--text-tertiary)", fontWeight: 500 }}>Not Specified</span>}</div>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Residential Domicile</div>
                            <div style={{ fontWeight: 600, color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "1.0625rem" }}>{student.address || "—"}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: "0.6875rem", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Matriculation Date</div>
                            <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.0625rem" }}>{new Date(student.enrollmentDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                        </div>
                    </div>
                </div>
            )}


            {/* Financials Tab */}
            {activeTab === "financials" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
                    {/* Payment Form Expansion */}
                    {showPayment && student.feePlans?.[0] && (
                        <div className="section-card" style={{ padding: "var(--space-2xl)", background: "var(--bg-secondary)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                            <PaymentForm
                                studentId={student.id}
                                feePlanId={student.feePlans[0].id}
                                onSuccess={(result) => {
                                    setPaymentResult(result);
                                    setShowPayment(false);
                                    router.refresh();
                                }}
                            />
                        </div>
                    )}

                    {/* Notification Message */}
                    {paymentResult?.whatsappPayload && (
                        <div style={{
                            padding: "24px",
                            background: "rgba(16, 185, 129, 0.04)",
                            border: "1px solid rgba(16, 185, 129, 0.15)",
                            borderRadius: "16px",
                            boxShadow: "var(--shadow-sm)"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
                                <h4 style={{ color: "var(--status-paid)", fontWeight: 800, fontSize: "1.125rem" }}>Documented Transaction Receipt</h4>
                                <button className="btn btn-secondary btn-sm" onClick={() => setPaymentResult(null)} style={{ fontWeight: 800, padding: "0 20px", borderRadius: "10px" }}>Acknowledge</button>
                            </div>
                            <pre style={{ fontSize: "0.8125rem", whiteSpace: "pre-wrap", color: "var(--text-secondary)", fontFamily: "monospace", background: "white", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-default)", lineHeight: 1.6 }}>
                                {JSON.stringify(paymentResult.whatsappPayload, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="section-card" style={{ background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                        <div className="section-header" style={{ padding: "24px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-default)" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Financial Transaction Ledger</h3>
                            {student.feePlans?.length > 0 && (
                                <button
                                    className={`btn ${showPayment ? "btn-secondary" : "btn-primary"}`}
                                    onClick={() => setShowPayment(!showPayment)}
                                    style={{
                                        height: "44px",
                                        padding: "0 24px",
                                        fontWeight: 800,
                                        borderRadius: "12px",
                                        boxShadow: showPayment ? "none" : "0 6px 12px rgba(37, 99, 235, 0.15)",
                                        fontSize: "0.875rem"
                                    }}
                                >
                                    {showPayment ? "Dismiss Allocation" : "Initiate Collection"}
                                </button>
                            )}
                        </div>
                        <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th style={{ paddingLeft: "24px" }}>Settlement Date</th>
                                        <th>Classification</th>
                                        <th className="text-right">Monetary Value</th>
                                        <th style={{ paddingRight: "24px" }}>Administrative Summary</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!student.feeLedger || student.feeLedger.length === 0 ? (
                                        <tr>
                                            <td colSpan={4}>
                                                <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                                    <p style={{ fontWeight: 700, color: "var(--text-tertiary)" }}>No financial activity records identified</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        student.feeLedger.map((entry: any) => {
                                            const meta = entry.meta ? JSON.parse(entry.meta) : {};
                                            const isPayment = entry.type === "PAYMENT";
                                            const isCharge = entry.type === "CHARGE";
                                            const isDiscount = entry.type === "DISCOUNT";

                                            return (
                                                <tr key={entry.id}>
                                                    <td style={{ paddingLeft: "24px", color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.875rem" }}>
                                                        {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </td>
                                                    <td>
                                                        <span style={{
                                                            background: isPayment ? "var(--status-paid-bg)" : isCharge ? "var(--status-overdue-bg)" : isDiscount ? "var(--status-partial-bg)" : "var(--status-pending-bg)",
                                                            color: isPayment ? "var(--status-paid)" : isCharge ? "var(--status-overdue)" : isDiscount ? "var(--status-partial)" : "var(--text-tertiary)",
                                                            fontWeight: 900,
                                                            fontSize: "0.625rem",
                                                            textTransform: "uppercase",
                                                            padding: "4px 12px",
                                                            borderRadius: "100px",
                                                            letterSpacing: "0.06em",
                                                            border: "1px solid currentColor",
                                                            opacity: 0.9
                                                        }}>
                                                            {entry.type}
                                                        </span>
                                                    </td>
                                                    <td className="text-right font-mono" style={{
                                                        fontWeight: 900,
                                                        fontSize: "1rem",
                                                        color: isCharge ? "var(--text-primary)" : isPayment ? "var(--status-paid)" : "var(--status-partial)",
                                                        letterSpacing: "-0.02em"
                                                    }}>
                                                        {isPayment || isDiscount ? "−" : "+"}₹{entry.amount.toLocaleString()}
                                                    </td>
                                                    <td style={{ paddingRight: "24px", color: "var(--text-tertiary)", fontWeight: 600, fontSize: "0.875rem" }}>
                                                        {meta.description || meta.paymentMode || "Standard Record Entry"}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
                <div className="section-card" style={{ background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                    <div className="section-header" style={{ padding: "24px", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-default)" }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Attendance Operational Logs</h3>
                    </div>
                    <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th style={{ paddingLeft: "24px" }}>Calendar Date</th>
                                    <th>Presence Status</th>
                                    <th style={{ paddingRight: "24px" }}>Validator Identity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!student.attendance || student.attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan={3}>
                                            <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                                <p style={{ fontWeight: 700, color: "var(--text-tertiary)" }}>No operational attendance logs discovered</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    student.attendance.map((record: any) => (
                                        <tr key={record.id}>
                                            <td style={{ paddingLeft: "24px", fontWeight: 800, color: "var(--text-primary)", fontSize: "0.9375rem" }}>
                                                {new Date(record.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td>
                                                <span style={{
                                                    background: record.status === "PRESENT" ? "var(--status-paid-bg)" : record.status === "ABSENT" ? "var(--status-overdue-bg)" : "var(--status-partial-bg)",
                                                    color: record.status === "PRESENT" ? "var(--status-paid)" : record.status === "ABSENT" ? "var(--status-overdue)" : "var(--status-partial)",
                                                    fontWeight: 900,
                                                    fontSize: "0.6875rem",
                                                    textTransform: "uppercase",
                                                    padding: "5px 16px",
                                                    borderRadius: "100px",
                                                    letterSpacing: "0.04em"
                                                }}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td style={{ paddingRight: "24px", color: "var(--text-tertiary)", fontWeight: 700, fontSize: "0.875rem" }}>{record.markedBy || "System Automator"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}

function PaymentForm({
    studentId,
    feePlanId,
    onSuccess,
}: {
    studentId: string;
    feePlanId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (result: any) => void;
}) {
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RecordPaymentInput>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(recordPaymentSchema) as any,
        defaultValues: { studentId, feePlanId, paymentMode: "CASH" },
    });

    const onSubmit = async (data: RecordPaymentInput) => {
        setServerError("");
        const result = await recordPayment(data);
        if (result.success) {
            onSuccess(result.data);
        } else {
            setServerError(result.error || "Failed to record payment.");
        }
    };

    return (
        <div style={{ maxWidth: "600px" }}>
            <h4 style={{ marginBottom: "var(--space-xl)", fontSize: "1.125rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "10px" }}>
                Accept Monetary Allocation
                <span style={{ fontSize: "0.75rem", background: "var(--accent-primary)", color: "white", padding: "2px 8px", borderRadius: "100px", fontWeight: 900 }}>Collection Portal</span>
            </h4>
            {serverError && (
                <div style={{ padding: "16px 20px", background: "rgba(239, 68, 68, 0.04)", color: "var(--status-overdue)", borderRadius: "12px", fontSize: "0.875rem", marginBottom: "var(--space-xl)", fontWeight: 700, border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                    {serverError}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("studentId")} />
                <input type="hidden" {...register("feePlanId")} />
                <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Amount (₹) *</label>
                        <input type="number" step="0.01" className={`form-input ${errors.amount ? "error" : ""}`} {...register("amount")} placeholder="0.00" style={{ height: "48px", borderRadius: "10px", fontWeight: 700, fontSize: "1.125rem" }} />
                        {errors.amount && <span className="form-error" style={{ fontWeight: 700 }}>{errors.amount.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Payment Instrument</label>
                        <select className="form-select" {...register("paymentMode")} style={{ height: "48px", borderRadius: "10px", fontWeight: 700 }}>
                            <option value="CASH">Liquid Cash</option>
                            <option value="BANK_TRANSFER">Institutional Bank Transfer</option>
                            <option value="UPI">Digital Wallet / UPI</option>
                            <option value="CHEQUE">Verification Cheque</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Internal Receipt Identifier</label>
                        <input className="form-input" {...register("receiptNo")} placeholder="Optional ID" style={{ height: "48px", borderRadius: "10px", fontWeight: 700 }} />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-tertiary)", marginBottom: "8px" }}>Administrative Annotation</label>
                        <input className="form-input" {...register("notes")} placeholder="Remarks..." style={{ height: "48px", borderRadius: "10px", fontWeight: 700 }} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-xl)", paddingTop: "var(--space-xl)", borderTop: "1px solid var(--border-default)" }}>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{
                        height: "48px",
                        padding: "0 32px",
                        borderRadius: "12px",
                        fontWeight: 800,
                        fontSize: "0.9375rem",
                        boxShadow: "0 10px 20px rgba(37, 99, 235, 0.15)"
                    }}>
                        {isSubmitting ? "Finalizing Transaction..." : "Settle Allocation"}
                    </button>
                </div>
            </form>
        </div>
    );
}

