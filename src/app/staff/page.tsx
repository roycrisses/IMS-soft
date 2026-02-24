import Link from "next/link";
import { getStaffList } from "@/actions/staff";
import { Plus } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StaffMember = any;

export default async function StaffPage() {
    const result = await getStaffList();
    const staff = (result.data as StaffMember[]) || [];

    return (
        <div>
            <div className="page-header">
                <h1>Staff & Payroll</h1>
                <Link href="/staff/new" className="btn btn-primary">
                    <Plus size={16} />
                    Add Staff
                </Link>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Join Date</th>
                            <th>Current Salary</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.length === 0 ? (
                            <tr>
                                <td colSpan={8}>
                                    <div className="empty-state"><p>No staff members yet</p></div>
                                </td>
                            </tr>
                        ) : (
                            staff.map((s: StaffMember) => {
                                const currentSalary = s.salaryStructures?.[0];
                                const totalSalary = currentSalary ? currentSalary.base + currentSalary.allowances : 0;
                                return (
                                    <tr key={s.id}>
                                        <td style={{ fontWeight: 500 }}>{s.firstName} {s.lastName}</td>
                                        <td>{s.role}</td>
                                        <td className="text-muted">{s.email || "—"}</td>
                                        <td className="text-muted">{s.phone || "—"}</td>
                                        <td className="text-muted">{new Date(s.joinDate).toLocaleDateString()}</td>
                                        <td className="font-mono">
                                            {currentSalary ? `₹${totalSalary.toLocaleString()}` : "Not set"}
                                        </td>
                                        <td>
                                            <span className={`status-pill ${s.isActive ? "active" : "inactive"}`}>
                                                {s.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <Link href={`/staff/${s.id}`} className="btn btn-ghost btn-sm">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
