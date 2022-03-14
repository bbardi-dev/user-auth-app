import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { CreateUserInput, ForgotPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById } from "../services/user.service";
import log from "../utils/logger";
import sendEmail from "../utils/mailer";

//last layer that interacts with the client, after all checking is done calls the service that interacts with DB
//handles emailing for user verification code if successfully saved
export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
  const body = req.body;
  try {
    const user = await createUser(body);
    const testMail = {
      from: "test@test.com",
      to: user.email,
      subject: "Verify your email",
      text: `Your verification code is: ${user.verificationCode}`,
    };

    await sendEmail(testMail);

    res.send("User successfully created");
  } catch (e: any) {
    if (e.code === 11000) return res.status(409).send("Account already exists");

    return res.status(500).send(e);
  }
}

//
export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  //find user by ID
  const user = await findUserById(id);

  if (!user) return res.send("Could not find user");
  //check to see if already verified
  if (user.verified) return res.send("User already verified");

  //check to see if verificationCode matches/is correct
  if (user.verificationCode === verificationCode) {
    user.verified = true;
    await user.save();
    return res.send("User successfully verified");
  }

  return res.send("Could not verify user");
}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
  const message = "If a user with given email is registered, you will receive a password reset email";
  const { email } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    log.debug(`User with email ${email} does not exist`);
    return res.send(message);
  }
  if (!user.verified) return res.send("User not verified");

  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  await user.save();

  await sendEmail({
    to: user.email,
    from: "test@test.com",
    subject: "Password reset",
    text: `Password reset code is: ${passwordResetCode}, user id is: ${user._id}`,
  });

  log.debug(`Password reset email sent to ${user.email}`);

  return res.send(message);
}
