import oracledb from "oracledb";
import { execute } from "../database/conn";
const packageMVM = `mvintegra.pkg_sol_limpeza.prc_consulta_solicitacao`;
// Função que irá executar a consulta no banco de dados
export const findRequestByLeito = async (cdLeito: number) => {
  const bindVars = {
    p_cursor: {
      dir: oracledb.BIND_OUT,
      type: oracledb.CURSOR,
    },
    p_cd_leito: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: cdLeito,
    },
  };
  const opts = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  };

  try {
    return await execute(
      `BEGIN ${packageMVM}(:p_cd_leito, :p_cursor); END;`,
      bindVars,
      opts
    );
  } catch (error) {
    return error.message;
  }
};
