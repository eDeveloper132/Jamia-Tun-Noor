
function getStudentId() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user?._id;
}

async function fetchTasks(studentId: string): Promise<any[]> {
    const response = await fetch(`/api/tasks/user/${studentId}`);
    const data = await response.json();
    return data.tasks;
}

async function fetchExams(className: string): Promise<any[]> {
    const response = await fetch(`/api/exams/class/${className}`);
    const data = await response.json();
    return data.exams;
}

async function fetchAttendance(studentId: string): Promise<any> {
    const response = await fetch(`/api/attendance/user/${studentId}`);
    return await response.json();
}

async function updateTaskStatus(taskId: string, status: string): Promise<void> {
    await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    // Optionally, re-render the tasks or update the UI to reflect the change
}

function renderTasks(tasks: any[]): string {
    if (!tasks || tasks.length === 0) {
        return '<p>No tasks assigned.</p>';
    }
    return `
        <ul>
            ${tasks.map(task => `
                <li class="mb-2 p-2 rounded-lg ${task.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-bold">${task.title}</p>
                            <p>${task.description}</p>
                            <p>Due: ${new Date(task.dueDate).toLocaleDateString()}</p>
                        </div>
                        <select class="task-status-select" data-task-id="${task._id}">
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;
}

function renderExams(exams: any[]): string {
    if (!exams || exams.length === 0) {
        return '<p>No upcoming exams.</p>';
    }
    return `
        <ul>
            ${exams.map(exam => `
                <li class="mb-2 p-2 rounded-lg bg-blue-100">
                    <p class="font-bold">${exam.title} (${exam.subject})</p>
                    <p>Date: ${new Date(exam.date).toLocaleDateString()}</p>
                    <p>Time: ${exam.startTime} - ${exam.endTime}</p>
                </li>
            `).join('')}
        </ul>
    `;
}

function renderAttendance(attendance: any): string {
    if (!attendance) {
        return '<p>No attendance data available.</p>';
    }
    return `
        <div>
            <p>Percentage: ${attendance.percentage}%</p>
            <p>Present: ${attendance.present} / ${attendance.total}</p>
            <a href="/attendance" class="text-blue-600 hover:underline">View Detailed Attendance</a>
        </div>
    `;
}

export function renderStudentDashboard(): string {
    const studentId = getStudentId();
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        return '<p>Error: Student not logged in.</p>';
    }
    const user = JSON.parse(userStr);

    if (!studentId) {
        return '<p>Error: Student not logged in.</p>';
    }

    // Initial render with loading states
    setTimeout(async () => {
        const tasks = await fetchTasks(studentId);
        const exams = await fetchExams(user.className);
        const attendance = await fetchAttendance(studentId);

        const tasksContainer = document.getElementById('tasks-container');
        if (tasksContainer) {
            tasksContainer.innerHTML = renderTasks(tasks);
        }

        const examsContainer = document.getElementById('exams-container');
        if (examsContainer) {
            examsContainer.innerHTML = renderExams(exams);
        }

        const attendanceContainer = document.getElementById('attendance-container');
        if (attendanceContainer) {
            attendanceContainer.innerHTML = renderAttendance(attendance);
        }

        // Add event listeners for task status changes
        document.querySelectorAll('.task-status-select').forEach(select => {
            select.addEventListener('change', async (event) => {
                const taskId = (event.target as HTMLSelectElement).dataset.taskId;
                const status = (event.target as HTMLSelectElement).value;
                if (taskId) {
                    await updateTaskStatus(taskId, status);
                    // You might want to add a visual indicator that the status was updated
                }
            });
        });
    }, 0);

    return `
        <div class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">Student Dashboard</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">My Tasks</h2>
                    <div id="tasks-container"><p>Loading tasks...</p></div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">Upcoming Exams</h2>
                    <div id="exams-container"><p>Loading exams...</p></div>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">My Attendance</h2>
                    <div id="attendance-container"><p>Loading attendance...</p></div>
                </div>
            </div>
        </div>
    `;
}
