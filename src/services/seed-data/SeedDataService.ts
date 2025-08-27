import { AnyBulkWriteOperation, ObjectId } from 'mongodb';
import { EntityDriversService } from '../order-tracker/drivers/EntityDriversService';
import {
  IEntityDriver,
  IGeoPoint,
} from '../order-tracker/drivers/IEntityDriver';

async function delay(numSeconds: number) {
  return new Promise((resolve) => setTimeout(resolve, numSeconds * 1000));
}

const MAX_DRIVERS_TO_CREATE = 10;
const MAX_DRIVER_RADIUS_MILES = 10;

export abstract class SeedDataService {
  public static async genHasSeedData(): Promise<boolean> {
    await delay(1);
    const driversEntityService = new EntityDriversService();
    const driver = await driversEntityService.genSampleOne();
    return driver != null;
  }

  public static async genCreateSeedDrivers(): Promise<IEntityDriver[]> {
    // prepare mock data
    const numDriversToCreate = Math.floor(
      Math.random() * MAX_DRIVERS_TO_CREATE + 1
    );
    const driverPayloads = await Promise.all(
      Array.from({ length: numDriversToCreate }).map(() =>
        this.genDriverEntity()
      )
    );
    const bulkWritePayloads: AnyBulkWriteOperation<IEntityDriver>[] =
      driverPayloads.map((driver) => ({
        insertOne: {
          document: driver,
        },
      }));

    // write mock data
    const driversEntityService = new EntityDriversService();
    await driversEntityService.genBulkWrite(bulkWritePayloads);
    return driversEntityService.genMany();
  }

  public static async genDeleteSeedDrivers(): Promise<void> {
    const driversEntityService = new EntityDriversService();
    await driversEntityService.genDeleteAllEntities();
  }

  private static async genDriverEntity(): Promise<IEntityDriver> {
    const homeLocationPoint = this.getDriverEntityHomeLocationPoint();
    const drivingRadiusMiles = this.getDriverEntityDrivingRadiusMiles();
    return {
      _id: new ObjectId(),
      home_location_point: homeLocationPoint,
      driving_radius_miles: drivingRadiusMiles,
    };
  }

  private static getDriverEntityHomeLocationPoint(): IGeoPoint {
    const lat = Math.min(Math.random() * 181 - 90, 90);
    const long = Math.min(Math.random() * 361 - 180, 180);
    return {
      type: 'Point',
      coordinates: [lat, long],
    };
  }

  private static getDriverEntityDrivingRadiusMiles(): number {
    return parseFloat((Math.random() * MAX_DRIVER_RADIUS_MILES).toFixed(2));
  }
}
