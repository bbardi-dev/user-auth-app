import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

//Higher Order Function called with a schema(from Zod), performs the checking of request,
//then passes the request onto the next middleware with next()
const validateResource = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (e: any) {
    return res.status(400).send(e.errors);
  }
};

export default validateResource;
