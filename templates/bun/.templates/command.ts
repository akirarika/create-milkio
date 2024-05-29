import { createTemplate } from "milkio-template"
import { join } from "node:path"

await createTemplate(async (tools) => {
  return {
    path: join(tools.directory(), `${tools.hyphen(tools.name())}.ts`),
    content: `
/* eslint-disable no-console */
import { $ } from "bun"
import { defineApi, defineApiTest } from "milkio"

/**
 * ${tools.name()}
 */
export const api = defineApi({
  meta: {},
  async action(params: { /* your params.. */ }, context) {
    // ..
  }
})

export const test = defineApiTest(api, [
  {
    name: "Basic",
    handler: async (test) => {
      const result = await test.execute(await test.randParams())
      if (!result.success) return test.reject(\`The result was not success\`)
    }
  }
])
`.trim()
  }
})
