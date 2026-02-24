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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xl)" }}>
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
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>{student.firstName} {student.lastName}</h1>
                            <span style={{
                                background: "var(--bg-secondary)",
                                padding: "6px 14px",
                                borderRadius: "10px",
                                fontSize: "0.8125rem",
                                fontWeight: 800,
                                border: "1px solid var(--border-default)",
                                color: "var(--accent-primary)",
                                letterSpacing: "0.02em",
                                textTransform: "uppercase"
                            }}>
                                {student.studentCode}
                            </span>
                        </div>
                        <p style={{ color: "var(--text-tertiary)", fontWeight: 600, marginTop: "4px", fontSize: "1rem" }}>
                            {student.course?.name} <span style={{ opacity: 0.3, margin: "0 8px" }}>•</span> {student.batch?.name}
                        </p>
                    </div>
                </div>
            </div>

            {financial && (
                <div className="card-grid" style={{ marginBottom: "var(--space-2xl)", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-xl)" }}>
                    <div className="stat-tile" style={{ padding: "var(--space-xl)" }}>
                        <span className="stat-label" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.6875rem" }}>Academic Commitment</span>
                        <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 800 }}>₹{financial.totalCharged.toLocaleString()}</span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 500 }}>Total ledger charges</div>
                    </div>
                    <div className="stat-tile" style={{ padding: "var(--space-xl)" }}>
                        <span className="stat-label" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.6875rem" }}>Scholarship Relief</span>
                        <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--status-partial)" }}>₹{financial.totalDiscount.toLocaleString()}</span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 500 }}>Approved fee waivers</div>
                    </div>
                    <div className="stat-tile" style={{ padding: "var(--space-xl)" }}>
                        <span className="stat-label" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.6875rem" }}>Realized Revenue</span>
                        <span className="stat-value" style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--status-paid)" }}>₹{financial.totalPaid.toLocaleString()}</span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 500 }}>Verified collections</div>
                    </div>
                    <div className="stat-tile" style={{
                        padding: "var(--space-xl)",
                        background: financial.balanceDue > 0 ? "rgba(239, 68, 68, 0.02)" : "rgba(16, 185, 129, 0.02)",
                        border: financial.balanceDue > 0 ? "1px solid rgba(239, 68, 68, 0.1)" : "1px solid rgba(16, 185, 129, 0.1)"
                    }}>
                        <span className="stat-label" style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: "0.6875rem" }}>Arrears Balance</span>
                        <span className="stat-value" style={{
                            fontSize: "1.75rem",
                            fontWeight: 800,
                            color: financial.balanceDue > 0 ? "var(--status-overdue)" : "var(--status-paid)"
                        }}>
                            ₹{financial.balanceDue.toLocaleString()}
                        </span>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "6px", fontWeight: 500 }}>Outstanding liability</div>
                    </div>
                </div>
            )}


            <StudentDetailTabs student={student} />
        </div>

    );
}
