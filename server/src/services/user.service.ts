import UserModel, { User } from "../models/user.model";

export function createUser(input: Partial<User>) {
  return UserModel.create(input);
}
