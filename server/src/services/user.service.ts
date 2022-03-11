import UserModel, { User } from "../models/user.model";

//separate layer just to interact with the DB, calls the model with the body passed on from the request
export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}
