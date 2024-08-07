import { defineHttpHandler } from "milkio";
import { milkio } from "./milkio";

export default {
	async fetch(request: Request) {
		const httpHandler = defineHttpHandler(await milkio);
		return await httpHandler({ request: request });
	},
};
