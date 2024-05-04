export * from "./types"
import { failCode } from "./project/src/fail-code"
import type ApiSchema from "./project/generated/api-schema"
export { defineMiddleware } from "milkio-client"
import { defineMiddleware, defineMilkioClient } from "milkio-client"

export const createClient = defineMilkioClient<typeof ApiSchema, typeof failCode>([
  //
])

export const FailCode = failCode