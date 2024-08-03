import { defineApi, defineApiTest } from "milkio";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type typia from "typia";
import { configMilkio } from "../../config/milkio";

/**
 * This is an API that greets you!
 * 🌟 These ~~comments~~ will be presented by the **Cookbook**
 */
export const api = defineApi({
	meta: {
		//
	},
	async action(
		params: {
			by: string & typia.tags.MinLength<2> & typia.tags.MaxLength<16>;
		},
		context,
	) {
		const message = `hello world! (by ${params.by})`;

		return {
			youSay: message.toString(),
		};
	},
});

export const test = defineApiTest(api, [
	{
		name: "Basic",
		handler: async (test) => {
			const result = await test.client.execute({
				params: {
					by: "milkio",
				},
			});

			if (!result.success) return test.reject("The result was not success");
		},
	},
]);
