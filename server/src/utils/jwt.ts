import jwt from "jsonwebtoken";
import config from "config";

type PrivateKeyName = "accessTokenPrivateKey" | "refreshTokenPrivateKey";
type PublicKeyName = "accessTokenPublicKey" | "refreshTokenPublicKey";

export function signJwt(obj: Object, keyName: PrivateKeyName, options?: jwt.SignOptions) {
  const privateKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

  try {
    return jwt.sign(obj, privateKey, {
      ...(options && options),
      algorithm: "RS256",
    });
  } catch (error) {
    //@ts-ignore
    console.error(error.message);
    return null;
  }
}
export function verifyJwt<T>(token: string, keyName: PublicKeyName): T | null {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    //@ts-ignore
    console.error(error.message);
    return null;
  }
}
