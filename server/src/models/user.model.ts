import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";
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
/*Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan,
 i.e. scan every document in a collection,
 to select those documents that match the query statement.
 If an appropriate index exists for a query, MongoDB can use the index to limit the number of documents it must inspect.

Indexes are special data structures [1] that store a small portion of the collection's data set in an easy to traverse form. 
The index stores the value of a specific field or set of fields, ordered by the value of the field. 
The ordering of the index entries supports efficient equality matches and range-based query operations. 
In addition, MongoDB can return sorted results by using the ordering in the index.
*/
//To make findByEmail more efficient
@index({ email: 1 })
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

export const privateFields = ["password", "verificationCode", "__v", "passwordResetCode", "verified"];

//Creates Mongoose model with all the methods for interacting the Database itself
const UserModel = getModelForClass(User);

export default UserModel;
