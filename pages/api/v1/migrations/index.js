import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();
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
    await dbClient.end();
    response.status(200).json(pedingMigrationResponse);
  }

  if (request.method === "POST") {
    const migratedMigrationsResponse = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrationsResponse.length > 0) {
      response.status(201).json(migratedMigrationsResponse);
    }
    response.status(200).json(migratedMigrationsResponse);
  }
  return response.status(405).end();
}
