import { UserModel } from "../models/User.js";
import { sendMail } from "../utils/mailer.js";
function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
function formatMessageBody(body) {
    const safeBody = escapeHtml(body).replace(/\r?\n/g, "<br />");
    const plainBody = body.replace(/\r?\n/g, "\n");
    return {
        html: `<p>${safeBody}</p>`,
        text: plainBody,
    };
}
export async function listStudentsForTeacher(req, res) {
    try {
        const students = await UserModel.find({ role: "student" })
            .select(["_id", "name", "email", "className"])
            .sort({ name: 1 });
        return res.json({
            students: students.map((student) => ({
                id: student._id.toString(),
                name: student.name,
                email: student.email,
                className: student.className ?? undefined,
            })),
        });
    }
    catch (error) {
        console.error("Failed to list students for teacher:", error);
        return res.status(500).json({ error: "Failed to load students." });
    }
}
export async function sendStudentEmail(req, res) {
    try {
        const { studentId, subject, message } = req.body;
        if (!studentId || !subject || !message) {
            return res.status(400).json({ error: "Student, subject, and message are required." });
        }
        const student = await UserModel.findById(studentId).select(["name", "email", "role"]);
        if (!student || student.role !== "student") {
            return res.status(404).json({ error: "Student not found." });
        }
        const teacherName = typeof req.user?.name === "string" && req.user.name.trim().length > 0
            ? req.user.name
            : "Your teacher";
        const { html, text } = formatMessageBody(message);
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Assalamualaikum ${escapeHtml(student.name)},</p>
        ${html}
        <p style="margin-top: 16px;">Regards,<br />${escapeHtml(teacherName)}</p>
      </div>
    `;
        const emailText = `Assalamualaikum ${student.name},\n\n${text}\n\nRegards,\n${teacherName}`;
        await sendMail(student.email, subject, emailHtml, emailText);
        return res.json({ message: "Email sent successfully." });
    }
    catch (error) {
        console.error("Failed to send email to student:", error);
        return res.status(500).json({ error: "Failed to send email." });
    }
}
//# sourceMappingURL=communicationController.js.map