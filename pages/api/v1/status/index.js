import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const versionDatabase = await database.query("SHOW server_version;");
  const databaseVersionValue = versionDatabase.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnections = await database.query({
    text: `SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;`,
    values: [databaseName],
  });

  const databaseOpenedConnectionsLenght =
    databaseOpenedConnections.rows[0].count;

  response.status(200).json({
    updated_at: updateAt,
    dependecies: {
      database: {
        version: databaseVersionValue,
        max_connections: +databaseMaxConnectionsValue,
        opened_connections: +databaseOpenedConnectionsLenght,
      },
    },
  });
}

export default status;
