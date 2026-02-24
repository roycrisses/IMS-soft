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
        <div>
            <div className="tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`tab ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div className="card">
                    <div className="form-grid">
                        <div>
                            <div className="text-muted text-sm">Full Name</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{student.firstName} {student.lastName}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Student Code</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }} className="font-mono">{student.studentCode}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Course</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{student.course?.name}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Batch</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{student.batch?.name}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Primary Parent</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{student.primaryParentName}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Secondary Parent</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{student.secondaryParentName || "—"}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Primary Phone</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{student.primaryPhone}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Secondary Phone</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{student.secondaryPhone || "—"}</div>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <div className="text-muted text-sm">Address</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{student.address || "—"}</div>
                        </div>
                        <div>
                            <div className="text-muted text-sm">Enrollment Date</div>
                            <div style={{ fontWeight: 500, marginTop: 2 }}>{new Date(student.enrollmentDate).toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Financials Tab */}
            {activeTab === "financials" && (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
                        <h3>Fee Ledger</h3>
                        {student.feePlans?.length > 0 && (
                            <button className="btn btn-primary btn-sm" onClick={() => setShowPayment(!showPayment)}>
                                Record Payment
                            </button>
                        )}
                    </div>

                    {/* Payment Form */}
                    {showPayment && student.feePlans?.[0] && (
                        <PaymentForm
                            studentId={student.id}
                            feePlanId={student.feePlans[0].id}
                            onSuccess={(result) => {
                                setPaymentResult(result);
                                setShowPayment(false);
                                router.refresh();
                            }}
                        />
                    )}

                    {/* WhatsApp Payload Display */}
                    {paymentResult?.whatsappPayload && (
                        <div className="card" style={{ marginBottom: "var(--space-lg)", background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                            <h4 style={{ marginBottom: "var(--space-sm)", color: "var(--status-paid)" }}>WhatsApp Notification Payload</h4>
                            <pre style={{ fontSize: "0.8125rem", whiteSpace: "pre-wrap", color: "var(--text-secondary)", fontFamily: "monospace" }}>
                                {JSON.stringify(paymentResult.whatsappPayload, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="data-table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th className="text-right">Amount</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {student.feeLedger?.length === 0 ? (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="empty-state"><p>No ledger entries yet. Create a fee plan first.</p></div>
                                        </td>
                                    </tr>
                                ) : (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    student.feeLedger?.map((entry: any) => {
                                        const meta = entry.meta ? JSON.parse(entry.meta) : {};
                                        return (
                                            <tr key={entry.id}>
                                                <td className="text-muted">{new Date(entry.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-pill ${entry.type === "PAYMENT" ? "paid" :
                                                        entry.type === "CHARGE" ? "overdue" :
                                                            entry.type === "DISCOUNT" ? "partial" : "pending"
                                                        }`}>
                                                        {entry.type}
                                                    </span>
                                                </td>
                                                <td className="text-right font-mono" style={{ fontWeight: 500 }}>
                                                    {entry.type === "PAYMENT" || entry.type === "DISCOUNT" ? "−" : "+"}₹{entry.amount.toLocaleString()}
                                                </td>
                                                <td className="text-muted text-sm">
                                                    {meta.description || meta.paymentMode || "—"}
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

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Marked By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student.attendance?.length === 0 ? (
                                <tr>
                                    <td colSpan={3}>
                                        <div className="empty-state"><p>No attendance records yet</p></div>
                                    </td>
                                </tr>
                            ) : (
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                student.attendance?.map((record: any) => (
                                    <tr key={record.id}>
                                        <td>{new Date(record.date).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-pill ${record.status === "PRESENT" ? "paid" :
                                                record.status === "ABSENT" ? "overdue" : "partial"
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="text-muted">{record.markedBy}</td>
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
        <div className="card" style={{ marginBottom: "var(--space-lg)" }}>
            <h4 style={{ marginBottom: "var(--space-md)" }}>Record Payment</h4>
            {serverError && (
                <div style={{ padding: "var(--space-sm)", background: "var(--status-overdue-bg)", color: "var(--status-overdue)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginBottom: "var(--space-md)" }}>
                    {serverError}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("studentId")} />
                <input type="hidden" {...register("feePlanId")} />
                <div className="form-grid">
                    <div className="form-group">
                        <label className="form-label">Amount *</label>
                        <input type="number" step="0.01" className={`form-input ${errors.amount ? "error" : ""}`} {...register("amount")} placeholder="0.00" />
                        {errors.amount && <span className="form-error">{errors.amount.message}</span>}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Payment Mode</label>
                        <select className="form-select" {...register("paymentMode")}>
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="UPI">UPI</option>
                            <option value="CHEQUE">Cheque</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Receipt No.</label>
                        <input className="form-input" {...register("receiptNo")} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Notes</label>
                        <input className="form-input" {...register("notes")} />
                    </div>
                </div>
                <div style={{ display: "flex", gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                        {isSubmitting ? "Recording..." : "Record Payment"}
                    </button>
                </div>
            </form>
        </div>
    );
}
