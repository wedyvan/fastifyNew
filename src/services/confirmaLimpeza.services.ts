import * as oracledb from 'oracledb';
import { execute } from '../database/database';

export interface IUpdateCleanParams {
  solicitacao: number;
  cd_tpLimpeza: number;
  cd_funcionario: number;
}

export interface IUpdateCleanResult {
  mensagem: string;
}

export const updateClean = async (params: IUpdateCleanParams): Promise<IUpdateCleanResult> => {
  const { solicitacao, cd_tpLimpeza, cd_funcionario } = params;
  
  try {
    const result = await execute('BEGIN mvintegra.pkg_sol_limpeza.prc_confirmar_solicitacao(:pCdSolicitacao, :pCdTpLimpeza, :pCdFuncionario, :pTxtMensagem); END;', {
      pCdSolicitacao: solicitacao,
      pCdTpLimpeza: cd_tpLimpeza,
      pCdFuncionario: cd_funcionario,
      pTxtMensagem: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
    }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
    return { mensagem: result.outBinds.pTxtMensagem[0] };
  } catch (error) {
    throw new Error(`Erro ao atualizar a limpeza da solicitação ${solicitacao}: ${error.message}`);
  }
};
