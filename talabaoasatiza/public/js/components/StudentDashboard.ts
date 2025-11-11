// D:\Jamia-Tun-Noor\talabaoasatiza\public\js\components\StudentDashboard.ts
export function renderStudentDashboard(): string {
    return `
        <div class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">Student Dashboard</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">My Courses</h2>
                    <p>You are enrolled in 3 courses.</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">My Grades</h2>
                    <p>Your average grade is B+.</p>
                </div>
                <div class="bg-white p-4 rounded-lg shadow-md">
                    <h2 class="text-xl font-bold mb-2">My Attendance</h2>
                    <p>Your attendance is 95%.</p>
                </div>
            </div>
        </div>
    `;
}
