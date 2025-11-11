// D:\Jamia-Tun-Noor\talabaoasatiza\public\js\components\Profile.js
export function renderProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
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
