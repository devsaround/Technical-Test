# Order Tracker Server — Business Logic (PR #2)

This PR builds on top of [PR #1 Boilerplate](../feat/server-boilerplate) by adding the **order and driver business logic**.  
It implements in-memory state management, round-robin driver assignment, simulated progress, cancellation handling, and real-time streaming updates.

---

## Tech stack

- Node.js + Express (REST APIs)
- Socket.IO (real-time)
- CORS enabled
- In-memory storage (Maps & Arrays)
- `uuid` for unique order IDs

---

## Project structure

server/
index.js # Express + Socket.IO server wiring
state.js # core business logic (orders, drivers, scheduler, timers)
driver.js # load and normalize drivers from JSON
data/
order-tracker.drivers.json
public/
test-client.html # optional UI for manual testing
package.json
.gitignore
README.md


---

## Setup & Run

```bash
cd server
npm install
npm run dev    # or: npm start
```
### Dependencies added in PR #2

- uuid (unique order IDs)

### APIs REST
``` GET /health```
Health check → ```{ ok: true }```

```GET /api/state```

Returns full snapshot of orders and drivers.

```
{
  "orders": [...],
  "drivers": [...]
}
```

```POST /api/orders```

Create a new order.

If a driver is available, assigns immediately and starts progress.

If no driver is available, queues order as pending.

Response:
```{ "orderId": "some-uuid" }```

```POST /api/orders/:id/cancel```

#### Cancel an existing order.

If pending → removed from queue.

If in-progress → frees driver, driver may pick up a pending order.

Response:
```{ "success": true }```

#### Socket.IO
Open this in browser to test socket.io and view progress —
``` http://localhost:8001/test-client.html ```

Click ```create order ```

#### Server → Client events

```state``` — full snapshot of orders + drivers

```tick``` — periodic progress updates (order + driver progress)

```create``` — new order created

```cancel``` — order canceled

```complete``` — order finished


#### Client → Server events

```create_order``` — create a new order (same as REST)

```cancel_order``` — cancel order by ID

```get_state``` — request fresh snapshot

#### Order lifecycle

#### Create order

Status: ```new```

If driver available → immediately ```assigned```

If no driver → ```pending```

#### Assigned

Status: ```assigned```

Progress starts via timer

Driver marked unavailable

#### In progress

Status: ```in_progress```

Progress increments 2–6% every 0.8s

Both order and driver progress kept in sync

#### Completed

Status: ```completed```

Driver freed, becomes available

Scheduler assigns next pending order (if any)

#### Canceled

Status: ```canceled```

If pending: removed from queue

If in-progress: driver freed, next pending order assigned


### Key logic

- ```createOrder()```: creates new order with UUID

- ```assignDriver(order)```: assigns next available driver

- ```startProgress(order, onTick, onDone)```: simulates order progress

- ```cancelOrder(orderId)```: cancels order, frees driver, removes timers

- ```tryAssignPendingOrders()```: scheduler, assigns pending orders as drivers free

- ```snapshot()```: returns current state (orders + drivers)

- ```loadBaseDrivers()```: loads driver JSON, normalizes IDs, sets availability

### Assumptions

- In-memory only (no DB, data resets on restart)

- Drivers assigned fairly with round-robin

- Random progress increments (2–6%) simulate real-time

- Multiple clients stay consistent with Socket.IO broadcasts

- Skips canceled orders in pending queue

- Prevents duplicate orders in pending queue

