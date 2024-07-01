import { defineHttpHandler, envToNumber } from "milkio";
import { env } from "node:process";
import { milkio } from "./milkio";
import { createServer } from "@hattip/adapter-node";

async function serve() {
	const port = envToNumber(env.PORT, 9000);
	const httpHandler = defineHttpHandler(await milkio);
	// if you are using Bun
	// if you are using Hattip
	createServer(httpHandler).listen(port, "0.0.0.0", () => {
		console.log(`Server listening on http://localhost:${envToNumber(env.PORT, 9000)}`);
	});
}

serve();
