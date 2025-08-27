import { ObjectId } from 'mongodb';

/**
 * Utility type to check if a given type has a field with
 * MongoDB `ObjectId` value type.
 */
type IfContainsObjectId<T> = {
  [K in keyof T]: T[K] extends ObjectId ? true : never;
}[keyof T] extends never
  ? false
  : true;

/**
 * You might be wondering what this is.
 *
 * Constraint: We cannot pass objects from server to client directly.
 * Because MongoDB `ObjectId`s are non-serializable objects, we
 * need to convert them to `string` type.
 *
 * Solution: This utility type recursively
 * converts object fields with MongoDB `ObjectId` value to `string`.
 */
export type TWithStringIds<EntType> = {
  // if field value is object id, convert to string
  [K in keyof EntType]: EntType[K] extends ObjectId
    ? string
    : // if field value has nested object ids, recursively parse
      IfContainsObjectId<EntType[K]> extends true
      ? TWithStringIds<EntType[K]>
      : // if field value is array with nested object ids, recursively parse each element
        EntType[K] extends Array<infer ArrayElementType>
        ? IfContainsObjectId<ArrayElementType> extends true
          ? Array<TWithStringIds<ArrayElementType>>
          : Array<ArrayElementType>
        : // otherwise, just return field value as-is
          EntType[K];
};
