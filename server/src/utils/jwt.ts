import jwt from "jsonwebtoken";
import config from "config";

type PrivateKeyName = "accessTokenPrivateKey" | "refreshTokenPrivateKey";
type PublicKeyName = "accessTokenPublicKey" | "refreshTokenPublicKey";

export function signJwt(obj: Object, keyName: PrivateKeyName, options?: jwt.SignOptions) {
  const signingKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

  return jwt.sign(obj, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}
export function verifyJwt<T>(token: string, keyName: PublicKeyName): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
}
