// src/seed/fullSeed.ts
import dotenv from "dotenv";
dotenv.config();

import connectToDatabase from "../config/db/db.js";
import { ClassModel } from "../models/Class.js";
import { UserModel } from "../models/User.js";
import { AttendanceModel } from "../models/Attendance.js";
import { TaskModel } from "../models/Task.js";
import { ExamModel } from "../models/Exam.js";
import { hashPassword } from "../utils/hash.js";

async function ensureClasses() {
  const classes = [
    "عامہ سال اول","عامہ سال دوم","خاصہ سال اول","خاصہ سال دوم",
    "عالیہ سال اول","عالیہ سال دوم","عالمیہ سال اول","عالمیہ سال دوم"
  ];
  for (const name of classes) {
    await ClassModel.updateOne({ name }, { name }, { upsert: true });
  }
  console.log("Classes ensured.");
}

async function createUsers() {
  // sample users with plain passwords (for testing)
  const creds = [
    { email: "nazim@jamia.local", name: "Nazim Admin", role: "nazim", password: "NazimPass123!" },
    { email: "teacher1@jamia.local", name: "Ustad Ahmed", role: "teacher", password: "TeachPass1!", subjects: ["قرآن","فقہ"] },
    { email: "teacher2@jamia.local", name: "Ustad Bilal", role: "teacher", password: "TeachPass2!", subjects: ["حدیث","تفسیر"] },
    { email: "student1@jamia.local", name: "Student One", role: "student", password: "StudPass1!", className: "عامہ سال اول" },
    { email: "student2@jamia.local", name: "Student Two", role: "student", password: "StudPass2!", className: "عامہ سال اول" },
    { email: "student3@jamia.local", name: "Student Three", role: "student", password: "StudPass3!", className: "عامہ سال اول" },
    { email: "student4@jamia.local", name: "Student Four", role: "student", password: "StudPass4!", className: "عامہ سال اول" },
    { email: "student5@jamia.local", name: "Student Five", role: "student", password: "StudPass5!", className: "عامہ سال دوم" },
    { email: "student6@jamia.local", name: "Student Six", role: "student", password: "StudPass6!", className: "عامہ سال دوم" }
  ];

  // Remove existing with same emails so script is idempotent
  const emails = creds.map(c => c.email);
  await UserModel.deleteMany({ email: { $in: emails } });

  const created: any[] = [];
  for (const c of creds) {
    const passwordHash = await hashPassword(c.password);
    const u = await UserModel.create({
      email: c.email,
      passwordHash,
      name: c.name,
      role: c.role,
      className: c.className,
      subjects: c.subjects || []
    });
    created.push({ email: c.email, id: u._id, password: c.password, role: c.role });
  }

  console.log("Users created:");
  created.forEach(u => console.log(`  ${u.role.toUpperCase()}: ${u.email} / ${u.password}`));
  return created;
}

function isoDateString(d: Date) {
  // returns YYYY-MM-DD
  return d.toISOString().slice(0, 10);
}

async function createAttendance(users: any[]) {
  // pick students and teachers
  const students = users.filter(u => u.role === "student");
  const teachers = users.filter(u => u.role === "teacher");
  const nazim = users.find(u => u.role === "nazim");

  // remove existing attendance for the dates we will create to keep idempotent
  const days = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(isoDateString(d));
  }

  await AttendanceModel.deleteMany({ date: { $in: days } });

  const docs: any[] = [];

  for (const date of days) {
    // for each student: randomly present or absent for variety
    for (const s of students) {
      const status = Math.random() > 0.15 ? "present" : "absent"; // mostly present
      docs.push({
        user: s.id,
        userRole: "student",
        className: s.className,
        date,
        entryTime: status === "present" ? "08:00" : undefined,
        exitTime: status === "present" ? "10:00" : undefined,
        status,
        markedBy: teachers[Math.floor(Math.random() * teachers.length)].id
      });
    }

    // teachers themselves (present)
    for (const t of teachers) {
      docs.push({
        user: t.id,
        userRole: "teacher",
        date,
        entryTime: "07:45",
        exitTime: "10:15",
        status: "present",
        subject: t.subjects && t.subjects[0],
        markedBy: nazim.id
      });
    }
  }

  const inserted = await AttendanceModel.insertMany(docs);
  console.log(`Inserted ${inserted.length} attendance records for last ${days.length} days.`);
  return inserted.length;
}

async function createTasks(users: any[]) {
  const students = users.filter(u => u.role === "student").slice(0, 4); // first 4 students
  const teacher = await UserModel.findOne({ email: "teacher1@jamia.local" });
  if (!teacher) {
    console.warn("teacher1 not found for task creation");
    return;
  }

  // remove existing tasks by same title to keep idempotent
  await TaskModel.deleteMany({ title: { $in: ["حفظ سورہ بقرہ", "قراءة صف اولی"] } });

  const t1 = await TaskModel.create({
    title: "حفظ سورہ بقرہ",
    description: "سورہ بقرہ کے چند آیات حفظ کریں",
    subject: "قرآن",
    assignedBy: teacher._id,
    assignedTo: students.map(s => s.id),
    assignedDate: isoDateString(new Date()),
    dueDate: isoDateString(new Date(new Date().setDate(new Date().getDate() + 7))),
    status: "pending"
  });

  const t2 = await TaskModel.create({
    title: "قراءة صف اولی",
    description: "صفحہ نمبر 12 سے 15 پڑھ کر خلاصہ دیں",
    subject: "فقہ",
    assignedBy: teacher._id,
    assignedTo: [students[0].id],
    assignedDate: isoDateString(new Date()),
    dueDate: isoDateString(new Date(new Date().setDate(new Date().getDate() + 3))),
    status: "pending"
  });

  console.log("Tasks created:", t1.title, ",", t2.title);
}

async function createExam(users: any[]) {
  const nazim = await UserModel.findOne({ email: "nazim@jamia.local" });
  if (!nazim) {
    console.warn("nazim not found for exam creation");
    return;
  }

  await ExamModel.deleteMany({ title: "Midterm - عامہ سال اول" });

  const exam = await ExamModel.create({
    title: "Midterm - عامہ سال اول",
    subject: "قرآن",
    className: "عامہ سال اول",
    date: isoDateString(new Date(new Date().setDate(new Date().getDate() + 10))),
    startTime: "09:00",
    endTime: "11:00",
    createdBy: nazim._id,
    results: []
  });

  console.log("Exam created:", exam.title);
}

async function run() {
  await connectToDatabase();
  await ensureClasses();
  const createdUsers = await createUsers();
  await createAttendance(createdUsers);
  await createTasks(createdUsers);
  await createExam(createdUsers);
  console.log("Full seed complete. You can now login with the created accounts.");
  console.log("Example logins:");
  console.log("  nazim@jamia.local / NazimPass123!");
  console.log("  teacher1@jamia.local / TeachPass1!");
  console.log("  teacher2@jamia.local / TeachPass2!");
  console.log("  student1@jamia.local / StudPass1!");
  process.exit(0);
}

run().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
