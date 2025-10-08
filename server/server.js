const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./utils/db");

const stationRouter = require("./routers/station-router");
const commentRouter = require("./routers/comment-router");
const availabilityRouter = require("./routers/availability-router");
const authRouter = require("./routers/auth-router");
const adminRouter = require("./routers/admin-router")
const historyRouter = require("./routers/history-router")
const notificationRoutes = require("./routers/notification-router");

require("dotenv").config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true
};
console.log("Frontend env is : ",process.env.FRONTEND_URL)

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/stations", stationRouter);
app.use("/api/history", historyRouter);
app.use("/api/comments", commentRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/notifications", notificationRoutes);

// ✅ Ping route to prevent cold starts
app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
});


connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
