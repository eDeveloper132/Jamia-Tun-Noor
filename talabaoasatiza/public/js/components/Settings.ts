// public/js/components/Settings.ts

export function renderSettings(): string {
    // Initial render with event listeners
    setTimeout(() => {
        const darkModeToggle = document.getElementById('dark-mode-toggle') as HTMLInputElement;
        if (darkModeToggle) {
            // Set initial state from localStorage
            if (localStorage.getItem('theme') === 'dark') {
                document.documentElement.classList.add('dark');
                darkModeToggle.checked = true;
            }

            darkModeToggle.addEventListener('change', () => {
                if (darkModeToggle.checked) {
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.documentElement.classList.remove('dark');
                    localStorage.setItem('theme', 'light');
                }
            });
        }
    }, 0);

    return `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Settings</h2>
            <div class="flex items-center justify-between">
                <span class="text-gray-700 dark:text-gray-300">Dark Mode</span>
                <label for="dark-mode-toggle" class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="dark-mode-toggle" class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>
    `;
}