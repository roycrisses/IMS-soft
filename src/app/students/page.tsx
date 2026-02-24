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
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="page-header" style={{ marginBottom: "var(--space-2xl)" }}>
                <div>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>Student Directory</h1>
                    <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "4px", fontSize: "1.0625rem" }}>
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

            <div className="section-card" style={{ background: "#ffffff", border: "1px solid var(--border-default)", boxShadow: "var(--shadow-sm)", borderRadius: "20px", overflow: "hidden" }}>
                <div className="section-header" style={{ padding: "24px", background: "linear-gradient(to right, #ffffff, #fcfcfc)", borderBottom: "1px solid var(--border-default)" }}>
                    <StudentsFilter courses={courses} batches={batches} />
                </div>
                <div className="data-table-wrapper" style={{ border: "none", borderRadius: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr style={{ background: "#fcfcfc" }}>
                                <th style={{ paddingLeft: "24px", fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)" }}>Registry ID</th>
                                <th style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)" }}>Student Identity</th>
                                <th style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)" }}>Academic Path</th>
                                <th style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)" }}>Batch</th>
                                <th style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)" }}>Contact</th>
                                <th style={{ fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)" }}>Registration</th>
                                <th style={{ textAlign: "right", paddingRight: "24px", fontSize: "0.6875rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)" }}>Interface</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan={7}>
                                        <div className="empty-state" style={{ padding: "80px 24px" }}>
                                            <div style={{
                                                width: "64px",
                                                height: "64px",
                                                background: "var(--bg-secondary)",
                                                borderRadius: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "var(--text-tertiary)",
                                                marginBottom: "20px",
                                                border: "1px solid var(--border-default)"
                                            }}>
                                                <Users size={32} />
                                            </div>
                                            <p style={{ fontWeight: 900, fontSize: "1.25rem", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>No match found</p>
                                            <p style={{ color: "var(--text-tertiary)", fontWeight: 500, marginTop: "6px", fontSize: "1rem" }}>
                                                Adjust your filters or initiate a new student registration.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                students.map((student: StudentRow) => (
                                    <tr key={student.id} style={{ borderBottom: "1px solid var(--border-default)" }}>
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
                                            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 700, marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.02em" }}>
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
                                        <td style={{ color: "var(--text-tertiary)", fontWeight: 700, fontSize: "0.8125rem" }}>
                                            {new Date(student.enrollmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </td>
                                        <td style={{ textAlign: "right", paddingRight: "24px" }}>
                                            <Link href={`/students/${student.id}`} className="btn btn-secondary btn-sm" style={{
                                                height: "36px",
                                                padding: "0 18px",
                                                fontWeight: 800,
                                                borderRadius: "10px",
                                                background: "#ffffff",
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
                    gap: "8px",
                    marginTop: "40px",
                    padding: "8px",
                    background: "#ffffff",
                    borderRadius: "20px",
                    width: "fit-content",
                    margin: "40px auto 0",
                    border: "1px solid var(--border-default)",
                    boxShadow: "var(--shadow-sm)"
                }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Link
                            key={i + 1}
                            href={`/students?page=${i + 1}${params.search ? `&search=${params.search}` : ""}${params.courseId ? `&courseId=${params.courseId}` : ""}${params.batchId ? `&batchId=${params.batchId}` : ""}`}
                            className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-secondary"}`}
                            style={{
                                width: "40px",
                                height: "40px",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                fontWeight: 800,
                                fontSize: "0.875rem",
                                boxShadow: currentPage === i + 1 ? "0 4px 12px rgba(37, 99, 235, 0.2)" : "none",
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

