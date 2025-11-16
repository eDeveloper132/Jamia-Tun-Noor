# GEMINI.md

## Project Overview

This project is a web application for managing students and teachers. It features separate dashboards for students and teachers, user authentication, and a responsive design. The frontend is built with plain HTML, CSS (Tailwind CSS), and TypeScript, while the backend uses Node.js with Express. The database is MongoDB.

## Building and Running

### Prerequisites

Make sure you have Node.js and npm installed.

### Installation and Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root directory based on `.env.example` and fill in the required values (e.g., MongoDB URI, JWT Secret).

3.  **Start the server:**
    ```bash
    npm start
    ```
    This command compiles the TypeScript files and starts the server. The application will be accessible at `http://localhost:4000` (or your specified port).

### Other Commands

*   **Seed the database:**
    ```bash
    npm run seed
    ```
*   **Seed the database with full data:**
    ```bash
    npm run seed:full
    ```
*   **Build the CSS:**
    ```bash
    npm run build:css
    ```

## Development Conventions

*   The project uses TypeScript for both the backend and frontend.
*   The backend follows a typical MVC pattern with routes, controllers, and models.
*   Authentication is handled using JSON Web Tokens (JWT).
*   The frontend is built with plain HTML and TypeScript, with Tailwind CSS for styling.
*   The project uses `socket.io` for real-time communication.
*   The project is set up for deployment on Vercel.