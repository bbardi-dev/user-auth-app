//Used for handling all authentication logic/strategy, eg. Github Oauth, etc.

import { NextFunction, Request, Response } from "express";
import { CreateSessionInput, DeleteSessionInput } from "../schema/auth.schema";
import { signAccessToken, signRefreshToken, updateSession } from "../services/auth.service";
import { findUserByEmail } from "../services/user.service";

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
  //TODO change these for production
  res.cookie("accessToken", accessToken, {
    maxAge: 1000 * 60 * 0.5, //TODO set to 30m
    httpOnly: true,
    // domain: "localhost",
    // path: "/",
    sameSite: "lax",
    secure: false, // is it in production ? true : false
  });
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30, //set to 30d
    httpOnly: true,
    // domain: "localhost",
    // path: "/",
    sameSite: "lax",
    secure: false, // is it in production ? true : false
  });

  //send tokens to client
  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function deleteSessionHandler(
  req: Request<{}, {}, DeleteSessionInput>,
  res: Response,
  next: NextFunction
) {
  const sessionId = res.locals.user.session;

  await updateSession({ _id: sessionId }, { valid: false });

  return res
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .status(204)
    .send("User successfully logged out");
}
