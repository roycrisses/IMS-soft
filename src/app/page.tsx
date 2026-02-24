import Link from "next/link";
import { getDashboardStats } from "@/actions/attendance";
import {
  GraduationCap,
  DollarSign,
  Users,
  CreditCard,
  AlertTriangle,
  UserPlus,
  FileText,
  ArrowRight,
} from "lucide-react";

export default async function Dashboard() {
  const result = await getDashboardStats();
  const stats = result.success ? (result.data as {
    totalStudents: number;
    totalStaff: number;
    outstandingFees: number;
    thisMonthCollections: number;
    pendingPayroll: number;
  }) : {
    totalStudents: 0,
    totalStaff: 0,
    outstandingFees: 0,
    thisMonthCollections: 0,
    pendingPayroll: 0,
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <div style={{ fontSize: "0.8125rem", color: "var(--text-tertiary)" }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stat Tiles */}
      <div className="card-grid" style={{ marginBottom: "var(--space-xl)" }}>
        <div className="stat-tile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="stat-label">Total Students</span>
            <GraduationCap size={18} style={{ color: "var(--text-tertiary)" }} />
          </div>
          <span className="stat-value">{stats.totalStudents}</span>
        </div>

        <div className="stat-tile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="stat-label">Outstanding Fees</span>
            <AlertTriangle size={18} style={{ color: "var(--status-overdue)" }} />
          </div>
          <span className="stat-value">₹{stats.outstandingFees.toLocaleString()}</span>
        </div>

        <div className="stat-tile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="stat-label">This Month&apos;s Collections</span>
            <CreditCard size={18} style={{ color: "var(--status-paid)" }} />
          </div>
          <span className="stat-value">₹{stats.thisMonthCollections.toLocaleString()}</span>
        </div>

        <div className="stat-tile">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="stat-label">Pending Payroll</span>
            <DollarSign size={18} style={{ color: "var(--status-partial)" }} />
          </div>
          <span className="stat-value">₹{stats.pendingPayroll.toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card" style={{ marginBottom: "var(--space-xl)" }}>
        <h3 style={{ marginBottom: "var(--space-lg)" }}>Quick Actions</h3>
        <div className="quick-links">
          <Link href="/students/new" className="quick-link">
            <UserPlus size={20} />
            Add New Student
            <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </Link>
          <Link href="/finance/collections" className="quick-link">
            <CreditCard size={20} />
            View Collections
            <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </Link>
          <Link href="/finance/dues" className="quick-link">
            <AlertTriangle size={20} />
            Check Fee Dues
            <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </Link>
          <Link href="/staff/new" className="quick-link">
            <Users size={20} />
            Add Staff Member
            <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </Link>
          <Link href="/payroll" className="quick-link">
            <FileText size={20} />
            Monthly Payroll
            <ArrowRight size={14} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </Link>
        </div>
      </div>

      {/* Active Staff */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-lg)" }}>
          <h3>Institute Overview</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-lg)" }}>
          <div style={{ padding: "var(--space-lg)", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
            <div className="text-muted text-sm" style={{ marginBottom: "var(--space-xs)" }}>Active Staff</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{stats.totalStaff}</div>
          </div>
          <div style={{ padding: "var(--space-lg)", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
            <div className="text-muted text-sm" style={{ marginBottom: "var(--space-xs)" }}>Total Students</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 600 }}>{stats.totalStudents}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
