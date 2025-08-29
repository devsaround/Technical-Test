import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";

import { snapshot } from "./state.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(cors());

//serve static page
app.use(express.static(path.join(__dirname, "public")));

// simple broadcast
function pushState(event = "state") {
  io.emit(event, snapshot());
}

// health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// state endpoint empty data for now
app.get("/api/state", (_req, res) => res.json(snapshot()));

// sockets skeleton
io.on("connection", (socket) => {
  // send empty snapshot
  socket.emit("state", snapshot());

  socket.on("get_state", () => socket.emit("state", snapshot()));
});

const PORT =  8001;
server.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
