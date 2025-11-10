// ./src/index.mts
import "dotenv/config"; // Load environment variables from .env file
import path from "path"; // Core module for working with file and directory paths
import express from "express"; // The main Express application framework
import cors from "cors"; // Middleware to enable Cross-Origin Resource Sharing (CORS)
import cookieParser from "cookie-parser"; // Middleware to parse cookies attached to the client request
import connectToDatabase from "./config/db/db.js"; // Function to establish MongoDB connection
import authRoutes from "./routes/auth.js"; // Import routes for authentication (login/signup)
import userRoutes from "./routes/users.js"; // Import routes for user management
import attendanceRoutes from "./routes/attendance.js"; // Import routes for attendance features
import taskRoutes from "./routes/tasks.js"; // Import routes for tasks/assignments
import examRoutes from "./routes/exams.js"; // Import routes for exams/tests
import http from "http";
import { Server } from "socket.io";
import serverless from "serverless-http";
import { requireAuth, requireRole } from "./utils/authMiddleware.js"; // Custom middleware for checking authentication and roles
import { UserModel } from "./models/User.js"; // MongoDB User model
import { hashPassword } from "./utils/hash.js"; // Utility function for password hashing
import { v4 as uuidv4 } from "uuid"; // Utility for generating UUIDs (used for tokens)
import { sendVerificationEmailTwo } from "./utils/mailer.js"; // Utility for sending emails (specifically for password reset flow)
const app = express(); // Initialize the Express application
const PORT = process.env.PORT || 4000; // Define the port to run the server on
const isVercel = Boolean(process.env.VERCEL);
let server;
let io;
if (!isVercel) {
    server = http.createServer(app);
    io = new Server(server, {
        cors: { origin: "*" },
    });
    app.set("io", io);
}
else {
    const noop = () => { };
    const stubIo = {
        emit: noop,
        to: () => ({ emit: noop }),
        on: noop,
    };
    app.set("io", stubIo);
}
// Global IO
// --- Global Middleware Setup ---
app.use(cors()); // Enable CORS for all incoming requests
app.use(express.json()); // Middleware to parse incoming requests with JSON payloads
app.use(cookieParser()); // Middleware to parse and handle cookies
// Serve static assets (CSS, client-side JS, images) from the 'public' directory
app.use(express.static(path.join("public")));
// --- Database Connection ---
await connectToDatabase(); // Connect to the MongoDB database (using top-level await)
// --- Server Start ---
// --- Frontend/UI Routes (Serving HTML) ---
// Protected Home Route: Requires authentication and specific roles to access
app.get("/", requireAuth, requireRole(["student", "teacher"]), (req, res) => {
    return res.sendFile(path.resolve("public", "protected", "index.html")); // Serve the protected main page
});
// Route to serve the login HTML page
app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public", "auth", "signin.html"));
});
// Route to serve the signup HTML page
app.get("/signup", (req, res) => {
    res.sendFile(path.resolve("public", "auth", "signup.html"));
});
// Logout endpoint: Clears the authentication cookie
app.get("/logout", (req, res) => {
    res.clearCookie("token"); // Clear the cookie named 'token'
    return res.status(200).json({ message: "Logged out successfully" }); // Send JSON confirmation
});
// Route to serve the HTML page for setting a new password after a 'forgot password' flow
app.get('/forgot-password', (req, res) => {
    res.sendFile(path.resolve("public", "auth", "reset-password.html"));
});
// --- API Router Mounting ---
app.use("/api/auth", authRoutes); // Mount authentication-related API routes
app.use("/api/users", userRoutes); // Mount user management API routes
app.use("/api/attendance", attendanceRoutes); // Mount attendance API routes
app.use("/api/tasks", taskRoutes); // Mount tasks API routes
app.use("/api/exams", examRoutes); // Mount exams API routes
// --- Email Verification Routes ---
// Route handler for the initial email verification link (after signup)
app.get('/verify-email', async (req, res) => {
    const { token } = req.query; // Extract verification token from URL query params
    if (!token) {
        // Handle case where token is missing
        return res.status(400).send(`
      <html>
        <body>
          <h1>Verification token is required.</h1>
        </body>
      </html>
    `);
    }
    try {
        // Find the user by the verification token and ensure the token hasn't expired
        const user = await UserModel.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
            // Handle case where token is invalid or expired
            return res.status(400).send(`
        <html>
          <body>
            <h1>Invalid or expired token.</h1>
          </body>
        </html>
      `);
        }
        // Mark the user's email as verified
        user.isEmailVerified = true;
        user.verificationToken = ""; // Clear the token
        // Clear the token expiry (implicitly done by setting to empty string or saving)
        await user.save();
        // Send success message with an HTML meta-refresh to redirect to the home page
        res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=/" />
        </head>
        <body>
          <h1>Email verified successfully!</h1>
          <p>You will be redirected shortly...</p>
        </body>
      </html>
    `);
    }
    catch (error) {
        console.error("Error verifying email:", error);
        // Handle server error during verification process
        res.status(500).send(`
      <html>
        <body>
          <h1>Server error. Please try again later.</h1>
        </body>
      </html>
    `);
    }
});
// Route handler for the 'forgot password' email verification link
app.get('/verify-email-two', async (req, res) => {
    const { token } = req.query; // Extract token from URL query params
    if (!token) {
        return res.status(400).send("Error: Token is required");
    }
    try {
        // Find the user using the forgot password token and check if it's still valid
        const user = await UserModel.findOne({
            forgotPasswordToken: token,
            forgotPasswordExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).send("Error: Invalid or expired token");
        }
        // Set a flag indicating the user is authorized to reset their password
        user.forgotPassword = true;
        user.forgotPasswordToken = ""; // Clear the temporary token
        await user.save();
        // Send success message, store email in localStorage on the client, and redirect
        res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=/forgot-password" />
          <script>
            (function() {
              // Store the user's email locally for the password reset form
              localStorage.setItem('forgotten', '${user.email}');
            })();
          </script>
        </head>
        <body>
          <h1>Email verified successfully!</h1>
          <p>You’ll be redirected in 3s…</p>
        </body>
      </html>
    `);
    }
    catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send( /* Placeholder for a server error HTML response */);
    }
});
// --- Password Reset API Route ---
// API endpoint to process the final password reset
app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body; // Extract email and new password from request body
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = await UserModel.findOne({ email }); // Find the user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Ensure the user has passed the initial forgot password verification step
        if (!user.forgotPassword) {
            return res.status(403).json({ message: 'Unauthorized reset attempt.' });
        }
        // Hash the new password and update the user's record
        user.passwordHash = await hashPassword(newPassword); // Hash and store the new password
        user.forgotPassword = false; // Clear the reset authorization flag
        user.updatedAt = new Date(); // Update the timestamp
        await user.save();
        res.status(200).json({ message: 'Password reset successful! 🎉' });
    }
    catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ message: 'Server error. Try later.' });
    }
});
// API endpoint to initiate the forgotten password flow (sends the email)
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body; // Extract email from request body
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    const token = uuidv4(); // Generate a unique token for the reset link
    console.log("Generated verification token:", token);
    const hashedToken = await hashPassword(token); // Hash the token for storage/sending
    console.log("Hashed verification token for storage.");
    const user = await UserModel.findOne({ email }); // Find the user by email
    if (!user) {
        // Fail silently or return a generic error to prevent email enumeration
        return res.status(404).json({ message: 'User not found.' });
    }
    // Store the token and set its expiration time (1 hour from now)
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = new Date(Date.now() + 3600000); // 1 hour expiration
    await user.save();
    await sendVerificationEmailTwo(email, hashedToken); // Send the reset email
    console.log("A password reset link has been sent to the user's email.");
    return res.status(200).json({ message: 'Password reset email sent.' });
});
// --- Fallback / Error Handling ---
if (!isVercel && io) {
    io.on("connection", (socket) => {
        console.log("🟢 Client connected:", socket.id);
        // You can register socket events here if needed
    });
}
// Catch-all route for any request that didn't match an existing route (404 Not Found)
app.use((req, res) => {
    res.status(404).send("Route not found");
});
// Start the server and listen on the defined PORT
if (!isVercel && server) {
    server.listen(PORT, () => {
        console.log(`talabaoasatiza Service is running on 🚀 Server + Socket.IO Port ${PORT}`);
    });
}
const handler = serverless(app);
export default isVercel ? handler : server;
//# sourceMappingURL=index.mjs.map
