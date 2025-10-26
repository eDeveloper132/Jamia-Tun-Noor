// ./src/index.mts
import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectToDatabase from "./config/db/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import attendanceRoutes from "./routes/attendance.js";
import taskRoutes from "./routes/tasks.js";
import examRoutes from "./routes/exams.js";
import { requireAuth, requireRole } from "./utils/authMiddleware.js";
import { UserModel } from "./models/User.js";
import { hashPassword } from "./utils/hash.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmailTwo } from "./utils/mailer.js";
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());
await connectToDatabase();
// If you want to expose static assets but NOT at root, mount them under /public:
app.use(express.static(path.join("public")));
// --- Protected root route: middleware(s) + handler
app.get("/", requireAuth, requireRole(["student", "teacher"]), (req, res) => {
    return res.sendFile(path.resolve("public", "protected", "index.html"));
});
// Routes (API)
app.get("/login", (req, res) => {
    res.sendFile(path.resolve("public", "auth", "signin.html"));
});
app.get("/signup", (req, res) => {
    res.sendFile(path.resolve("public", "auth", "signup.html"));
});
app.get("/logout", (req, res) => {
    res.clearCookie("token"); // use 'token' if that's what you set at login
    return res.status(200).json({ message: "Logged out successfully" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/exams", examRoutes);
app.get('/verify-email', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send(`
      <html>
        <body>
          <h1>Verification token is required.</h1>
        </body>
      </html>
    `);
    }
    try {
        // Find the user with the matching verification token and check if it's still valid
        const user = await UserModel.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).send(`
        <html>
          <body>
            <h1>Invalid or expired token.</h1>
          </body>
        </html>
      `);
        }
        // Mark the user as verified
        user.isEmailVerified = true;
        user.verificationToken = "";
        // Clear the token expiry
        await user.save();
        // Send the success message with a redirect after 3 seconds
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
        res.status(500).send(`
      <html>
        <body>
          <h1>Server error. Please try again later.</h1>
        </body>
      </html>
    `);
    }
});
app.get('/verify-email-two', async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send("Error: Token is required");
    }
    try {
        const user = await UserModel.findOne({
            forgotPasswordToken: token,
            forgotPasswordExpiry: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).send("Error: Invalid or expired token");
        }
        user.forgotPassword = true;
        user.forgotPasswordToken = "";
        await user.save();
        // 🎉 Verified – stash email and redirect
        res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="3;url=/forgot-password" />
          <script>
            (function() {
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
        res.status(500).send( /* … */);
    }
});
app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // ensure they went through the forgot flow
        if (!user.forgotPassword) {
            return res.status(403).json({ message: 'Unauthorized reset attempt.' });
        }
        // hash + save new
        user.passwordHash = await hashPassword(newPassword);
        user.forgotPassword = false;
        user.updatedAt = new Date();
        await user.save();
        res.status(200).json({ message: 'Password reset successful! 🎉' });
    }
    catch (error) {
        console.error('Reset error:', error);
        res.status(500).json({ message: 'Server error. Try later.' });
    }
});
app.get('/forgot-password', (req, res) => {
    res.sendFile(path.resolve('public', 'auth', 'reset-password.html'));
});
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }
    const token = uuidv4();
    console.log("Generated verification token:", token);
    const hashedToken = await hashPassword(token);
    console.log("Hashed verification token for storage.");
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordExpiry = new Date(Date.now() + 3600000);
    await user.save();
    await sendVerificationEmailTwo(email, hashedToken);
    console.log("A password reset link has been sent to the user's email.");
    return res.status(200).json({ message: 'Password reset email sent.' });
});
app.use((req, res) => {
    res.status(404).send("Route not found");
});
app.listen(PORT, () => {
    console.log(`talabaoasatiza Service is running on port ${PORT}`);
});
//# sourceMappingURL=index.mjs.map