/* eslint-disable eol-last */
require("dotenv").config();
export const dbConfig = {
  user: process.env.NODE_ORACLEDB_USER,
  password: process.env.NODE_ORACLEDB_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING,
  poolMin: 4,
  poolMax: 4,
  poolIncrement: 0,
};
