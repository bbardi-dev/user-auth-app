import { object, string, TypeOf } from "zod";

//Schema here is for checking that the incoming request data will match with the model that will interact with the DB
//also other misc checks like password+passwordConfirmation matching(which are not saved to DB), etc.

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "Firstname required",
    }),
    lastName: string({
      required_error: "Lastname required",
    }),
    password: string({
      required_error: "Password required",
    }).min(6, "Password should be a minimum of 6 characters"),
    passwordConfirmation: string({
      required_error: "Password confirmation required",
    }),
    email: string({
      required_error: "Email required",
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["passwordConfirmation"],
  }),
});

//Typescript type from body of Zod object for easy type safety
export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  }),
});

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];
