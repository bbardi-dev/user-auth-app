import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt";

export default async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const accessToken =
    get(req, "cookies.accessToken") || (req.headers.authorization ?? "").replace(/^Bearer\s/, "");

  if (!accessToken) return next();

  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
}
