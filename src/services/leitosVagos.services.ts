import oracledb from "oracledb";
import { execute } from "../database/conn";

const functionMV = `mvintegra.pkg_sol_limpeza.consultar_leitos()`;

export const findLeitosVagos = async () => {
  const bindVars = {
    p_cursor: {
      dir: oracledb.BIND_OUT,
      type: oracledb.CURSOR,
    },
  };
  const opts = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  };

  try {
    const result = await execute(
      `begin :p_cursor := ${functionMV}; end;`,
      bindVars,
      opts
    );
    return result;
  } catch (error) {
    return error.message;
  }
};
