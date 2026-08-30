import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRIVERS_JSON_PATH = path.join(
  __dirname,
  '..',
  'data',
  'order-tracker.drivers.json'
);

function loadBaseDrivers() {
  const raw = fs.readFileSync(DRIVERS_JSON_PATH, 'utf8');
  
  const list = JSON.parse(raw);

  return list.map((d) => ({
      ...d,
    _id: String(d._id.$oid),
    available: true,
    activeOrderId: null,
    progress: 0,
  }));
}

export {loadBaseDrivers}