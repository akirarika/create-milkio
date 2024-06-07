import { envToBoolean, envToNumber, envToString } from "milkio";
import detectPort from "detect-port";
import { env } from "node:process";

export const configMilkio = {
	debug: envToBoolean(env.MILKIO_DEBUG, true),
	nodeEnv: envToString(env.NODE_ENV, "production") as "development" | "production",

	// http server
	ignorePathLevel: envToNumber(env.MILKIO_IGNORE_PATH_LEVEL, 0),
	corsAllowMethods: envToString(env.MILKIO_CORS_ALLOW_METHODS, "*"),
	corsAllowHeaders: envToString(env.MILKIO_CORS_ALLOW_HEADERS, "*"),
	corsAllowOrigin: envToString(env.MILKIO_CORS_ALLOW_ORIGIN, "*"),

	// electron
	port: await detectPort(Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000), // obtain an available port number between 10000 and 20000
	devWebviewUrl: "localhost:8999",
	openDevTool: true,
	allowDomains: [],
};
