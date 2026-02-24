import Link from "next/link";
import { getStudents } from "@/actions/students";
import { getCourses } from "@/actions/courses";
import { getBatches } from "@/actions/batches";
import { Plus, Users } from "lucide-react";

import StudentsFilter from "./StudentsFilter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StudentRow = any;

export default async function StudentsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; courseId?: string; batchId?: string; page?: string }>;
}) {
    const params = await searchParams;
    const [studentsResult, coursesResult, batchesResult] = await Promise.all([
        getStudents({
            search: params.search,
            courseId: params.courseId,
            batchId: params.batchId,
            page: params.page ? parseInt(params.page) : 1,
        }),
        getCourses(),
        getBatches(params.courseId),
    ]);

    const data = studentsResult.data as { students: StudentRow[]; total: number; page: number; totalPages: number } | undefined;
    const students = data?.students || [];
    const totalPages = data?.totalPages || 1;
    const currentPage = data?.page || 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courses = (coursesResult.data as any[]) || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const batches = (batchesResult.data as any[]) || [];

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>Student Directory</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1rem" }}>
                        Comprehensive record of institutional enrollment and academic profiles
                    </p>
                </div>
                <Link href="/students/new" className="btn btn-primary" style={{
                    height: "48px",
                    padding: "0 28px",
                    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.15)",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "0.9375rem"
                }}>
                    <Plus size={18} strokeWidth={3} />
                    New Registration
                </Link>
            </div>

            <div className="section-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)" }}>
                <div className="section-header" style={{ padding: "20px 24px", background: "transparent", borderBottom: "1px solid var(--border-default)" }}>
                    <StudentsFilter courses={courses} batches={batches} />
                </div>
                <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0, overflow: "visible" }}>
                    <table className="data-table">
                        <thead>
                            <tr style={{ background: "var(--bg-secondary)" }}>
                                <th style={{ paddingLeft: "24px" }}>Registry ID</th>
                                <th>Student Identity</th>
                                <th>Academic Path</th>
                                <th>Batch</th>
                                <th>Contact Information</th>
                                <th>Registration</th>
                                <th style={{ textAlign: "right", paddingRight: "24px" }}>Interface</th>
                            </tr>
                        </thead>
                        <tbody style={{ background: "#ffffff" }}>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state" style={{ padding: "var(--space-3xl)" }}>
                                            <div style={{
                                                width: "64px",
                                                height: "64px",
                                                background: "var(--bg-secondary)",
                                                borderRadius: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "var(--text-tertiary)",
                                                marginBottom: "var(--space-lg)",
                                                border: "1px solid var(--border-default)"
                                            }}>
                                                <Users size={32} />
                                            </div>
                                            <p style={{ fontWeight: 800, fontSize: "1.125rem", color: "var(--text-primary)" }}>No match found</p>
                                            <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px" }}>
                                                Adjust your filters or initiate a new student registration.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student: StudentRow) => (
                                    <tr key={student.id}>
                                        <td style={{ paddingLeft: "24px" }}>
                                            <span className="font-mono" style={{
                                                color: "var(--accent-primary)",
                                                fontWeight: 800,
                                                fontSize: "0.75rem",
                                                background: "rgba(37, 99, 235, 0.04)",
                                                padding: "4px 10px",
                                                borderRadius: "8px",
                                                border: "1px solid rgba(37, 99, 235, 0.08)"
                                            }}>
                                                {student.studentCode}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "0.9375rem" }}>
                                                {student.firstName} {student.lastName}
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 600, marginTop: "2px" }}>
                                                Official Enrollee
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.875rem" }}>{student.course?.name}</div>
                                        </td>
                                        <td>
                                            <div style={{
                                                fontWeight: 800,
                                                fontSize: "0.6875rem",
                                                color: "var(--text-primary)",
                                                background: "var(--bg-secondary)",
                                                padding: "4px 12px",
                                                borderRadius: "100px",
                                                display: "inline-block",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.025em",
                                                border: "1px solid var(--border-default)"
                                            }}>
                                                {student.batch?.name}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, color: "var(--text-secondary)", fontSize: "0.875rem" }}>{student.primaryPhone}</div>
                                        </td>
                                        <td style={{ color: "var(--text-tertiary)", fontWeight: 600, fontSize: "0.8125rem" }}>
                                            {new Date(student.enrollmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </td>
                                        <td style={{ textAlign: "right", paddingRight: "24px" }}>
                                            <Link href={`/students/${student.id}`} className="btn btn-secondary btn-sm" style={{
                                                height: "36px",
                                                padding: "0 18px",
                                                fontWeight: 800,
                                                borderRadius: "10px",
                                                background: "var(--bg-secondary)",
                                                border: "1px solid var(--border-default)",
                                                fontSize: "0.8125rem"
                                            }}>
                                                Profile
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Interface */}
            {totalPages > 1 && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: "var(--space-2xl)",
                    padding: "8px",
                    background: "var(--bg-secondary)",
                    borderRadius: "18px",
                    width: "fit-content",
                    margin: "var(--space-2xl) auto 0",
                    border: "1px solid var(--border-default)"
                }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Link
                            key={i + 1}
                            href={`/students?page=${i + 1}${params.search ? `&search=${params.search}` : ""}${params.courseId ? `&courseId=${params.courseId}` : ""}${params.batchId ? `&batchId=${params.batchId}` : ""}`}
                            className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-secondary"}`}
                            style={{
                                width: "42px",
                                height: "42px",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "12px",
                                fontWeight: 900,
                                fontSize: "0.9375rem",
                                boxShadow: currentPage === i + 1 ? "0 6px 15px rgba(37, 99, 235, 0.2)" : "none",
                                background: currentPage === i + 1 ? "var(--accent-primary)" : "transparent",
                                color: currentPage === i + 1 ? "#ffffff" : "var(--text-secondary)",
                                border: currentPage === i + 1 ? "none" : "1px solid transparent"
                            }}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

