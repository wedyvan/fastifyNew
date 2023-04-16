import { execute } from "../database/conn";

export const teste = async () => {
  try {
    const result = await execute(
      `select * from dbamv.atendime a where a.DT_ATENDIMENTO = trunc(sysdate)`
    );
    return result;
  } catch (error) {
    return { message: error };
  }
};
