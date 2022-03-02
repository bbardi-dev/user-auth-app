import { object, string, TypeOf } from "zod";

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

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
