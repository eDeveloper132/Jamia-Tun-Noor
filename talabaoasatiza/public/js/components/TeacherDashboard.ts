// D:\Jamia-Tun-Noor\talabaoasatiza\public\js\components\TeacherDashboard.ts
export function renderTeacherDashboard(): string {
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
