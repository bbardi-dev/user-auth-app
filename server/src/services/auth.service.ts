import { DocumentType } from "@typegoose/typegoose";
import { SessionModel } from "../models/auth.model";
import { User } from "../models/user.model";
import { signJwt } from "../utils/jwt";

export async function createSession(userId: string) {
  return SessionModel.create({ user: userId });
}
export async function signRefreshToken(userId: string) {
  const session = await createSession(userId);
  const refreshToken = signJwt({ session: session._id }, "refreshTokenPrivateKey");
  return refreshToken;
}
export function signAccessToken(user: DocumentType<User>) {
  const payload = user.toJSON();
  const accessToken = signJwt(payload, "accessTokenPrivateKey");
  return accessToken;
}
