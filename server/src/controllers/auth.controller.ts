//Used for handling all authentication logic/strategy, eg. Github Oauth, etc.

import { NextFunction, Request, Response } from "express";
import { CreateSessionInput } from "../schema/auth.schema";
import { signAccessToken, signRefreshToken } from "../services/auth.service";
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
  const refreshToken = signRefreshToken(user.id);

  //send tokens to client
  return res.send({
    accessToken,
    refreshToken,
  });
}
