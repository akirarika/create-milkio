import electron from "electron";

globalThis.electron = electron;

await import("./dist/run-command.js");
