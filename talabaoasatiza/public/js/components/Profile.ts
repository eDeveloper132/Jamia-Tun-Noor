// D:\Jamia-Tun-Noor\talabaoasatiza\public\js\components\Profile.ts
interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    pastQualifications?: string[];
    currentEnrollment?: string;
    profilePicture?: string;
}

export function renderProfile(user: User): string {
    const profilePicture = user.profilePicture || 'https://via.placeholder.com/150';

    return `
        <div class="container mx-auto p-6 space-y-6">
            <div id="profileSummary" class="bg-white p-8 rounded-2xl shadow-lg">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div class="flex items-center space-x-6">
                        <img src="${profilePicture}" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover border-4 border-primary">
                        <div>
                            <h1 class="text-3xl font-bold text-text-color">My Profile</h1>
                            <p class="text-lg text-gray-600 mt-2">${user.email}</p>
                            <p class="text-lg text-gray-600 capitalize">${user.role}</p>
                        </div>
                    </div>
                    <button id="editProfileBtn" class="self-start sm:self-auto inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5h2m2 0h2m2 0h-2m-2 0h-2m-2 0H9m-2 0H5m2 4h10m-4 4h4m-8 0h-4m0 4h4m8 0h4M5 17h4" />
                        </svg>
                        Edit Profile
                    </button>
                </div>
                <div class="mt-8 space-y-6">
                    <div>
                        <h2 class="text-2xl font-semibold text-text-color">Name</h2>
                        <p class="text-lg text-gray-700 mt-2">${user.name}</p>
                    </div>
                    <div>
                        <h2 class="text-2xl font-semibold text-text-color">Past Qualifications</h2>
                        <ul class="list-disc list-inside mt-2 text-gray-600 space-y-1">
                            ${user.pastQualifications?.length
        ? user.pastQualifications.map(q => `<li>${q}</li>`).join('')
        : '<li>No qualifications listed.</li>'}
                        </ul>
                    </div>
                    <div>
                        <h2 class="text-2xl font-semibold text-text-color">Current Enrollment</h2>
                        <p class="text-lg text-gray-700 mt-2">${user.currentEnrollment || 'Not currently enrolled.'}</p>
                    </div>
                </div>
            </div>
            <div id="editProfileForm" class="hidden bg-white p-8 rounded-2xl shadow-lg space-y-6">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 class="text-3xl font-bold text-text-color">Edit Profile</h2>
                    <button type="button" id="cancelEditProfileBtn" class="inline-flex items-center gap-2 text-gray-600 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                    </button>
                </div>
                <form id="profileForm" class="space-y-6">
                    <div>
                        <label for="profilePicture" class="block text-lg font-medium text-text-color mb-2">Profile Picture URL</label>
                        <input type="text" id="profilePicture" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" value="${user.profilePicture || ''}">
                    </div>
                    <div>
                        <label for="pastQualifications" class="block text-lg font-medium text-text-color mb-2">Past Qualifications (comma-separated)</label>
                        <input type="text" id="pastQualifications" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" value="${user.pastQualifications?.join(', ') || ''}">
                    </div>
                    <div>
                        <label for="currentEnrollment" class="block text-lg font-medium text-text-color mb-2">Current Enrollment</label>
                        <input type="text" id="currentEnrollment" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" value="${user.currentEnrollment || ''}">
                    </div>
                    <div id="profileUpdateStatus" class="text-sm text-gray-600"></div>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button type="submit" class="inline-flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
                            Save Changes
                        </button>
                        <button type="button" id="cancelEditProfileBtnSecondary" class="inline-flex items-center justify-center text-gray-600 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}
