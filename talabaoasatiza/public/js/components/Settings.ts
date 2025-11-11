interface StudentOption {
    id: string;
    name: string;
    email: string;
    className?: string;
}

function safeParseUser(): { role?: string; name?: string } | null {
    try {
        const raw = localStorage.getItem('user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function renderSettings(): string {
    const currentUser = safeParseUser();
    const isTeacher = currentUser?.role === 'teacher';

    if (isTeacher) {
        setTimeout(() => {
            const form = document.getElementById('teacher-email-form') as HTMLFormElement | null;
            const studentSelect = document.getElementById('email-student-select') as HTMLSelectElement | null;
            const subjectInput = document.getElementById('email-subject') as HTMLInputElement | null;
            const messageInput = document.getElementById('email-message') as HTMLTextAreaElement | null;
            const statusElement = document.getElementById('email-status');
            const token = localStorage.getItem('token');

            if (!form || !studentSelect || !subjectInput || !messageInput || !statusElement) {
                return;
            }

            const setStatus = (message: string, tone: 'info' | 'success' | 'error' = 'info') => {
                statusElement.textContent = message;
                statusElement.className = `text-sm mt-2 ${
                    tone === 'success'
                        ? 'text-green-600'
                        : tone === 'error'
                            ? 'text-red-600'
                            : 'text-slate-600'
                }`;
            };

            const loadStudents = async () => {
                setStatus('Loading students...', 'info');
                try {
                    const response = await fetch('/api/communications/students', {
                        headers: {
                            'Accept': 'application/json',
                            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                        },
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        const data = await response.json().catch(() => ({}));
                        throw new Error(data.error || 'Failed to load students');
                    }

                    const data = await response.json() as { students: StudentOption[] };
                    studentSelect.innerHTML = '<option value="">Select a student</option>';

                    if (!data.students || data.students.length === 0) {
                        setStatus('No students available to email.', 'info');
                        return;
                    }

                data.students
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .forEach((student) => {
                            const option = document.createElement('option');
                            option.value = student.id;
                            const classInfo = student.className ? ` • ${student.className}` : '';
                            option.textContent = `${student.name} (${student.email})${classInfo}`;
                            studentSelect.append(option);
                        });

                    setStatus('Ready to send an email.');
                } catch (error) {
                    console.error('Failed to load students', error);
                    setStatus(error instanceof Error ? error.message : 'Failed to load students', 'error');
                }
            };

            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const studentId = studentSelect.value;
                const subject = subjectInput.value.trim();
                const message = messageInput.value.trim();

                if (!studentId) {
                    setStatus('Please select a student to email.', 'error');
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
                        body: JSON.stringify({ studentId, subject, message }),
                    });

                    const data = await response.json().catch(() => ({}));

                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to send email.');
                    }

                    setStatus('Email sent successfully!', 'success');
                    form.reset();
                } catch (error) {
                    console.error('Failed to send email', error);
                    setStatus(error instanceof Error ? error.message : 'Failed to send email.', 'error');
                }
            });

            void loadStudents();
        }, 0);
    }

    return `
        <div class="container mx-auto p-4 space-y-6">
            <h1 class="text-3xl font-bold">Settings</h1>
            ${
                isTeacher
                    ? `
                <div class="bg-white p-6 rounded-lg shadow-md space-y-4">
                    <h2 class="text-2xl font-semibold">Email a Student</h2>
                    <p class="text-slate-600">Send important updates directly to your students from the portal.</p>
                    <form id="teacher-email-form" class="space-y-4">
                        <div>
                            <label for="email-student-select" class="block text-sm font-medium text-slate-700 mb-1">Student</label>
                            <select id="email-student-select" class="w-full border border-slate-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
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
            `
            }
        </div>
    `;
}
