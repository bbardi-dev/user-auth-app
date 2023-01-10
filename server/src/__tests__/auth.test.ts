import mongoose from "mongoose";
import * as UserController from "../controllers/user.controller";
import * as AuthController from "../controllers/auth.controller";

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "john@doe.com",
  name: "John Doe",
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2022-11-30T13:31:07.674Z"),
  updatedAt: new Date("2022-12-10T13:31:07.674Z"),
  __v: 0,
};

describe("auth", () => {
  //creating a user session
  //user can login with email and password
  describe("login route, create user session", () => {
    it("should ", () => {
      expect(false).toBe(false);
    });
  });
  describe("logout route, delete user session", () => {
    it("should ", () => {
      expect(false).toBe(false);
    });
  });
});
