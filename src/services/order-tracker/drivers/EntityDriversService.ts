import { TWithStringIds } from '@/services/mongo/TWithStringIds';
import { BaseMongoEntityService } from '../../mongo/BaseMongoEntityService';
import { EMongoCollectionName } from '../../mongo/EMongoCollectionName';
import { IEntityDriver } from './IEntityDriver';

export class EntityDriversService extends BaseMongoEntityService<IEntityDriver> {
  public getAsClientEntity(
    entity: IEntityDriver
  ): TWithStringIds<IEntityDriver> {
    return {
      ...entity,
      _id: entity._id.toString(),
    };
  }

  public getCollectionName(): EMongoCollectionName {
    return EMongoCollectionName.DRIVER;
  }
}
