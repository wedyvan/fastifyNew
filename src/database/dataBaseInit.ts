import { initialize, close } from "./conn";

/* eslint-disable require-jsdoc */

//const defaultThreadPoolSize = 4;

// Increase thread pool size by poolMax
// !!! Note: On Windows this won't have an effect. Instead the variable must be set before Node.js is started !!!
//process.env.UV_THREADPOOL_SIZE = dbConfig.hrPool.poolMax + defaultThreadPoolSize;

// função para iniciar o pool de conexão com o banco de dados.
export const startup = async () => {
  console.log("Starting application");

  try {
    console.log("Initializing database module");

    await initialize();
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }
};

// função para finalizar o pool de conexao com o banco de dados caso aconteça algum erro.
export async function shutdown(e?: Error) {
  let err = e;

  try {
    console.log("Closing database module");

    await close();
  } catch (e) {
    console.error(e);

    err = err || e;
  }

  console.log("Exiting process");

  if (err) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.once("SIGTERM", () => {
  console.log("Received SIGTERM");

  shutdown();
});

process.once("SIGINT", () => {
  console.log("Received SIGINT");
  shutdown();
});
process.once("uncaughtException", (err) => {
  console.log("Uncaught exception");
  console.error(err);

  shutdown(err);
});
