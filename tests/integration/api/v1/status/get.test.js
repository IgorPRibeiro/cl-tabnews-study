test("Get to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdateAt);

  const dependeciesDatabaseBody = responseBody.dependecies.database;
  const parseVersion = dependeciesDatabaseBody.version;
  expect(parseVersion).toEqual("16.0");

  const parseMaxConnections = dependeciesDatabaseBody.max_connections;
  expect(parseMaxConnections).toEqual(100);

  const parseOpenedConnections = dependeciesDatabaseBody.opened_connections;
  expect(parseOpenedConnections).toEqual(1);
});
