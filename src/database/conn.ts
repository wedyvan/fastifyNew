/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

/* eslint-disable eol-last */
require("dotenv").config();
import oracledb from "oracledb";
import { dbConfig } from "./configDatabase";
const fs = require("fs");

// Caminho local para iniciar o client do banco Oracle.
let libPath;
if (process.platform === "win32") {
  // Windows
  libPath = "C:\\oracle\\instantclient_19_6";
} else if (process.platform === "darwin") {
  // macOS
  libPath = process.env.HOME + "/Downloads/instantclient_19_6";
} else {
  libPath = process.env.HOME + "/Downloads/instantclient_19_6";
}
if (libPath && fs.existsSync(libPath)) {
  oracledb.initOracleClient({ libDir: libPath });
}

export const initialize = async () => {
  try {
    await oracledb.createPool(dbConfig);
    console.log("Connection pool created successfully");
  } catch (error) {
    console.log(error.message + "\n");
  }
};

// função para finalizar o pool de conexão com o banco de dados
export const close = async () => {
  await oracledb.getPool().close(0);
  console.log("Connection pool closed successfully");
};

console.log(dbConfig);

// função para executar query SQL.
export async function execute(statement: string, binds?: {}, opts?: {}) {
  interface Row {
    [key: string]: any;
  }
  let connection;
  // objeto de parâmetros para o retorno da query
  const hasCursor = binds
    ? Object.values(binds).some((varInfo) => varInfo.type === oracledb.CURSOR)
    : false;

  try {
    connection = await oracledb.getConnection();
    // realizando conexão no banco de dados
    // Verificando se existe um cursor passado no parâmetro da consulta
    if (hasCursor) {
      const result = await connection.execute(statement, binds, opts);
      const resultSet = result.outBinds.p_cursor;

      const row = await resultSet.getRows();
      await resultSet.close();
      return row;
    } else if (binds === undefined || binds === null) {
      const result = await connection.execute(statement); // executar consulta no banco de dados
      //Percorrendo o retorna do consulta e retornando as colunas com seu valor como um array
      const rows: Row[] = [];
      result.rows?.forEach((row) => {
        const obj: Row = {};
        result.metaData?.forEach((meta: Row = {}, index: number) => {
          obj[meta.name] = row[index];
        });
        rows.push(obj);
      });
      return rows;
    } else {
      const result = await connection.execute(statement, binds, opts); // executar consulta no banco de dados

      return result;
    }
  } catch (err) {
    if (err.message.includes("ORA-01403")) {
      return { error: "Nenhum Registro Encontrado" };
    }
    return { error: err.message };
    // Retornar objeto de erro com status HTTP correspondente
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
        // Retornar objeto de erro com status HTTP correspondente
        return { error: err.message, statusCode: 500 };
      }
    }
  }
}
