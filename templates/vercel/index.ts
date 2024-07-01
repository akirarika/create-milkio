import { defineHttpHandler } from "milkio";
import { milkio } from "./milkio";

export async function handler(request: Request) {
	const httpHandler = defineHttpHandler(await milkio);
	return await httpHandler({ request: request });
}
