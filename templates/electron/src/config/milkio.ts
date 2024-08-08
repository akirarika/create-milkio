import { join } from "node:path";
import detectPort from "detect-port";
import { defineConfig } from "milkio";

export const configMilkio = defineConfig(({ config }) => {
  return config({
    debug: true,

    // http server
    ignorePathLevel: 0,
    corsAllowMethods: "*",
    corsAllowHeaders: "*",
    corsAllowOrigin: "*",

    // electron
    port: detectPort(Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000), // obtain an available port number between 10000 and 20000
    devWebviewUrl: "localhost:8999",
    openDevTool: true,
    allowDomains: [],

    // paths
    assets: () =>
      electron.app.isPackaged
        ? join(process.resourcesPath, "assets")
        : join(electron.app.getAppPath(), "assets"),
  }).done();
});
