import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../services/user.service";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
  const body = req.body;

  try {
    const user = await createUser(body);

    res.send("User successfully created");
  } catch (e: any) {
    if (e.code === 11000) return res.status(409).send("Account already exists");

    return res.status(500).send(e);
  }
}
