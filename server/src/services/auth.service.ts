import { DocumentType } from "@typegoose/typegoose";
import { FilterQuery, UpdateQuery } from "mongoose";
import { omit } from "lodash";
import { SessionModel } from "../models/auth.model";
import { privateFields, User } from "../models/user.model";
import { signJwt } from "../utils/jwt";

export async function createSession(userId: string) {
  return SessionModel.create({ user: userId });
}
export async function updateSession(
  query: FilterQuery<typeof SessionModel>,
  update: UpdateQuery<typeof SessionModel>
) {
  return SessionModel.updateOne(query, update);
}
export async function findSessionById(sessionId: string) {
  return SessionModel.findById(sessionId);
}

export async function signRefreshToken(userId: string) {
  const session = await createSession(userId);
  const refreshToken = signJwt({ session: session._id }, "refreshTokenPrivateKey", { expiresIn: "30d" });
  return refreshToken;
}
export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);
  const accessToken = signJwt(payload, "accessTokenPrivateKey", { expiresIn: "30m" });
  return accessToken;
}
