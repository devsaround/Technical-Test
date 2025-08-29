# Order Tracker Server — Boilerplate (PR #1)

This is the minimal backend **boilerplate** for the technical test.
It runs an Express + Socket.IO server and exposes a health route and a stub state route.
**No business logic is included in this PR** (no orders, no drivers). That comes in PR #2.

## Tech

- Node.js + Express (REST)
- Socket.IO (real-time)
- CORS enabled
- ESM modules (`"type": "module"`)

## Run

```
bash
cd server
npm install
npm run dev / start
```

# Health check route
http://localhost:8001/health → ```{ "ok": true }```

# state: 
http://localhost:8001/api/state → ```{ "orders": [], "drivers": [] }```

# Open in browser to see the state event (socket.io) 
http://localhost:8001/test-client.html

# APIs in PR #1

# REST

- GET /health → ```{ ok: true }```

- GET /api/state → ```{ orders: [], drivers: [] }```

# Socket.IO

Server → Client

- ```state``` (emitted on connect): ```{ orders: [], drivers: [] }```

Client → Server

- ```get_state``` (server replies with state)

# What’s NOT here (will be PR #2)

- Creating/canceling orders

- Driver assignment + queue + pending queue

- Progress timers + real-time ticks

- Loading drivers from the JSON file