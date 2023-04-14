import * as oracledb from 'oracledb';
import { execute } from '../database/database';

export const findLeitosVagos = async () => {
    const bindVars = {
        p_cursor: {
            dir: oracledb.BIND_OUT,
            type: oracledb.CURSOR,
          }
    };
    const opts = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      };

    try {
        return(execute(`begin :p_cursor := mvintegra.pkg_sol_limpeza.consultar_leitos(); end;`, bindVars, opts));
    } catch (error) {
        return error.message;
    }
}