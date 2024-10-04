import { environment } from "../../../config/config";
import {
  BindParameters,
  Connection,
  createPool,
  ExecuteOptions,
  OUT_FORMAT_OBJECT,
  Pool,
  Result,
} from "oracledb";
import logger from "../../logger";


/**
 * OracleService class
 * @class
 * @classdesc OracleService class for handling Oracle database operations.
 */
class OracleService {
  private static pool: Pool | null = null;

  public async initializePool(): Promise<void> {
    if (!OracleService.pool) {
      const connectString = `${environment.ORACLEDB_HOST}/${environment.ORACLEDB_PDB_NAME}`;
      const poolMin: number = 5;
      const poolMax: number = 20;
      const poolIncrement: number = 2;
      OracleService.pool = await createPool({
        user: environment.ORACLEDB_USER,
        password: environment.ORACLEDB_PASSWORD,
        connectString,
        poolMin,
        poolMax,
        poolIncrement,
      });
      logger.info("connection pool created");
    }
  }

  public async getConnection(): Promise<Connection> {
    if (!OracleService.pool) {
      await this.initializePool();
    }

    if (!OracleService.pool) {
      logger.error("Failed to initialize the connection pool.");
      throw new Error("Failed to initialize the connection pool.");
    }

    return await OracleService.pool.getConnection();
  }

  public async closePool(): Promise<void> {
    if (OracleService.pool) {
      await OracleService.pool.close(10);
      logger.info("Connection pool closed");
      OracleService.pool = null;
    }
  }

  public async closeConnection(connection: Connection): Promise<void> {
    await connection.close();
  }

  public async executeQuery<T>(
    query: string,
    params: BindParameters = [],
    options: ExecuteOptions = {}
  ): Promise<Result<T>> {
    let connection: Connection | null = null;

    try {
      connection = await this.getConnection();
      const result = await connection.execute<T>(query, params, {
        ...options,
        outFormat: OUT_FORMAT_OBJECT,
      });
      return result;
    } catch (error) {
      logger.error("Erro ao executar a query:", {
        error,
        query,
        params,
        options,
      });
      throw error;
    } finally {
      if (connection) {
        await this.closeConnection(connection);
      }
    }
  }

  public async executeUpsert(
    command: string,
    params: BindParameters = [],
    options: ExecuteOptions = {}
  ): Promise<number> {
    let connection: Connection | null = null;

    try {
      connection = await this.getConnection();
      await connection.execute("BEGIN TRANSACTION");
      const result = await connection.execute(command, params, options);
      await connection.commit();
      return result.rowsAffected || result.rows?.length || 0;
    } catch (error) {
      logger.error("Erro ao executar a query:", {
        error,
        command,
        params,
        options,
      });
      await connection?.execute("ROLLBACK");
      throw error;
    } finally {
      if (connection) {
        await this.closeConnection(connection);
      }
    }
  }
}

export default OracleService