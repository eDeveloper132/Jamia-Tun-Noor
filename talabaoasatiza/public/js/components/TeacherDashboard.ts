type StatusTone = "info" | "success" | "error";

function setAttendanceStatus(message: string, tone: StatusTone = "info") {
    const statusElement = document.getElementById("attendance-status");
    if (!statusElement) return;
    const toneClass = tone === "success" ? "text-green-600" : tone === "error" ? "text-red-600" : "text-slate-600";
    statusElement.textContent = message;
    statusElement.className = `mt-2 text-sm ${toneClass}`;
}

function setAssignTaskMessage(message: string, tone: StatusTone = "info") {
    const messageDiv = document.getElementById("assign-task-message");
    if (!messageDiv) return;
    const toneClass = tone === "success" ? "text-green-600" : tone === "error" ? "text-red-600" : "text-slate-600";
    messageDiv.textContent = message;
    messageDiv.className = `mt-4 ${toneClass}`;
}

async function getMyAttendance() {
    try {
        const response = await fetch("/api/attendance/my-attendance");
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Unable to fetch attendance.");
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch attendance", error);
        setAttendanceStatus(error instanceof Error ? error.message : "Unable to fetch attendance.", "error");
        return null;
    }
}

function renderMyAttendance(attendanceToday: any) {
    const container = document.getElementById("attendance-today");
    if (!container) return;

    if (attendanceToday) {
        container.innerHTML = `
            <h3 class="text-lg font-bold">Today's Attendance</h3>
            <p>Status: <span class="font-semibold">${attendanceToday.status}</span></p>
            <p>Entry Time: <span class="font-semibold">${attendanceToday.entryTime || 'Not set'}</span></p>
            <p>Exit Time: <span class="font-semibold">${attendanceToday.exitTime || 'Not set'}</span></p>
        `;
        setAttendanceStatus("Attendance data loaded.", "success");
    } else {
        container.innerHTML = `
            <h3 class="text-lg font-bold">Today's Attendance</h3>
            <p>Not marked for today.</p>
        `;
        setAttendanceStatus("Attendance not marked for today yet.", "info");
    }
}

async function setupAttendanceForm() {
    const form = document.getElementById('attendance-form') as HTMLFormElement;
    if (!form) return;

    const dateInput = document.getElementById('attendance-date') as HTMLInputElement;
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today!;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const date = formData.get('attendance-date') as string;
        const entryTime = formData.get('entry-time') as string;
        const exitTime = formData.get('exit-time') as string;

        setAttendanceStatus("Saving attendance...", "info");

        try {
            const response = await fetch('/api/attendance/my-attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, entryTime, exitTime, status: 'present' }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to save attendance.");
            }

            const updatedAttendance = await response.json();
            renderMyAttendance(updatedAttendance.attendance);
            setAttendanceStatus("Attendance saved successfully!", "success");
        } catch (error) {
            console.error("Failed to save attendance", error);
            setAttendanceStatus(error instanceof Error ? error.message : "Failed to save attendance.", "error");
        }
    });
}

async function getClasses() {
    try {
        const response = await fetch("/api/classes", {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Unable to load classes.");
        }

        const data = await response.json();
        return data.classes ?? [];
    } catch (error) {
        console.error("Failed to fetch classes", error);
        throw error instanceof Error ? error : new Error("Unable to load classes.");
    }
}

function populateClassDropdown(classes: any[]) {
    const select = document.getElementById('task-class') as HTMLSelectElement;
    if (!select) return;

    select.innerHTML = '<option value="">Select a class</option>';
    for (const cls of classes) {
        const option = document.createElement('option');
        option.value = cls.name;
        option.textContent = cls.name;
        select.appendChild(option);
    }
}

async function setupAssignTaskForm() {
    const form = document.getElementById('assign-task-form') as HTMLFormElement;
    if (!form) return;

    try {
        const classes = await getClasses();
        if (!classes.length) {
            setAssignTaskMessage("No classes available to assign tasks.", "info");
        } else {
            populateClassDropdown(classes);
            setAssignTaskMessage("Select a class and submit the form to assign a task.", "info");
        }
    } catch (error) {
        setAssignTaskMessage(error instanceof Error ? error.message : "Unable to load classes.", "error");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const title = formData.get('task-title') as string;
        const subject = formData.get('task-subject') as string;
        const description = formData.get('task-description') as string;
        const className = formData.get('task-class') as string;
        const dueDate = formData.get('task-due-date') as string;

        setAssignTaskMessage("Assigning task...", "info");

        try {
            const response = await fetch('/api/tasks/class', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify({ title, subject, description, className, dueDate }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to assign task.");
            }

            const result = await response.json();
            setAssignTaskMessage(result.message || "Task assigned successfully.", "success");
            form.reset();
        } catch (error) {
            console.error("Failed to assign task", error);
            setAssignTaskMessage(error instanceof Error ? error.message : "Failed to assign task.", "error");
        }
    });
}

export function renderTeacherDashboard(): string {
    // Fetch and render attendance as soon as the dashboard loads
    setAttendanceStatus("Loading today's attendance...", "info");
    getMyAttendance().then(data => {
        if (data) {
            renderMyAttendance(data.today);
        }
    });

    // Setup the form for interaction
    setTimeout(setupAttendanceForm, 0);
    setTimeout(setupAssignTaskForm, 0);

    return `
        <div class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">Teacher Dashboard</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">My Courses</h2>
                    <p>You are teaching 2 courses.</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">Student Grades</h2>
                    <p>Manage student grades.</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">Student Attendance</h2>
                    <p>Manage student attendance.</p>
                </div>
            </div>
        </div>
    `;
}
