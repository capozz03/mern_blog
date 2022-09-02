const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgress',
  password: 'root',
  host: 'localhost',
  port: 5433,
});

module.exports = pool;