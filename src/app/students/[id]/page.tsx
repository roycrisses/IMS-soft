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
        <div>
            <div className="page-header">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <Link href="/students" className="btn btn-ghost btn-sm">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1>{student.firstName} {student.lastName}</h1>
                        <div className="text-muted text-sm" style={{ marginTop: 2 }}>
                            {student.studentCode} · {student.course?.name} · {student.batch?.name}
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Summary Cards */}
            {financial && (
                <div className="card-grid" style={{ marginBottom: "var(--space-xl)" }}>
                    <div className="stat-tile">
                        <span className="stat-label">Total Fee</span>
                        <span className="stat-value">₹{financial.totalCharged.toLocaleString()}</span>
                    </div>
                    <div className="stat-tile">
                        <span className="stat-label">Discount</span>
                        <span className="stat-value">₹{financial.totalDiscount.toLocaleString()}</span>
                    </div>
                    <div className="stat-tile">
                        <span className="stat-label">Total Paid</span>
                        <span className="stat-value" style={{ color: "var(--status-paid)" }}>₹{financial.totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="stat-tile">
                        <span className="stat-label">Balance Due</span>
                        <span className="stat-value" style={{ color: financial.balanceDue > 0 ? "var(--status-overdue)" : "var(--status-paid)" }}>
                            ₹{financial.balanceDue.toLocaleString()}
                        </span>
                    </div>
                </div>
            )}

            <StudentDetailTabs student={student} />
        </div>
    );
}
