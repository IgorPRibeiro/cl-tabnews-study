import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  console.log(request.method);
  if (request.method === "GET") {
    const migrationsResponse = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pg_migrations",
    });
    response.status(200).json(migrationsResponse);
  }

  if (request.method === "POST") {
    const migrationsResponse = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: false,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pg_migrations",
    });
    response.status(200).json(migrationsResponse);
  }
  return response.status(405).end();
}
