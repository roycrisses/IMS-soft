## 2026-02-24 - [Database Aggregation Anti-pattern]
**Learning:** Found a recurring anti-pattern where the application fetches all records from a table (e.g., `StudentFeeLedgerEntry`) into memory just to calculate sums. This leads to O(N) memory usage and massive network overhead, which eventually causes performance degradation or crashes as the database grows.
**Action:** Always prefer Prisma's `aggregate` or `groupBy` for calculating totals, averages, or counts. This offloads the work to the database engine (O(1) memory for the app) and significantly reduces the payload size.

## 2026-02-24 - [Aggregation Field Mapping]
**Learning:** When using Prisma's `_sum` or `aggregate`, the result object structure follows the field name exactly. It's easy to copy-paste patterns and forget to update the field access (e.g., using `._sum.amount` instead of `._sum.pendingBalance`).
**Action:** Double-check that the field accessed in the result matches the field specified in the `_sum` or `aggregate` block.
