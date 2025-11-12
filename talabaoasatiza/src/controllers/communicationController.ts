import type { Response } from "express";
import type { AuthRequest } from "../utils/authMiddleware.js";
import { UserModel } from "../models/User.js";
import { sendMail } from "../utils/mailer.js";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMessageBody(body: string): { html: string; text: string } {
  const safeBody = escapeHtml(body).replace(/\r?\n/g, "<br />");
  const plainBody = body.replace(/\r?\n/g, "\n");
  return {
    html: `<p>${safeBody}</p>`,
    text: plainBody,
  };
}

export async function listClassesForTeacher(req: AuthRequest, res: Response) {
  try {
    const classes = await UserModel.aggregate<{ _id: string; studentCount: number }>([
      {
        $match: {
          role: "student",
          className: { $exists: true, $nin: [null, ""] },
        },
      },
      {
        $group: {
          _id: "$className",
          studentCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return res.json({
      classes: classes.map((item) => ({
        name: item._id,
        studentCount: item.studentCount,
      })),
    });
  } catch (error) {
    console.error("Failed to list classes for teacher:", error);
    return res.status(500).json({ error: "Failed to load classes." });
  }
}

export async function sendClassEmail(req: AuthRequest, res: Response) {
  try {
    const { className, subject, message } = req.body as {
      className?: string;
      subject?: string;
      message?: string;
    };

    if (!className || !subject || !message) {
      return res.status(400).json({ error: "Class, subject, and message are required." });
    }

    const students = await UserModel.find({
      role: "student",
      className,
    }).select(["name", "email"]);

    if (!students || students.length === 0) {
      return res.status(404).json({ error: "No students found for the selected class." });
    }

    const teacherName =
      typeof req.user?.name === "string" && req.user.name.trim().length > 0
        ? req.user.name
        : "Your teacher";

    const { html, text } = formatMessageBody(message);

    let sentCount = 0;
    const failures: string[] = [];

    for (const student of students) {
      try {
        const personalizedHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Assalamualaikum ${escapeHtml(student.name)},</p>
        ${html}
        <p style="margin-top: 16px;">Regards,<br />${escapeHtml(teacherName)}</p>
      </div>
    `;

        const personalizedText = `Assalamualaikum ${student.name},\n\n${text}\n\nRegards,\n${teacherName}`;

        await sendMail(student.email, subject, personalizedHtml, personalizedText);
        sentCount += 1;
      } catch (error) {
        console.error(`Failed to send email to ${student.email}:`, error);
        failures.push(student.email);
      }
    }

    if (sentCount === 0) {
      return res.status(500).json({ error: "Failed to send email to the selected class." });
    }

    const messageText =
      failures.length > 0
        ? `Email sent to ${sentCount} students, but failed for ${failures.length}.`
        : "Email sent to all students in the class successfully.";

    return res.json({
      message: messageText,
      sent: sentCount,
      failed: failures,
    });
  } catch (error) {
    console.error("Failed to send email to class:", error);
    return res.status(500).json({ error: "Failed to send email." });
  }
}
