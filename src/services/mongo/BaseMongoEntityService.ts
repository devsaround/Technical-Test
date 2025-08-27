import {
  AnyBulkWriteOperation,
  BulkWriteOptions,
  BulkWriteResult,
  Collection,
  Db,
  DeleteResult,
  Document,
  Filter,
  InsertOneResult,
  ObjectId,
  OptionalUnlessRequiredId,
  WithId,
} from 'mongodb';
import { EMongoCollectionName } from './EMongoCollectionName';
import { TWithStringIds } from './TWithStringIds';
import connectToMongoClient from './connect-to-mongo';

/**
 * Entities represent any data model stored in the database.
 * This abstract class is responsible for common entity operations.
 */
export abstract class BaseMongoEntityService<EntityType extends Document> {
  public static getObjectId(): ObjectId {
    return new ObjectId();
  }

  public abstract getCollectionName(): EMongoCollectionName;
  public abstract getAsClientEntity(
    entity: EntityType
  ): TWithStringIds<EntityType>;

  public async genOne(
    queryFilter: Filter<EntityType>
  ): Promise<WithId<EntityType> | null> {
    const collection = await this.genCollection();
    return await collection.findOne(queryFilter);
  }

  public async genSampleOne(): Promise<EntityType | null> {
    const db = await this.genDb();
    return await db
      .collection(this.getCollectionName())
      .aggregate<EntityType>([
        {
          $sample: {
            size: 1,
          },
        },
      ])
      .next();
  }

  public async genMany(
    queryFilter: Filter<EntityType> = {}
  ): Promise<WithId<EntityType>[]> {
    const collection = await this.genCollection();
    return await collection.find(queryFilter).toArray();
  }

  public async genInsertOne(
    entity: OptionalUnlessRequiredId<EntityType>
  ): Promise<InsertOneResult<EntityType>> {
    const collection = await this.genCollection();
    return await collection.insertOne(entity);
  }

  public async genBulkWrite(
    operations: AnyBulkWriteOperation<EntityType>[],
    options?: BulkWriteOptions
  ): Promise<BulkWriteResult> {
    const collection = await this.genCollection();
    return await collection.bulkWrite(operations, options);
  }

  public async genDeleteAllEntities(): Promise<DeleteResult> {
    const collection = await this.genCollection();
    return await collection.deleteMany({});
  }

  protected async genCollection(): Promise<Collection<EntityType>> {
    const db = await this.genDb();
    return db.collection<EntityType>(this.getCollectionName());
  }

  protected async genDb(): Promise<Db> {
    const client = await connectToMongoClient;
    return client.db();
  }
}
