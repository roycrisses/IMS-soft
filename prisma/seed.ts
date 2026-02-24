import "dotenv/config";
import { prisma } from "../src/lib/db";

async function main() {
    console.log("Seeding database...");

    // Courses
    const fullStack = await prisma.course.upsert({
        where: { code: "FS-JS" },
        update: {},
        create: {
            name: "Full Stack JavaScript",
            code: "FS-JS",
            defaultTotalFee: 50000,
            description: "Next.js, React, Node.js and PostgreSQL",
        },
    });

    const uiux = await prisma.course.upsert({
        where: { code: "UIUX" },
        update: {},
        create: {
            name: "UI/UX Design",
            code: "UIUX",
            defaultTotalFee: 35000,
            description: "Product design with Figma",
        },
    });

    // Batches
    const batch1 = await prisma.batch.create({
        data: {
            name: "Standard Batch A",
            courseId: fullStack.id,
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-06-30"),
            academicYear: "2025",
        },
    });

    // Students
    const s1 = await prisma.student.create({
        data: {
            studentCode: "2025001",
            firstName: "John",
            lastName: "Doe",
            courseId: fullStack.id,
            batchId: batch1.id,
            primaryParentName: "Robert Doe",
            primaryPhone: "9876543210",
            address: "123 Main St, Springfield",
            enrollmentDate: new Date(),
        },
    });

    // Fee Plan
    const plan1 = await prisma.studentFeePlan.create({
        data: {
            studentId: s1.id,
            totalFee: 50000,
            discount: 5000,
            netPayable: 45000,
        },
    });

    // Ledger
    await prisma.studentFeeLedgerEntry.createMany({
        data: [
            {
                studentId: s1.id,
                feePlanId: plan1.id,
                type: "CHARGE",
                amount: 50000,
                meta: JSON.stringify({ note: "Tuition Fee" }),
            },
            {
                studentId: s1.id,
                feePlanId: plan1.id,
                type: "DISCOUNT",
                amount: 5000,
                meta: JSON.stringify({ note: "Early Bird Discount" }),
            },
            {
                studentId: s1.id,
                feePlanId: plan1.id,
                type: "PAYMENT",
                amount: 15000,
                meta: JSON.stringify({ paymentMode: "ONLINE", note: "Installment 1" }),
            },
        ],
    });

    // Staff
    const t1 = await prisma.staff.create({
        data: {
            firstName: "Jane",
            lastName: "Smith",
            role: "Lead Instructor",
            joinDate: new Date("2024-12-01"),
            email: "jane.smith@institute.com",
            phone: "9123456780",
        },
    });

    // Salary
    await prisma.salaryStructure.create({
        data: {
            staffId: t1.id,
            base: 60000,
            allowances: 10000,
            effectiveFrom: new Date("2024-12-01"),
        },
    });

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
