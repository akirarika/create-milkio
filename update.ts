#!/usr/bin/env bun
import { readdir } from "node:fs/promises";
import { cwd } from "node:process";
import { join } from "node:path";
import { $ } from "bun";

const entries = await readdir(join(cwd(), "templates"), {
	withFileTypes: true,
});
const directories = entries
	.filter((entry) => entry.isDirectory())
	.map((dirEnt) => dirEnt.name);

for (const directory of directories) {
	const path = join(cwd(), "templates", directory);
	await $`bun i milkio`.cwd(path);
	await $`bun i milkio-template`.cwd(path);
	await $`bun i milkio-client`.cwd(join(path, "packages", "client"));
	await $`bun i biome`.cwd(path);
	await $`bun i`.cwd(path);
	await $`bun i`.cwd(join(path, "packages", "client"));
}
