import { config } from "dotenv";

config();

type Environment = {
  API_PORT: number;

  ORACLEDB_PORT: number;
  ORACLEDB_PDB_NAME: string;
  ORACLEDB_HOST: string;
  ORACLEDB_USER: string;
  ORACLEDB_PASSWORD: string;

  MONGODB_HOST: string;
  MONGODB_PORT: number;
  MONGODB_USERNAME: string;
  MONGODB_PASSWORD: string;
  MONGODB_DATABASE: string;

  KEYCLOAK_ADMIN: string;
  KEYCLOAK_ADMIN_PASSWORD: string;
  KEYCLOAK_DB_USER: string;
  KEYCLOAK_DB_PASSWORD: string;
  KEYCLOAK_DB_SCHEMA: string;
  KEYCLOAK_PORT: number;

  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT: string;
  KEYCLOAK_URL: string;
};

export const environment: Environment = {
  API_PORT: parseInt(process.env.API_PORT || "4000"),
  ORACLEDB_PORT: parseInt(process.env.ORACLEDB_PORT || "1521"),
  MONGODB_PORT: parseInt(process.env.MONGODB_PORT || "27017"),
  ORACLEDB_HOST: process.env.ORACLEDB_HOST || "",
  MONGODB_HOST: process.env.MONGODB_HOST || "",
  ORACLEDB_USER: process.env.ORACLEDB_USER || "",
  ORACLEDB_PASSWORD: process.env.ORACLEDB_PASSWORD || "",
  MONGODB_USERNAME: process.env.MONGODB_USERNAME || "",
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || "",
  ORACLEDB_PDB_NAME: process.env.ORACLEDB_PDB_NAME || "",
  MONGODB_DATABASE: process.env.MONGODB_DATABASE || "",
  KEYCLOAK_ADMIN: process.env.KEYCLOAK_ADMIN || "",
  KEYCLOAK_ADMIN_PASSWORD: process.env.KEYCLOAK_ADMIN_PASSWORD || "",
  KEYCLOAK_DB_USER: process.env.KEYCLOAK_DB_USER || "",
  KEYCLOAK_DB_PASSWORD: process.env.KEYCLOAK_DB_PASSWORD || "",
  KEYCLOAK_DB_SCHEMA: process.env.KEYCLOAK_DB_SCHEMA || "",
  KEYCLOAK_PORT: parseInt(process.env.KEYCLOAK_PORT || "8080"),
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || "",
  KEYCLOAK_CLIENT: process.env.KEYCLOAK_CLIENT || "",
  KEYCLOAK_URL: process.env.KEYCLOAK_URL || "",
};
