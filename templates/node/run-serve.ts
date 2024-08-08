import { env } from "node:process";
import { createServer } from "@hattip/adapter-node";
import { defineHttpHandler, envToNumber } from "milkio";
import { milkio } from "./milkio";

async function serve() {
  const port = envToNumber(env.PORT, 9000);
  const httpHandler = defineHttpHandler(await milkio);
  // if you are using Bun
  // if you are using Hattip
  createServer(httpHandler).listen(port, "0.0.0.0", () => {
    console.log(
      `Server listening on http://localhost:${envToNumber(env.PORT, 9000)}`,
    );
  });
}

serve();
