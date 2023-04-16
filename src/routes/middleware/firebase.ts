import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FastifyRequest, FastifyReply } from "fastify";
import { app } from "../../firebase/firebase.services";
import jwt from "jsonwebtoken";

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
  const token = jwt.sign({ userId: username }, `1234`, { expiresIn: "1h" });
  const decoded = jwt.verify(token, `1234`);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );
    request.user = decoded;
    request.token = token;
    next();
  } catch (error) {
    response.status(401).send({ error: "Credenciais inválidas" });
  }
}
