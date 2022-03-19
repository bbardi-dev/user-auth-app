//Used for handling all authentication logic/strategy, eg. Github Oauth, etc.

import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { CreateSessionInput } from "../schema/auth.schema";
import { findSessionById, signAccessToken, signRefreshToken } from "../services/auth.service";
import { findUserByEmail, findUserById } from "../services/user.service";
import { verifyJwt } from "../utils/jwt";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  const message = "Invalid email or password";

  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("Please verify your email first");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  //sign access token
  const accessToken = signAccessToken(user);

  //sign refresh token
  const refreshToken = await signRefreshToken(user.id);

  //set cookies
  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 30, // set to 30m
    httpOnly: true,
    //domain: ,
    //path: "/",
    //sameSite: strict,
    //secure:  // is it in production ? true : false
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30, //set to 30d
    httpOnly: true,
    //domain: ,
    //path: "/",
    //sameSite: strict,
    //secure:  // is it in production ? true : false
  });

  //send tokens to client
  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshTokenHandler(req: Request, res: Response) {
  const refreshToken = get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

  const decoded = verifyJwt<{ session: string }>(refreshToken, "refreshTokenPublicKey");

  const rejected = res.status(401).send("Could not refresh access token");

  if (!decoded) return rejected;

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) return rejected;

  const user = await findUserById(String(session.user));

  if (!user) return rejected;

  const accessToken = signAccessToken(user);

  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 30, // set to 30m
    httpOnly: true,
    //domain: ,
    //path: "/",
    //sameSite: strict,
    //secure:  // is it in production ? true : false
  });

  return res.send({ accessToken });
}
