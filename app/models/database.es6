const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/users';

const client = new pg.Client(connectionString);
client.connect();

const query = client.query(
  'CREATE TABLE users(id SERIAL PRIMARY KEY, username VARCHAR(40) not null, email VARCHAR(40), about VARCHAR(200))');
query.on('end', () => { client.end(); });
