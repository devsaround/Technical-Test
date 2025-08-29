import express from "express";      
import http from "http";            
import cors from "cors";            
import { Server as SocketIOServer } from "socket.io"; // Socket.IO server

import { loadBaseDrivers } from "./driver.js";       // load drivers
import {
  seedDrivers, snapshot, createOrder, assignDriver, startProgress, cancelOrder,
  tryAssignPendingOrders
} from "./state.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();              
const server = http.createServer(app); // Create HTTP server on top of Express

const io = new SocketIOServer(server, { // create soket server
  cors: {
    origin: "*",                    // allow all origin
    methods: ["GET", "POST"]
  }
});

app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


const initialDrivers = loadBaseDrivers();

seedDrivers(initialDrivers);

// broadcast full snapshot to all connected clients
function pushState(event = "state") {
  io.emit(event, snapshot());       // io.emit => send to ALL connected sockets
}

// Health check route for testing
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

//expose current state
app.get("/api/state", (req, res) => {
  res.json(snapshot());
});

// create a new order
app.post("/api/orders", (req, res) => {
  const order = createOrder();      // create a new in-memory order
  const driver = assignDriver(order); // assign a driver
    
  // If a driver assigned start progress simulation
  if (driver) {
    startProgress(
        order, 
        () => pushState("tick"), 
        () => {
            tryAssignPendingOrders(
                () => pushState("tick"), 
                () => pushState("complete")),
                pushState("complete")
        },
    )
  }

  // broadcast new state to everyone so new order appears
  pushState("create");

  // return order id
  res.status(201).json({ orderId: order.id });
});

    //cancel an order by id
app.post("/api/orders/:id/cancel", (req, res) => {
  const ok = cancelOrder(req.params.id); // stop timer, free driver, mark canceled
  tryAssignPendingOrders(() => pushState("tick"), () => pushState("complete"));
  pushState("cancel");                    // broadcast to clients
  res.json({ success: ok });
});


// socket handler from here
io.on("connection", (socket) => {

  socket.emit("state", snapshot());

  socket.on("create_order", () => {
    const order = createOrder();
    const driver = assignDriver(order);
    if (driver) {
      startProgress(
        order,
        () => pushState("tick"),
        () => {
            tryAssignPendingOrders(() => pushState("tick"), () => pushState("complete")),
            pushState("complete")
        },
    )
    }
    pushState("create");
  });

  socket.on("cancel_order", (orderId) => {
    cancelOrder(orderId);
    tryAssignPendingOrders(() => pushState("tick"), () => pushState("complete"));
    pushState("cancel");
  });

  socket.on("get_state", () => {
    socket.emit("state", snapshot());
  });
});

// Start server
const PORT =  8001;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
