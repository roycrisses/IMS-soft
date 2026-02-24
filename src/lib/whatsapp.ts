/**
 * WhatsApp Payload Generation
 * 
 * Pure functions that build JSON payloads for WhatsApp Cloud API.
 * These do NOT send messages — they return structured data ready for a provider.
 */

export interface WhatsAppPayload {
    to: string;
    template: string;
    message: string;
    parameters: Record<string, string>;
}

export function buildFeePaymentWhatsAppPayload(
    studentName: string,
    parentName: string,
    parentContact: string,
    courseName: string,
    paymentAmount: number,
    balance: number
): WhatsAppPayload {
    const message = `Dear ${parentName}, we have received ₹${paymentAmount.toLocaleString()} for ${studentName}'s ${courseName} fee. Remaining balance: ₹${balance.toLocaleString()}. Thank you.`;

    return {
        to: parentContact,
        template: "fee_payment_confirmation",
        message,
        parameters: {
            parent_name: parentName,
            student_name: studentName,
            course_name: courseName,
            amount: paymentAmount.toLocaleString(),
            balance: balance.toLocaleString(),
        },
    };
}

export function buildAttendanceWhatsAppPayload(
    studentName: string,
    parentName: string,
    parentContact: string,
    date: string,
    status: string
): WhatsAppPayload {
    const statusText = status === "ABSENT" ? "was absent" : status === "LATE" ? "arrived late" : "was present";
    const message = `Dear ${parentName}, this is to inform you that ${studentName} ${statusText} on ${date}. Thank you.`;

    return {
        to: parentContact,
        template: "attendance_notification",
        message,
        parameters: {
            parent_name: parentName,
            student_name: studentName,
            date,
            status: statusText,
        },
    };
}
