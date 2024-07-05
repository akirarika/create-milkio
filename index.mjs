#!/usr/bin/env node

import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import { cp, readFile, writeFile, unlink } from "node:fs/promises";
import { exit, cwd, platform } from "node:process";
import { fileURLToPath } from "node:url";
import { useInteractiveCli } from "./uses/interactive-cli.mjs";
import { execFileSync } from "node:child_process";

const templates = ["bun", "node", "cloudflare (beta)", "electron (beta)"];
const mirrors = [
	"https://mirrors.cloud.tencent.com/npm/",
	"https://registry.npmmirror.com/",
	"https://cdn.jsdelivr.net/npm/",
];
// some package need latest version , remove from templates/*/bun/package.json and add in this array.
const getLatestPackage = ["milkio", "milkio-template"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createMilkio() {
	const interactiveCli = useInteractiveCli();

	const langs = ["English", "中文", "日本語", "한국어"];
	const langSelected = await interactiveCli.select(
		"🥛 Hello! What language do you want to read?",
		[...langs],
	);
	const i18n = (...translates) =>
		translates[langs.findIndex((v) => v === langSelected)];
	let fullTargetPath = cwd();
	if (join(cwd()) === join(__dirname)) {
		const projectSelected = await interactiveCli.input(
			// 🥛 What name for your project?
			i18n(
				"🥛 Where would you like to install it? Please enter the full path",
				"🥛 你想安装到哪里？输入完整路径",
				"🥛 どこにインストールしますか？完全なパスを入力してください",
				"🥛 어디에 설치하시겠습니까? 전체 경로를 입력해주세요",
			),
			join(cwd(), ".."),
		);
		fullTargetPath = projectSelected;
	}
	const templateSelected = await interactiveCli.select(
		// 🥛 Which runtime do you prefer?
		i18n(
			"🥛 Which runtime do you prefer?",
			"🥛 你更喜欢哪个运行时？",
			"🥛 どちらの Runtime が好きですか？",
			"🥛 어느 Runtime 를 더 좋아하세요？",
		),
		templates,
	);
	const nameSelected = await interactiveCli.input(
		// 🥛 What name for your project?
		i18n(
			"🥛 What name for your project?",
			"🥛 你的工程叫什么名字？",
			"🥛 あなたのプロジェクトの名前は何ですか？",
			"당신의 프로젝트 이름은 무엇인가요？",
		),
		"milkio-project",
	);
	const projectTargetPath = join(fullTargetPath, nameSelected);
	if (await existsSync(projectTargetPath)) {
		console.log(
			i18n(
				`❎ ${nameSelected} already exists.`,
				`❎ ${nameSelected} 已经存在`,
				`❎ ${nameSelected} は既に存在しています`,
				`❎ ${nameSelected} 이미 존재합니다`,
			),
		);
		exit(0);
	}
	const mirrorSelected = await interactiveCli.select(
		// 🥛 Which mirror do you prefer?
		i18n(
			"🥛 Which mirror do you prefer?",
			"🥛 你更喜欢哪个镜像源？(推荐中国大陆用户使用非默认的镜像源哦)",
			"🥛 どちらのミラーが好きですか？",
			"🥛 어느 ミラー 를 더 좋아세요？",
		),
		[
			i18n("🤗 No change", "🤗 我不改", "🤗 変更しない", "🤗 변경하지 않음"),
			...mirrors,
		],
	);

	const frames = [
		"- 🥛 Milkio Creating..",
		"\\ 🥛 Milkio Creating..",
		"| 🥛 Milkio Creating..",
		"/ 🥛 Milkio Creating..",
	];
	let i = 0;

	setInterval(() => {
		process.stdout.write(`\r${frames[i]}`);
		i = (i + 1) % frames.length;
	}, 64);

	await cp(join(__dirname, "templates", templateSelected.split(" (").at(0)), projectTargetPath, {
		recursive: true,
	});

	// create .gitignore
	await writeFile(
		join(projectTargetPath, ".gitignore"),
		`# ignore
node_modules
/app
/dist
/dist-static
/out
/generated
/packages/client/dist
/packages/client/project
/.astro
/.wrangler
/.vercel
/.env
`,
	);

	// create .npmignore
	await writeFile(
		join(projectTargetPath, "packages", "client", ".npmignore"),
		`# ignore
node_modules
/project/
!/project/src/apps
!/project/src/meta.d.ts
!/project/src/fail-code.d.ts
`,
	);

	// edit package.json
	const packageJson = await readFile(
		join(projectTargetPath, "package.json"),
		"utf8",
	);
	await writeFile(
		join(projectTargetPath, "package.json"),
		packageJson.replace(/"name": ".*"/, `"name": "${nameSelected}"`),
	);

	// edit client package.json
	let clientPackageJson = await readFile(
		join(projectTargetPath, "packages", "client", "package.json"),
		"utf8",
	);
	clientPackageJson = clientPackageJson.replace(
		/"name": ".*"/,
		`"name": "${nameSelected}-client"`,
	);

	// clientPackageJson = clientPackageJson.replace(/"milkio": ".*"/, `"milkio": "^x.x.x"`);
	await writeFile(
		join(projectTargetPath, "packages", "client", "package.json"),
		clientPackageJson,
	);

	// edit bunfig.toml
	if (!mirrorSelected.startsWith("🤗")) {
		const bunfigToml = await readFile(
			join(projectTargetPath, "bunfig.toml"),
			"utf8",
		);
		await writeFile(
			join(projectTargetPath, "bunfig.toml"),
			bunfigToml.replace(/registry = ".*"/, `registry = "${mirrorSelected}"`),
		);
	}

	// remove bun.lockb
	await unlink(join(projectTargetPath, "bun.lockb"));

	console.log("\n");
	execFileSync("bun", ["i"], { stdio: "inherit", cwd: projectTargetPath });
	execFileSync("bun", ["i", ...getLatestPackage], {
		stdio: "inherit",
		cwd: projectTargetPath,
	});
	if (platform !== "win32") {
		execFileSync("bun", ["run", "milkio", "gen"], {
			stdio: "inherit",
			cwd: projectTargetPath,
		});
	} else {
		execFileSync("powershell.exe", ["-command", "bun run milkio gen"], {
			stdio: "inherit",
			cwd: projectTargetPath,
		});
	}
	execFileSync("bun", ["i", "./packages/client"], { stdio: "inherit", cwd: projectTargetPath });

	process.stdout.clearLine();
	process.stdout.cursorTo(0);
	// ✔ 🥛 Project created successfully!
	console.log("\n\n");
	console.log(
		i18n(
			"✔ 🥛 Project created successfully!\n",
			"✔ 🥛 工程创建成功！\n",
			"✔ 🥛 プロジェクトを作成しました！\n",
			"✔ 🥛 프로젝트를 생성しました！\n",
		),
	);
	// \x1b[1mNext step?\x1b[0m
	console.log(
		i18n(
			"\x1b[1mNext step?\x1b[0m",
			"\x1b[1m下一步?\x1b[0m",
			"\x1b[1m次のステップへ?\x1b[0m",
			"\x1b[1m다음 사항을 찾기?\x1b[0m",
		),
	);
	// 1. Open "${nameSelected}" folder using VS Code.
	console.log(
		i18n(
			`1. Open "${nameSelected}" folder using VS Code.`,
			`1. 在 VS Code 中打开 "${nameSelected}" 文件夹。`,
			`1. VS Code で "${nameSelected}" フォルダを開きます。`,
			`1. VS Code에서 "${nameSelected}" 폴더를 엽니다.`,
		),
	);
	// 2. Install "Milkio" in the VS Code extension.
	console.log(
		i18n(
			`2. Install "Milkio" in the VS Code extension.`,
			`2. 在 VS Code 扩展中安装 "Milkio"。`,
			`2. VS Code の拡張機能に "Milkio" をインストールします。`,
			`2. VS Code 확장 프로그램에 'Milkio'를 설치합니다.`,
		),
	);
	// 3. Let's start turning your dreams into reality!
	console.log(
		i18n(
			`3. Let's start turning your dreams into reality! 🦄`,
			"3. 让我们开始将梦想转化为现实！🦄",
			"3. あなたの夢を実現しましょう！🦄",
			"3. 브란만 노트북을 만들고 한다! 🦄",
		),
	);
	console.log(
		`\n- ${i18n(
			"Docs: https://milkio.fun",
			"文档: https://zh-milkio.nito.ink",
			"ドキュメント: https://milkio.fun",
			"문서: https://milkio.fun",
		)}\n`,
	);
}

await createMilkio();

exit(0);
