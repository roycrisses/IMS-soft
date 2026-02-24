import { getStaffMember } from "@/actions/staff";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StaffDetailClient from "./StaffDetailClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StaffData = any;

export default async function StaffDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getStaffMember(id);

    if (!result.success) notFound();

    const staff = result.data as StaffData;
    const currentSalary = staff.salaryStructures?.[0];
    const totalSalary = currentSalary ? currentSalary.base + currentSalary.allowances : 0;

    return (
        <div>
            <div className="page-header">
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                    <Link href="/staff" className="btn btn-ghost btn-sm">
                        <ArrowLeft size={16} />
                    </Link>
                    <div>
                        <h1>{staff.firstName} {staff.lastName}</h1>
                        <div className="text-muted text-sm" style={{ marginTop: 2 }}>
                            {staff.role} ·{" "}
                            <span className={`status-pill ${staff.isActive ? "active" : "inactive"}`}>
                                {staff.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="card-grid" style={{ marginBottom: "var(--space-xl)" }}>
                <div className="stat-tile">
                    <span className="stat-label">Current Salary</span>
                    <span className="stat-value">₹{totalSalary.toLocaleString()}</span>
                </div>
                <div className="stat-tile">
                    <span className="stat-label">Base</span>
                    <span className="stat-value">₹{currentSalary?.base?.toLocaleString() || 0}</span>
                </div>
                <div className="stat-tile">
                    <span className="stat-label">Allowances</span>
                    <span className="stat-value">₹{currentSalary?.allowances?.toLocaleString() || 0}</span>
                </div>
                <div className="stat-tile">
                    <span className="stat-label">Join Date</span>
                    <span className="stat-value" style={{ fontSize: "1.125rem" }}>{new Date(staff.joinDate).toLocaleDateString()}</span>
                </div>
            </div>

            <StaffDetailClient staff={staff} />
        </div>
    );
}
