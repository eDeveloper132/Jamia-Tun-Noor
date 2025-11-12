function safeParseUser() {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
export function renderSettings() {
    const currentUser = safeParseUser();
    const isTeacher = currentUser?.role === 'teacher';
    if (isTeacher) {
        setTimeout(() => {
            const form = document.getElementById('teacher-email-form');
            const classSelect = document.getElementById('email-class-select');
            const subjectInput = document.getElementById('email-subject');
            const messageInput = document.getElementById('email-message');
            const statusElement = document.getElementById('email-status');
            const token = localStorage.getItem('token');
            if (!form || !classSelect || !subjectInput || !messageInput || !statusElement) {
                return;
            }
            const setStatus = (message, tone = 'info') => {
                statusElement.textContent = message;
                statusElement.className = `text-sm mt-2 ${tone === 'success'
                    ? 'text-green-600'
                    : tone === 'error'
                        ? 'text-red-600'
                        : 'text-slate-600'}`;
            };
            const loadClasses = async () => {
                setStatus('Loading classes...', 'info');
                classSelect.disabled = true;
                try {
                    const response = await fetch('/api/communications/classes', {
                        headers: {
                            'Accept': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        },
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        const data = await response.json().catch(() => ({}));
                        throw new Error(data.error || 'Failed to load classes');
                    }
                    const data = await response.json();
                    classSelect.innerHTML = '<option value="">Select a class</option>';
                    if (!data.classes || data.classes.length === 0) {
                        setStatus('No classes with students available to email.', 'info');
                        classSelect.disabled = true;
                        return;
                    }
                    classSelect.disabled = false;
                    data.classes
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .forEach((classOption) => {
                        const option = document.createElement('option');
                        option.value = classOption.name;
                        const countInfo = typeof classOption.studentCount === 'number'
                            ? ` (${classOption.studentCount} students)`
                            : '';
                        option.textContent = `${classOption.name}${countInfo}`;
                        classSelect.append(option);
                    });
                    setStatus('Ready to send an email.');
                }
                catch (error) {
                    console.error('Failed to load classes', error);
                    classSelect.innerHTML = '<option value="">Unable to load classes</option>';
                    setStatus(error instanceof Error ? error.message : 'Failed to load classes', 'error');
                }
            };
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const className = classSelect.value;
                const subject = subjectInput.value.trim();
                const message = messageInput.value.trim();
                if (!className) {
                    setStatus('Please select a class to email.', 'error');
                    return;
                }
                if (!subject || !message) {
                    setStatus('Subject and message are required.', 'error');
                    return;
                }
                setStatus('Sending email...', 'info');
                try {
                    const response = await fetch('/api/communications/email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        },
                        credentials: 'include',
                        body: JSON.stringify({ className, subject, message }),
                    });
                    const data = await response.json().catch(() => ({}));
                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to send email.');
                    }
                    setStatus('Email sent successfully!', 'success');
                    form.reset();
                    classSelect.selectedIndex = 0;
                }
                catch (error) {
                    console.error('Failed to send email', error);
                    setStatus(error instanceof Error ? error.message : 'Failed to send email.', 'error');
                }
            });
            void loadClasses();
        }, 0);
    }
    return `
        <div class="container mx-auto p-4 space-y-6">
            <h1 class="text-3xl font-bold">Settings</h1>
            ${isTeacher
        ? `
                <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 class="text-2xl font-semibold">Email a Class</h2>
                    <p class="text-slate-600">Send important updates directly to every student enrolled in a class.</p>
                    <form id="teacher-email-form" class="space-y-4">
                        <div>
                            <label for="email-class-select" class="block text-sm font-medium text-slate-700 mb-1">Class</label>
                            <select id="email-class-select" class="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                                <option value="">Loading...</option>
                            </select>
                        </div>
                        <div>
                            <label for="email-subject" class="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                            <input id="email-subject" type="text" class="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Parent-teacher meeting reminder" required />
                        </div>
                        <div>
                            <label for="email-message" class="block text-sm font-medium text-slate-700 mb-1">Message</label>
                            <textarea id="email-message" rows="6" class="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Assalamualaikum..." required></textarea>
                        </div>
                        <button type="submit" class="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Send Email
                        </button>
                        <p id="email-status" class="text-sm mt-2 text-slate-600"></p>
                    </form>
                </div>
            `
        : `
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-2xl font-semibold">Account Preferences</h2>
                    <p class="text-slate-600">No additional settings are available for your role at this time.</p>
                </div>
            `}
        </div>
    `;
}
//# sourceMappingURL=Settings.js.map