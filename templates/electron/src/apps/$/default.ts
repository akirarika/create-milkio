/* eslint-disable no-console */
import { milkio } from "../../../milkio";
import { createServer } from "@hattip/adapter-node/native-fetch";
import { defineApi, defineHttpHandler } from "milkio";
import { spawn } from "node:child_process";
import { configMilkio } from "../../config/milkio";

export const api = defineApi({
	meta: {},
	async action(
		params: {
			commands: Array<string>;
			options: Record<string, string | true>;
		},
		context,
	) {
		// if the application is already running, it should not be restarted.
		if (!electron.app.requestSingleInstanceLock()) {
			new electron.Notification({
				title: "application is running",
				body: "No need to continue starting it up",
			}).show();
			await new Promise((resolve) => setTimeout(resolve, 5000));
			electron.app.quit();
		}

		const httpHandler = defineHttpHandler(await milkio);
		const port = await configMilkio.port;
		// if you are using Hattip
		createServer(httpHandler).listen(port, "localhost", async () => {
			console.log(`Milkio Server listening on http://localhost:${port}`);

			// after the initialization of milkio is completed, start initializing electron, create the browser window.
			const createWebview = async () => {
				const windowWebview = new electron.BrowserWindow({
					show: false,
					width: 800,
					height: 600,
				});
				// maximize it.
				windowWebview.maximize();

				// when the window first loads, there might be flickering (for example, due to changes in the DOM layout)
				// by delaying the display of the window for a short while, user experience can be enhanced.
				setTimeout(() => windowWebview.show(), 1000);

				// open the DevTools.
				if (configMilkio.openDevTool) windowWebview.webContents.openDevTools();

				// when encountering unknown links, it is recommended to open them in a browser to prevent potential security risks.
				const allowDomains = [`localhost:${port}`, ...configMilkio.allowDomains];
				if (!electron.app.isPackaged) allowDomains.push(`${configMilkio.devWebviewUrl}`);
				windowWebview.webContents.on("will-navigate", (e) => {
					e.preventDefault();
					const url = new URL(e.url);
					if (allowDomains.includes(url.host)) {
						url.searchParams.set("_milkioServer", `http://localhost:${port}`);
						windowWebview.loadURL(url.toString());
					} else {
						electron.shell.openExternal(url.toString());
					}
				});

				// milkio includes an HTTP server
				// you can place your HTML, JavaScript, CSS, and other files that your frontend application has compiled into the `/public` directory.
				// when you are developing locally, Electron will load `http://localhost:8999` as the page (you can modify this in `/src/config/milkio.ts`).
				// if you package your Electron application, it will access the static server of milkio, loading the web pages from the public directory.
				await loadAstroDev();
				const url = new URL(electron.app.isPackaged ? `http://localhost:${port}` : `http://${configMilkio.devWebviewUrl}`);
				url.searchParams.set("_milkioServer", `http://localhost:${port}`);
				windowWebview.loadURL(url.toString());
			};

			// quit when all windows are closed, except on macOS. There, it's common
			// for applications and their menu bar to stay active until the user quits
			// explicitly with Cmd + Q.
			electron.app.on("window-all-closed", () => {
				if (process.platform !== "darwin") {
					electron.app.quit();
				}
			});

			// this method will be called when Electron has finished
			// initialization and is ready to create browser windows.
			// some APIs can only be used after this event occurs.
			await electron.app.whenReady();

			// remove the menu bar
			electron.Menu.setApplicationMenu(null);

			createWebview();
			// on OS X it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			electron.app.on("activate", () => {
				if (electron.BrowserWindow.getAllWindows().length === 0) {
					createWebview();
				}
			});
		});
	},
});

// start the Astro development server in an unpacked state.
const loadAstroDev = async () => {
	if (electron.app.isPackaged) return;
	const astroProcess = spawn("npm", ["run", "astro", "dev"]);
	astroProcess.stdout.on("data", (data) => console.log(data.toString()));
	astroProcess.stderr.on("data", (data) => console.log(data.toString()));
	// continue after a certain delay, or else the webview loading will occur before the astro dev starts.
	await new Promise((resolve) => setTimeout(resolve, 1000));
};
