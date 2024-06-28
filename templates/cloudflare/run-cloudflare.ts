import { defineHttpHandler } from "milkio";
import { milkio } from "./milkio";

export default {
	async fetch(request) {
		const httpHandler = defineHttpHandler(await milkio);
		return await httpHandler(request);
	},
};
