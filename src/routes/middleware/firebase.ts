import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FastifyRequest, FastifyReply } from "fastify";
import { app } from "../../firebase/firebase.services";
import { sign, verify } from "jsonwebtoken";

const auth = getAuth(app);

export async function authMiddleware(
  request: FastifyRequest,
  response: FastifyReply,
  next: () => void
) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    response.status(401).send("Unauthorized");
    return;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );
    const token = sign({ userId: username }, `1234`, { expiresIn: "1h" });
    const decoded = verify(token, `1234`);
    request.user = decoded;
    request.token = token;
    next();
  } catch (error) {
    response.status(401).send({ error: "Credenciais inválidas" });
  }
}
