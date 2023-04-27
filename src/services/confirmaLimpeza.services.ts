import oracledb from "oracledb";
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

const BIND_IN = oracledb.BIND_IN;
const NUMBER = oracledb.NUMBER;
const DATE = oracledb.DATE;
const STRING = oracledb.STRING;

const bindVars = {
  pCdSolicitacao: { dir: BIND_IN, type: NUMBER },
  pCdTpLimpeza: { dir: BIND_IN, type: NUMBER },
  pCdFuncionario: { dir: BIND_IN, type: NUMBER },
  pCdTxtMensagem: { dir: oracledb.BIND_OUT, type: STRING, maxSize: 200 },
};

export const updateClean = async (params: IUpdateCleanParams) => {
  const { cd_solicitacao, cd_tpLimpeza, cd_funcionario } = params;
  const variables = {
    pCdSolicitacao: cd_solicitacao,
    pCdTpLimpeza: cd_tpLimpeza,
    pCdFuncionario: cd_funcionario,
  };
  const sql = `BEGIN ${packageMV}(:pCdSolicitacao, :pCdTpLimpeza, :pCdFuncionario, :pCdTxtMensagem); END;`;
  try {
    const opts = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    };
    const resultado = await execute(sql, { ...bindVars, ...variables }, opts);
    const resultSet = resultado.outBinds.pCdTxtMensagem;
    console.log("🚀 ~ file: confirmaLimpeza.services.ts:40 ~ updateClean ~ resultSet:", resultSet)
    return {Message: resultSet}
  } catch (error) {
    throw new Error(
      `Erro ao atualizar a limpeza da solicitação ${cd_solicitacao}: ${error.message}`
    );
  }
};
