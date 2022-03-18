import UserModel, { User } from "../models/user.model";

//Services layer: just for actually interacting with DB
//calls the model with the body passed on from the request
export async function createUser(input: Partial<User>) {
  return UserModel.create(input);
}

export async function findUserById(id: string) {
  return UserModel.findById(id);
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
