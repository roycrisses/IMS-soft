"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
    courses: { id: string; name: string }[];
    batches: { id: string; name: string }[];
}

export default function StudentsFilter({ courses, batches }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");

    const updateParams = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("page");
            router.push(`/students?${params.toString()}`);
        },
        [router, searchParams]
    );

    const handleSearch = () => {
        updateParams("search", search);
    };

    return (
        <div className="filters-row">
            <div className="search-bar">
                <Search size={16} style={{ color: "var(--text-tertiary)" }} />
                <input
                    placeholder="Search by name, code, phone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
            </div>

            <select
                className="form-select"
                value={searchParams.get("courseId") || ""}
                onChange={(e) => updateParams("courseId", e.target.value)}
            >
                <option value="">All Courses</option>
                {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <select
                className="form-select"
                value={searchParams.get("batchId") || ""}
                onChange={(e) => updateParams("batchId", e.target.value)}
            >
                <option value="">All Batches</option>
                {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                ))}
            </select>
        </div>
    );
}
