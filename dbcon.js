var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_grigoris',
  password        : '9573',
  database        : 'cs340_grigoris'
});
module.exports.pool = pool;
