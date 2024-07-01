import { envToBoolean, envToNumber, envToString } from "milkio";
import { env } from "node:process";

export const configMilkio = {
	debug: envToBoolean(env.MILKIO_DEBUG, true),
	nodeEnv: envToString(env.NODE_ENV, "production") as "development" | "production",

	// http server
	ignorePathLevel: envToNumber(env.MILKIO_IGNORE_PATH_LEVEL, 0),
	corsAllowMethods: envToString(env.MILKIO_CORS_ALLOW_METHODS, "*"),
	corsAllowHeaders: envToString(env.MILKIO_CORS_ALLOW_HEADERS, "*"),
	corsAllowOrigin: envToString(env.MILKIO_CORS_ALLOW_ORIGIN, "*"),
};
