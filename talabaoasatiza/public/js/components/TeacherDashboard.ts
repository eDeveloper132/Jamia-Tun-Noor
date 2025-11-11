async function getMyAttendance() {
    const response = await fetch("/api/attendance/my-attendance");
    if (!response.ok) {
        console.error("Failed to fetch attendance");
        return null;
    }
    return await response.json();
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
    } else {
        container.innerHTML = `
            <h3 class="text-lg font-bold">Today's Attendance</h3>
            <p>Not marked for today.</p>
        `;
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

        const response = await fetch('/api/attendance/my-attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date, entryTime, exitTime, status: 'present' }),
        });

        if (response.ok) {
            const updatedAttendance = await response.json();
            renderMyAttendance(updatedAttendance.attendance);
            alert('Attendance saved successfully!');
        } else {
            const errorData = await response.json();
            alert(`Failed to save attendance: ${errorData.error}`);
        }
    });
}

async function getClasses() {
    const response = await fetch("/api/classes", {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!response.ok) {
        console.error("Failed to fetch classes");
        return [];
    }
    const data = await response.json();
    return data.classes;
}

function populateClassDropdown(classes: any[]) {
    const select = document.getElementById('task-class') as HTMLSelectElement;
    if (!select) return;

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

    const classes = await getClasses();
    populateClassDropdown(classes);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const title = formData.get('task-title') as string;
        const subject = formData.get('task-subject') as string;
        const description = formData.get('task-description') as string;
        const className = formData.get('task-class') as string;
        const dueDate = formData.get('task-due-date') as string;

        const response = await fetch('/api/tasks/class', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: JSON.stringify({ title, subject, description, className, dueDate }),
        });

        const messageDiv = document.getElementById('assign-task-message');
        if (!messageDiv) return;

        if (response.ok) {
            const result = await response.json();
            messageDiv.textContent = result.message;
            messageDiv.className = 'text-green-500';
            form.reset();
        } else {
            const errorData = await response.json();
            messageDiv.textContent = `Failed to assign task: ${errorData.error}`;
            messageDiv.className = 'text-red-500';
        }
    });
}

export function renderTeacherDashboard(): string {
    // Fetch and render attendance as soon as the dashboard loads
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
