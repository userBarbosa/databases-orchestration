import { Document } from "./../../../../node_modules/bson/src/bson";
import { Db, FindCursor, FindOptions, MongoClient } from "mongodb";
import { environment } from "../../../config/config";
import logger from "../../logger";

/**
 * MongoService class
 * @class
 * @classdesc Singleton class to handle all MongoDB database operations
 */
class MongoService {
  private static instance: MongoService;
  private client: MongoClient;
  private database: Db;

  private constructor() {
    const databaseName: string = environment.MONGODB_DATABASE;
    const mongodbURI: string = `mongodb://${environment.MONGODB_HOST}:${environment.MONGODB_PORT}`;

    this.client = new MongoClient(mongodbURI);
    this.database = this.client.db(databaseName);
  }

  /**
   * Get the instance of the MongoService class
   * @returns {MongoService} The instance of the MongoService class
   */
  public static getInstance(): MongoService {
    if (!MongoService.instance) {
      MongoService.instance = new MongoService();
    }
    return MongoService.instance;
  }

  /**
   * Find a document in a collection
   * @param {string} collection - The name of the collection
   * @param {Record<string, unknown>} query - The query to find the document
   * @param {FindOptions} [options] - The options to find the document
   * @returns {Promise<Document | null>} - A promise that resolves with the document found
   */
  public async findFirst(
    collection: string,
    query: Record<string, unknown>,
    options?: FindOptions
  ): Promise<Document | null> {
    try {
      await this.client.connect();
      const result = await this.database
        .collection(collection)
        .findOne(query, options);
      return result;
    } catch (error) {
      logger.error("MONGO ERROR", error);
      return null;
    } finally {
      await this.client.close();
    }
  }

  /**
   * Find multiple documents in a collection
   * @param {string} collection - The name of the collection
   * @param {Record<string, unknown>} query - The query to find the documents
   * @param {FindOptions} [options] - The options to find the documents
   * @returns {Promise<Array<Document> | null>} - A promise that resolves with the documents found
   */
  public async findMultiple(
    collection: string,
    query: Record<string, unknown>,
    options?: FindOptions
  ): Promise<Array<Document> | null> {
    try {
      await this.client.connect();

      const result = await this.database
        .collection(collection)
        .find(query, options)
        .toArray();

      return result;
    } catch (error) {
      logger.error("MONGO ERROR", error);
      return null;
    } finally {
      await this.client.close();
    }
  }

  // is this too much power?
  public async execFnWithCursor(
    collection: string,
    query: Record<string, unknown>,
    callbackFn: (cursor: FindCursor) => Promise<void> | void,
    options?: FindOptions
  ): Promise<void> {
    let cursor: FindCursor | null = null;
    try {
      await this.client.connect();

      cursor = this.database.collection(collection).find(query, options);

      await callbackFn(cursor);
    } catch (error) {
      logger.error("MONGO ERROR", error);
    } finally {
      await cursor?.close();
      await this.client.close();
    }
  }
}

export default MongoService;
