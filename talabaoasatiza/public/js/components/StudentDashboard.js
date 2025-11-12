function setContainerMessage(containerId, message, tone = "info") {
    const container = document.getElementById(containerId);
    if (!container)
        return;
    const toneClass = tone === "error" ? "text-red-600" : "text-slate-600";
    container.innerHTML = `<p class="${toneClass}">${message}</p>`;
}
function getStudentId() {
    const userStr = localStorage.getItem('user');
    if (!userStr)
        return null;
    const user = JSON.parse(userStr);
    return user?._id;
}
async function fetchTasks(studentId) {
    try {
        const response = await fetch(`/api/tasks/user/${studentId}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load tasks.');
        }
        return data.tasks ?? [];
    }
    catch (error) {
        throw error instanceof Error ? error : new Error('Failed to load tasks.');
    }
}
async function fetchExams(className) {
    try {
        const response = await fetch(`/api/exams/class/${className}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load exams.');
        }
        return data.exams ?? [];
    }
    catch (error) {
        throw error instanceof Error ? error : new Error('Failed to load exams.');
    }
}
async function fetchAttendance(studentId) {
    try {
        const response = await fetch(`/api/attendance/user/${studentId}`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load attendance.');
        }
        return data;
    }
    catch (error) {
        throw error instanceof Error ? error : new Error('Failed to load attendance.');
    }
}
async function fetchClasses() {
    try {
        const response = await fetch(`/api/classes`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Failed to load classes.');
        }
        return data.classes ?? [];
    }
    catch (error) {
        throw error instanceof Error ? error : new Error('Failed to load classes.');
    }
}
async function updateUserClass(studentId, className) {
    const response = await fetch(`/api/users/${studentId}/class`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || 'Unable to save class selection.');
    }
}
async function updateTaskStatus(taskId, status) {
    const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update task status.');
    }
    // Optionally, re-render the tasks or update the UI to reflect the change
}
function renderTasks(tasks) {
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
function renderExams(exams) {
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
function renderAttendance(attendance) {
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
export function renderStudentDashboard() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        return '<p class="text-red-600">Error: Student not logged in.</p>';
    }
    let user = JSON.parse(userStr);
    const studentId = user?._id;
    if (!studentId) {
        return '<p class="text-red-600">Error: Student not logged in.</p>';
    }
    if (!user.className) {
        // If no class is selected, show a class selection interface
        setTimeout(async () => {
            const classSelectContainer = document.getElementById('class-select-container');
            if (classSelectContainer) {
                try {
                    const classes = await fetchClasses();
                    classSelectContainer.innerHTML = `
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h2 class="text-2xl font-bold mb-4">Select Your Class</h2>
                            <select id="class-selector" class="block w-full p-2 border border-gray-300 rounded-md mb-4">
                                <option value="">-- Please select a class --</option>
                                ${classes.map(cls => `<option value="${cls.name}">${cls.name}</option>`).join('')}
                            </select>
                            <button id="save-class-selection" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save Class</button>
                            <p id="class-selection-status" class="mt-4 text-sm text-slate-600"></p>
                        </div>
                    `;
                }
                catch (error) {
                    classSelectContainer.innerHTML = `
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h2 class="text-2xl font-bold mb-4">Select Your Class</h2>
                            <p class="text-red-600">${error instanceof Error ? error.message : 'Failed to load classes. Please refresh.'}</p>
                        </div>
                    `;
                    return;
                }
                document.getElementById('save-class-selection')?.addEventListener('click', async () => {
                    const statusEl = document.getElementById('class-selection-status');
                    const selectedClass = document.getElementById('class-selector').value;
                    if (!selectedClass) {
                        if (statusEl) {
                            statusEl.textContent = 'Please select a class before saving.';
                            statusEl.className = 'mt-4 text-sm text-red-600';
                        }
                        else {
                            alert('Please select a class.');
                        }
                        return;
                    }
                    if (statusEl) {
                        statusEl.textContent = 'Saving class selection...';
                        statusEl.className = 'mt-4 text-sm text-slate-600';
                    }
                    try {
                        user.className = selectedClass;
                        localStorage.setItem('user', JSON.stringify(user));
                        await updateUserClass(studentId, selectedClass);
                        if (statusEl) {
                            statusEl.textContent = 'Class saved. Reloading dashboard...';
                            statusEl.className = 'mt-4 text-sm text-green-600';
                        }
                        setTimeout(() => window.location.reload(), 600);
                    }
                    catch (error) {
                        if (statusEl) {
                            statusEl.textContent = error instanceof Error ? error.message : 'Failed to save class selection.';
                            statusEl.className = 'mt-4 text-sm text-red-600';
                        }
                        else {
                            alert('Failed to save class selection.');
                        }
                    }
                });
            }
        }, 0);
        return `
            <div class="container mx-auto p-4">
                <div id="class-select-container">
                    <p>Loading classes...</p>
                </div>
            </div>
        `;
    }
    // Initial render with loading states for the actual dashboard
    setTimeout(async () => {
        try {
            const [tasks, exams, attendance] = await Promise.all([
                fetchTasks(studentId),
                fetchExams(user.className),
                fetchAttendance(studentId)
            ]);
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
                const selectEl = select;
                selectEl.dataset.previousValue = selectEl.value;
                selectEl.addEventListener('change', async (event) => {
                    const targetSelect = event.target;
                    const taskId = targetSelect.dataset.taskId;
                    const statusValue = targetSelect.value;
                    const previousValue = targetSelect.dataset.previousValue || targetSelect.value;
                    if (!taskId)
                        return;
                    try {
                        await updateTaskStatus(taskId, statusValue);
                    }
                    catch (error) {
                        alert(error instanceof Error ? error.message : 'Failed to update task status.');
                        // revert to previous selection for clarity
                        targetSelect.value = previousValue;
                        targetSelect.dataset.previousValue = previousValue;
                        return;
                    }
                    targetSelect.dataset.previousValue = statusValue;
                });
            });
        }
        catch (error) {
            setContainerMessage('tasks-container', error instanceof Error ? error.message : 'Failed to load dashboard data.', 'error');
            setContainerMessage('exams-container', 'Unable to load exams right now.', 'error');
            setContainerMessage('attendance-container', 'Attendance data could not be retrieved.', 'error');
        }
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
//# sourceMappingURL=StudentDashboard.js.map