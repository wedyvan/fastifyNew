import * as oracledb from "oracledb";
import { execute } from "../database/conn";

export interface IUpdateCleanParams {
  cd_solicitacao: number;
  cd_tpLimpeza: number;
  cd_funcionario: number;
}
export interface IUpdateCleanResult {
  mensagem: string;
}
const packageMV = "mvintegra.pkg_sol_limpeza.prc_confirmar_solicitacao";

export const updateClean = async (params: IUpdateCleanParams) => {
  const { cd_solicitacao, cd_tpLimpeza, cd_funcionario } = params;

  try {
    const bindVars = {
      pCdSolicitacao: {
        dir: oracledb.BIND_IN,
        type: oracledb.NUMBER,
        val: cd_solicitacao,
      },
      pCdTpLimpeza: {
        dir: oracledb.BIND_IN,
        type: oracledb.NUMBER,
        val: cd_tpLimpeza,
      },
      pCdFuncionario: {
        dir: oracledb.BIND_IN,
        type: oracledb.NUMBER,
        val: cd_funcionario,
      },
      pCdTxtMensagem: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 200,
      },
    };
    const opts = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    };
    const result = await execute(
      `BEGIN ${packageMV}(:pCdSolicitacao, :pCdTpLimpeza, :pCdFuncionario, :pCdTxtMensagem); END;`,
      bindVars,
      opts
    );
    const resultSet = result.outBinds.pCdTxtMensagem;
    return resultSet;
  } catch (error) {
    throw new Error(
      `Erro ao atualizar a limpeza da solicitação ${solicitacao}: ${error.message}`
    );
  }
};
