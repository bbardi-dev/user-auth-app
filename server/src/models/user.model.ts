import { DocumentType, getModelForClass, modelOptions, pre, prop, Severity } from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import argon2 from "argon2";
import log from "../utils/logger";

//Mongoose model for interacting with MongoDB, class and decorator syntax coming from Typegoose for better TS exp.
//pre function - runs before every "save" action on UserModel,
//if the password is modified, hash the password - only hashed pass is stored in DB
@pre<User>("save", async function () {
  if (!this.isModified("password")) return;

  const hash = await argon2.hash("this.password");

  this.password = hash;

  return;
})
//Options: "The timestamps option tells Mongoose to assign createdAt and updatedAt fields to your schema. The type assigned is Date."
//  What is a SchemaType?
//You can think of a Mongoose schema as the configuration object for a Mongoose model. A SchemaType is then a configuration object for an individual property.
//A SchemaType says what type a given path should have, whether it has any getters/setters, and what values are valid for that path.
//Mixed: An "anything goes" SchemaType. Mongoose will not do any casting on mixed paths
//Allow -> if the inferred type cannot be set otherwise, uses Mixed
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email!: string;

  @prop({ required: true })
  firstName!: string;
  @prop({ required: true })
  lastName!: string;

  @prop({ required: true })
  password!: string;
  @prop({ required: true, default: () => nanoid() })
  verificationCode!: string;

  @prop()
  passwordResetCode?: string | null;

  @prop({ default: false })
  verified!: boolean;

  async validatePassword(this: DocumentType<User>, passwordSuppliedByUser: string) {
    //verifies the unhashed incoming pass against the hashed in DB
    try {
      return await argon2.verify(this.password, passwordSuppliedByUser);
    } catch (error) {
      log.error(error);
    }
  }
}

//Creates Mongoose model with all the methods for interacting the Database itself
const UserModel = getModelForClass(User);

export default UserModel;
