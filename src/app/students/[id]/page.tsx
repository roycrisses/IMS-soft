import { getStudent } from "@/actions/students";
import { getStudentFinancialSummary } from "@/actions/students";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StudentDetailTabs from "./StudentDetailTabs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StudentData = any;

export default async function StudentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [studentResult, financialResult] = await Promise.all([
        getStudent(id),
        getStudentFinancialSummary(id),
    ]);

    if (!studentResult.success) notFound();

    const student = studentResult.data as StudentData;
    const financial = financialResult.data as {
        totalCharged: number;
        totalDiscount: number;
        totalPaid: number;
        netPayable: number;
        balanceDue: number;
    } | undefined;

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <Link href="/students" className="btn btn-secondary" style={{
                        width: "48px",
                        height: "48px",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "14px",
                        background: "#ffffff",
                        border: "1px solid var(--border-default)",
                        boxShadow: "var(--shadow-sm)"
                    }}>
                        <ArrowLeft size={20} strokeWidth={2.5} />
                    </Link>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>
                                {student.firstName} {student.lastName}
                            </h1>
                            <span style={{
                                background: "rgba(37, 99, 235, 0.04)",
                                padding: "6px 16px",
                                borderRadius: "100px",
                                fontSize: "0.8125rem",
                                fontWeight: 900,
                                border: "1px solid rgba(37, 99, 235, 0.1)",
                                color: "var(--accent-primary)",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase"
                            }}>
                                {student.studentCode}
                            </span>
                        </div>
                        <p style={{ color: "var(--text-tertiary)", fontWeight: 600, marginTop: "4px", fontSize: "1.0625rem" }}>
                            {student.course?.name} <span style={{ opacity: 0.3, margin: "0 8px" }}>•</span> {student.batch?.name}
                        </p>
                    </div>
                </div>
            </div>

            {financial && (
                <div className="card-grid" style={{ marginBottom: "40px", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
                    <div className="stat-tile" style={{ padding: "24px", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", borderRadius: "20px" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "12px", display: "block" }}>Academic Commitment</span>
                        <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>₹{financial.totalCharged.toLocaleString()}</span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Ledger Charges</div>
                    </div>
                    <div className="stat-tile" style={{ padding: "24px", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", borderRadius: "20px" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "12px", display: "block" }}>Scholarship Relief</span>
                        <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--status-partial)", letterSpacing: "-0.02em" }}>₹{financial.totalDiscount.toLocaleString()}</span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Approved Fee Waivers</div>
                    </div>
                    <div className="stat-tile" style={{ padding: "24px", background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", borderRadius: "20px" }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "12px", display: "block" }}>Realized Revenue</span>
                        <span style={{ fontSize: "1.75rem", fontWeight: 900, color: "var(--status-paid)", letterSpacing: "-0.02em" }}>₹{financial.totalPaid.toLocaleString()}</span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Verified Collections</div>
                    </div>
                    <div className="stat-tile" style={{
                        padding: "24px",
                        background: financial.balanceDue > 0 ? "rgba(239, 68, 68, 0.02)" : "rgba(16, 185, 129, 0.02)",
                        border: financial.balanceDue > 0 ? "1px solid rgba(239, 68, 68, 0.15)" : "1px solid rgba(16, 185, 129, 0.15)",
                        boxShadow: "var(--shadow-sm)",
                        borderRadius: "20px"
                    }}>
                        <span style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: "12px", display: "block" }}>Arrears Balance</span>
                        <span style={{
                            fontSize: "1.75rem",
                            fontWeight: 900,
                            color: financial.balanceDue > 0 ? "var(--status-overdue)" : "var(--status-paid)",
                            letterSpacing: "-0.02em"
                        }}>
                            ₹{financial.balanceDue.toLocaleString()}
                        </span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Outstanding Liability</div>
                    </div>
                </div>
            )}

            <StudentDetailTabs student={student} />
        </div>

    );
}
