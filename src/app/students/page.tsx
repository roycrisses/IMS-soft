import Link from "next/link";
import { getStudents } from "@/actions/students";
import { getCourses } from "@/actions/courses";
import { getBatches } from "@/actions/batches";
import { Plus } from "lucide-react";
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
        <div>
            <div className="page-header">
                <h1>Students</h1>
                <Link href="/students/new" className="btn btn-primary">
                    <Plus size={16} />
                    Add Student
                </Link>
            </div>

            <StudentsFilter courses={courses} batches={batches} />

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Batch</th>
                            <th>Contact</th>
                            <th>Enrolled</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan={7}>
                                    <div className="empty-state">
                                        <p>No students found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            students.map((student: StudentRow) => (
                                <tr key={student.id}>
                                    <td><span className="font-mono">{student.studentCode}</span></td>
                                    <td style={{ fontWeight: 500 }}>
                                        {student.firstName} {student.lastName}
                                    </td>
                                    <td>{student.course?.name}</td>
                                    <td>{student.batch?.name}</td>
                                    <td className="text-muted">{student.primaryPhone}</td>
                                    <td className="text-muted">
                                        {new Date(student.enrollmentDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <Link href={`/students/${student.id}`} className="btn btn-ghost btn-sm">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "var(--space-sm)",
                    marginTop: "var(--space-lg)",
                }}>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Link
                            key={i + 1}
                            href={`/students?page=${i + 1}${params.search ? `&search=${params.search}` : ""}${params.courseId ? `&courseId=${params.courseId}` : ""}${params.batchId ? `&batchId=${params.batchId}` : ""}`}
                            className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-secondary"}`}
                        >
                            {i + 1}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
