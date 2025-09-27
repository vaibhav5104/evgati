const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const connectDB = require("./utils/db");

const stationRouter = require("./routers/station-router");
const commentRouter = require("./routers/comment-router");
const availabilityRouter = require("./routers/availability-router");
const chatRouter = require("./routers/chat-router");
const authRouter = require("./routers/auth-router");
const adminRouter = require("./routers/admin-router")
const historyRouter = require("./routers/history-router")
const { saveMessage } = require("./controllers/chat-controller");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 3000;

// ---- Middlewares ----
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true
};
console.log("Frontend env is : ",process.env.FRONTEND_URL)

app.use(cors(corsOptions));
// app.options("*", cors(corsOptions)); // Handles preflight requests for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ---- API Routes ----
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stations", stationRouter);
app.use("/api/history", historyRouter);
app.use("/api/comments", commentRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/chat", chatRouter);

// ---- Socket.IO Auth Middleware ----
io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
        return next(new Error("Authentication error: Token missing"));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        socket.userId = decoded.userId;
        next();
    } catch (err) {
        console.error("Socket auth failed:", err.message);
        return next(new Error("Authentication error: Invalid token"));
    }
});

// ---- Socket.IO Events ----
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId} (socket: ${socket.id})`);

    // Join a station chat room
    socket.on("joinStation", (stationId) => {
        socket.join(stationId);
        console.log(`User ${socket.userId} joined station room ${stationId}`);
    });

    // Handle chat messages
    socket.on("chatMessage", async (data) => {
        try {
            const message = await saveMessage({
                stationId: data.stationId,
                sender_id: socket.userId, // enforce sender from token
                message: data.message
            });

            // Broadcast to all users in the same station room
            io.to(data.stationId).emit("chatMessage", message);
        } catch (err) {
            console.error("❌ Error saving chat message:", err.message);
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ User disconnected: ${socket.userId} (socket: ${socket.id})`);
    });
});

// ---- Start Server ----
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
