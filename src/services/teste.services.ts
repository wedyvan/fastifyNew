import { execute } from "../database/conn";
import oracledb from "oracledb";

const procGerarSenha = `mvintegra.pr_gerar_senha_sematendimento`
export const teste = async () => {
  const bindVars = {
    p_cursor: {
      dir: oracledb.BIND_OUT,
      type: oracledb.CURSOR,
    },
    p_cd_maquina: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: 'TOTEM01CHECKIN',
    },
    p_cd_fila: {
      dir: oracledb.BIND_IN,
      type: oracledb.NUMBER,
      val: 9,
    },
    p_tp_fila: {
      dir: oracledb.BIND_IN,
      type: oracledb.STRING,
      val: '3',
    },
    p_txt_mensagem: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING,
    },
    p_valido: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING
    },
    p_senha: {
      dir: oracledb.BIND_OUT,
      type: oracledb.STRING
    },
  };
  const opts = {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  };

  try {
    const result = await execute(
      `BEGIN ${procGerarSenha}(:p_cd_maquina, :p_cd_fila, :p_tp_fila, :p_valido, :p_txt_mensagem, :p_cursor, :p_senha); END;`,
      bindVars,
      opts
    );
    if (result[1].p_txt_mensagem === null) {
      return ({Senha:result[1].p_senha})
    }
    return ({Message: result[1].p_txt_mensagem});
  } catch (error) {
    return { message: error };
  }
};
