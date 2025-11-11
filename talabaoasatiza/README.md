<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">talabaoasatiza</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> A comprehensive platform for managing students and teachers.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

This project is a web application designed to manage students and teachers. It features separate dashboards for students and teachers, user authentication, and responsive design. The frontend is built with plain HTML, CSS (Tailwind CSS), and TypeScript, while the backend uses Node.js with Express.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed.

### Installing

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd talabaoasatiza
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    Create a `.env` file in the root directory based on `.env.example` and fill in the required values (e.g., MongoDB URI, JWT Secret).
4.  Compile TypeScript:
    ```bash
    npx tsc
    ```
5.  Start the server:
    ```bash
    npm start
    ```

The application will be accessible at `http://localhost:4000` (or your specified port).

## 🔧 Running the tests <a name = "tests"></a>

(Currently, there are no automated tests configured for this project.)

## 🎈 Usage <a name="usage"></a>

-   **Sign Up/Login:** Access the authentication pages to create an account or log in.
-   **Student Dashboard:** Students will be redirected to their personalized dashboard upon login.
-   **Teacher Dashboard:** Teachers will be redirected to their personalized dashboard upon login.
-   **Profile & Settings:** Both roles can access and manage their profile and settings.

## 🚀 Deployment <a name = "deployment"></a>

(Add specific deployment instructions here if applicable, e.g., Vercel, Heroku, etc.)

## ⛏️ Built Using <a name = "built_using"></a>

-   [MongoDB](https://www.mongodb.com/) - Database
-   [Express.js](https://expressjs.com/) - Backend Web Framework
-   [Node.js](https://nodejs.org/en/) - JavaScript Runtime
-   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
-   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework

## ✍️ Authors <a name = "authors"></a>

-   [@kylelobo](https://github.com/kylelobo) - Idea & Initial work

See also the list of [contributors](https://github.com/kylelobo/The-Documentation-Compendium/contributors) who participated in this project.

## 🎉 Acknowledgments <a name = "acknowledgement"></a>

-   Hat tip to anyone whose code was used
-   Inspiration
-   References
