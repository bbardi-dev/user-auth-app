import UserModel, { User } from "../models/user.model";

//Services layer: just for actually interacting with DB
//calls the model with the body passed on from the request
export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
