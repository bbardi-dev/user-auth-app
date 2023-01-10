import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { findSessionById, signAccessToken } from "../services/auth.service";
import { findUserById } from "../services/user.service";
import { verifyJwt } from "../utils/jwt";

export default async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const accessToken =
    get(req, "cookies.accessToken") || (req.headers.authorization ?? "").replace(/^Bearer\s/, "");

  const refreshToken = get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  if (!refreshToken) return next();

  if (!accessToken) {
    const newAccessToken = await refreshTokenHandler(refreshToken);
    res.cookie("accessToken", newAccessToken, {
      maxAge: 1000 * 60 * 0.5, //TODO set to 30m
      httpOnly: true,
      //domain: ,
      //path: "/",
      //sameSite: strict,
      //secure:  // is it in production ? true : false
    });
    if (!newAccessToken) {
      return next();
    }
    const decoded = verifyJwt(newAccessToken, "accessTokenPublicKey");

    if (decoded) {
      res.locals.user = decoded;
    }
    return next();
  } else {
    const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

    if (decoded) {
      res.locals.user = decoded;
    }

    return next();
  }
}

export async function refreshTokenHandler(refreshToken: string) {
  const decoded = verifyJwt<{ session: string }>(refreshToken, "refreshTokenPublicKey");

  if (!decoded) return null;

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) return null;

  const user = await findUserById(String(session.user));

  if (!user) return null;

  const accessToken = signAccessToken(user);

  return accessToken;
}
