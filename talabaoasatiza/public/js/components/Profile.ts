// D:\Jamia-Tun-Noor\talabaoasatiza\public\js\components\Profile.ts
interface User {
    name: string;
    email: string;
    role: string;
}

export function renderProfile(): string {
    const user: User = JSON.parse(localStorage.getItem('user') as string);
    return `
        <div class="container mx-auto p-4">
            <h1 class="text-3xl font-bold mb-4">My Profile</h1>
            <div class="bg-white p-4 rounded-lg shadow-md">
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Role:</strong> ${user.role}</p>
            </div>
        </div>
    `;
}
