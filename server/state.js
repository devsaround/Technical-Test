import { v4 as uuid } from "uuid"; // for unique ID

const orders = new Map();   // orderId -> Order
const drivers = new Map();  // driverId -> Driver

let driverQueue = [];       // queue for driversId
let pendingOrders = [] // for pending order
const orderTimers = new Map(); // orderId -> intervalId

function seedDrivers(driverList) {
  driverList.forEach((d) => {
    drivers.set(d._id, d); // register driver by id -> store in momery
    driverQueue.push(d._id); // include in queue
  });
}

function snapshot() {
    
  return {
    orders: Array.from(orders.values()),
    drivers: Array.from(drivers.values())
  };
}

// Create a new order
function createOrder() {
  const id = uuid();
  const order = {id, status: "new", progress: 0, driverId: null, createdAt: Date.now()};
  orders.set(id, order); // store in memory
  return order;
}


function nextAvailableDriver() {
  
  for (let i = 0; i < driverQueue.length; i++) {
    const driverId = driverQueue[0];
    
    driverQueue.push(driverQueue.shift());
    const d = drivers.get(driverId); 
    if (d && d.available) return d;      // return if found a free driver
  }
  return null; //return null if no one available
}

// Assign a driver to an order
function assignDriver(order) {
  const d = nextAvailableDriver();
  if (!d) {
    order.status = "pending"
    pendingOrders.push(order)
    return null;
}        
  d.available = false;        // mark driver busy
  d.activeOrderId = order.id; // link to the order
  d.progress = 0;             // reset driver progress

  order.driverId = d._id;     // link order -> driver
  order.status = "assigned";  // move order status forward
  order.progress = 0;         // reset order progress

  return d;                   // return assigned driver
}

// fake timer that increments progress till 100
function startProgress(order, onTick, onDone) {
  order.status = "in_progress"; // state change to progress
  const interval = setInterval(() => {
    
    const step = Math.floor(Math.random() * 5) + 2;

    order.progress = Math.min(100, order.progress + step);

    // drivers progress in sync
    if (order.driverId) {
      const d = drivers.get(order.driverId);
      if (d) d.progress = order.progress;
    }

    // Notify server so it can broadcast
    onTick?.();

    
    if (order.progress >= 100) { // If progress greater or equel to 100
      clearInterval(interval);          // stop timer
      orderTimers.delete(order.id);     // remove from map
      order.status = "completed";       // assign complete to status

      // mark driver as available
      if (order.driverId) {
        const d = drivers.get(order.driverId);
        if (d) {
          d.available = true;
          d.activeOrderId = null;
          d.progress = 0;

        }
      }

      onDone?.(); // notify server for a final broadcast
    }
  }, 800);

  // keep refrence if want to cancle
  orderTimers.set(order.id, interval);
}

// Cancel an order free driver, stop timer and assign canceled to status
function cancelOrder(orderId) {
  const order = orders.get(orderId);
  if (!order) return false; // nothing to do

  if (order.status === "pending") {
    pendingOrders = pendingOrders.filter(o => o.id !== orderId);
    order.status = "canceled";
    return true;
  }
  // Stop and delete timer if running
  const t = orderTimers.get(orderId);
  if (t) {
    clearInterval(t);
    orderTimers.delete(orderId);
  }

  // Free the driver if assigned
  if (order.driverId) {
    const d = drivers.get(order.driverId);
    if (d) {
      d.available = true;
      d.activeOrderId = null;
      d.progress = 0;

    }
  }


  order.status = "canceled"; //assign canceled to status
  return true;
}

// schedules assigning as many pending orders as possible to available drivers
function tryAssignPendingOrders(onTick, onDone) {
  
  while (pendingOrders.length > 0) {
    const d = nextAvailableDriver();
    if (!d) break; //when no driver available

    // take next pending order
    const order = pendingOrders.shift();
    // mark driver busy and link order
    d.available = false;
    d.activeOrderId = order.id;
    d.progress = 0;

    order.driverId = d._id;
    order.status = "assigned";
    order.progress = 0;

    startProgress(order,
      () => onTick?.(),                 
      () => {                           
        d.available = true;
        d.activeOrderId = null;
        d.progress = 0;

        tryAssignPendingOrders(onTick, onDone);

        onDone?.();
      }
    );

    onTick?.();
  }
}


export {seedDrivers, snapshot, createOrder, assignDriver, startProgress, cancelOrder, tryAssignPendingOrders}