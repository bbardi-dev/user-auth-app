import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email required",
    }).email("Invalid email or password"),
    password: string({
      required_error: "Password required",
    }).min(6, "Invalid email or password"),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];

export const deleteSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email required",
    }).email("Invalid user"),
  }),
});

export type DeleteSessionInput = TypeOf<typeof deleteSessionSchema>["body"];
