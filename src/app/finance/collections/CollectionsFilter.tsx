"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    courses: { id: string; name: string }[];
}

export default function CollectionsFilter({ courses }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        router.push(`/finance/collections?${params.toString()}`);
    };

    return (
        <div className="filters-row">
            <div className="form-group">
                <label className="form-label">From</label>
                <input
                    type="date"
                    className="form-input"
                    value={searchParams.get("startDate") || ""}
                    onChange={(e) => updateParam("startDate", e.target.value)}
                    style={{ width: 160 }}
                />
            </div>
            <div className="form-group">
                <label className="form-label">To</label>
                <input
                    type="date"
                    className="form-input"
                    value={searchParams.get("endDate") || ""}
                    onChange={(e) => updateParam("endDate", e.target.value)}
                    style={{ width: 160 }}
                />
            </div>
            <div className="form-group">
                <label className="form-label">Course</label>
                <select
                    className="form-select"
                    value={searchParams.get("courseId") || ""}
                    onChange={(e) => updateParam("courseId", e.target.value)}
                    style={{ width: 180 }}
                >
                    <option value="">All Courses</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
