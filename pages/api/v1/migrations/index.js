import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method ${request.method} not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient: dbClient,
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pg_migrations",
    };
    if (request.method === "GET") {
      const pedingMigrationResponse = await migrationRunner(
        defaultMigrationOptions,
      );
      response.status(200).json(pedingMigrationResponse);
    }

    if (request.method === "POST") {
      const migratedMigrationsResponse = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      if (migratedMigrationsResponse.length > 0) {
        response.status(201).json(migratedMigrationsResponse);
      }
      response.status(200).json(migratedMigrationsResponse);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}
