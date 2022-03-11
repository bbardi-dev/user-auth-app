import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../services/user.service";
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
