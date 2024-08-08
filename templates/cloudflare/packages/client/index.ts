export * from "./types";
import { defineMiddleware, defineMilkioClient } from "milkio-client";
import type ApiSchema from "../../generated/api-schema";
import { failCode } from "../../src/fail-code";

export const createClient = defineMilkioClient<
  typeof ApiSchema,
  typeof failCode
>([
  //
]);

export const FailCode = failCode;
