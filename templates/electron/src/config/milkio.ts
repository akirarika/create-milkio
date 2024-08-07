import { defineConfig } from "milkio";
import detectPort from "detect-port";
import { join } from "node:path";

export const configMilkio = defineConfig(({ config }) => {
	return config({
		debug: false,

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
		assets: () => (electron.app.isPackaged ? join(process.resourcesPath, "assets") : join(electron.app.getAppPath(), "assets")),	
	}).done();
});
