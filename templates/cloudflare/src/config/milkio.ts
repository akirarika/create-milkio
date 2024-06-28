export const configMilkio = {
	debug: true,
	nodeEnv: typeof Bun !== "undefined" ? "development" : "production",

	// http server
	ignorePathLevel: 0,
	corsAllowMethods: "*",
	corsAllowHeaders: "*",
	corsAllowOrigin: "*",
};
