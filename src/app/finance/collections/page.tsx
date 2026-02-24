import { getCollectionsReport } from "@/actions/finance";
import { getCourses } from "@/actions/courses";
import CollectionsFilter from "./CollectionsFilter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PaymentEntry = any;

export default async function CollectionsPage({
    searchParams,
}: {
    searchParams: Promise<{ startDate?: string; endDate?: string; courseId?: string }>;
}) {
    const params = await searchParams;
    const [collectionsResult, coursesResult] = await Promise.all([
        getCollectionsReport({
            startDate: params.startDate,
            endDate: params.endDate,
            courseId: params.courseId,
        }),
        getCourses(),
    ]);

    const data = collectionsResult.data as { entries: PaymentEntry[]; totalCollected: number } | undefined;
    const entries = data?.entries || [];
    const totalCollected = data?.totalCollected || 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const courses = (coursesResult.data as any[]) || [];

    return (
        <div>
            <div className="page-header">
                <h1>Collections</h1>
                <div className="stat-tile" style={{ padding: "var(--space-md) var(--space-lg)", minWidth: 180 }}>
                    <span className="stat-label">Total Collected</span>
                    <span className="stat-value" style={{ fontSize: "1.25rem", color: "var(--status-paid)" }}>
                        ₹{totalCollected.toLocaleString()}
                    </span>
                </div>
            </div>

            <CollectionsFilter courses={courses} />

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student</th>
                            <th>Code</th>
                            <th>Course</th>
                            <th className="text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length === 0 ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className="empty-state"><p>No collections found for this period</p></div>
                                </td>
                            </tr>
                        ) : (
                            entries.map((entry: PaymentEntry) => {
                                const meta = entry.meta ? JSON.parse(entry.meta) : {};
                                return (
                                    <tr key={entry.id}>
                                        <td className="text-muted">{new Date(entry.createdAt).toLocaleDateString()}</td>
                                        <td style={{ fontWeight: 500 }}>
                                            {entry.student?.firstName} {entry.student?.lastName}
                                        </td>
                                        <td className="font-mono text-muted">{entry.student?.studentCode}</td>
                                        <td>{entry.student?.course?.name}</td>
                                        <td className="text-right font-mono" style={{ fontWeight: 600 }}>
                                            ₹{entry.amount.toLocaleString()}
                                            {meta.paymentMode && (
                                                <span className="text-muted text-sm" style={{ marginLeft: 8 }}>
                                                    {meta.paymentMode}
                                                </span>
                                            )}
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
