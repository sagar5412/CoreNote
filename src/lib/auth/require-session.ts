import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { UnauthorizedError } from "../utils/errors";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new UnauthorizedError();
  return session;
}
