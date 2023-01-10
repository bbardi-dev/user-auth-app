import mongoose from "mongoose";
import supertest from "supertest";
import * as UserService from "../services/user.service";
import createServer from "../utils/createServer";

const app = createServer();

const userInput = {
  email: "john@doe.com",
  name: "John Doe",
  password: "Password123",
  passwordConfirmation: "Password123",
};

const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  _id: userId,
  email: "john@doe.com",
  name: "John Doe",
};

describe("user", () => {
  //user registration
  //username & password validation works correctly
  //passwords match
  //error handler works
  describe("create user route", () => {
    describe("given the username and password are valid", () => {
      it("should return a user payload", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app).post("/api/users/create").send(userInput);
        expect(statusCode).toBe(200);
        expect(body.body).toEqual(userInput);
        expect(body.message).toEqual("User created successfully!");
        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });
    describe("given the passwords do not match", () => {
      it("should return 400", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode } = await supertest(app)
          .post("/api/users/create")
          .send({ ...userInput, passwordConfirmation: "doesnotmatch" });
        expect(statusCode).toBe(400);
        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });
    describe("given the user service throws", () => {
      it("should return error with status 500", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          //@ts-ignore
          .mockRejectedValueOnce(":(");

        const { statusCode } = await supertest(app).post("/api/users/create").send(userInput);

        expect(statusCode).toBe(500);
        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  //get current user
  describe("get user route", () => {
    describe("", () => {});
  });
});
