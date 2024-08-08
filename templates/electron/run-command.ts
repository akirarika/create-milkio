import type _electron from "electron";
import { defineCommandHandler } from "milkio";
import { milkio } from "./milkio";

declare global {
  var electron: typeof _electron;
}
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

async function command() {
  const commandHandler = defineCommandHandler(await milkio, {
    notFoundHandler(e) {
      console.log("command not found", e);
    },
  });
  await commandHandler(process.argv);
}

command();
