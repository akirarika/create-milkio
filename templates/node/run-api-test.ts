import { exit } from "node:process";
import { envToString, executeApiTests } from "milkio";
import { milkio } from "./milkio";

async function apiTest() {
  await executeApiTests(
    await milkio,
    envToString(process.env.MILKIO_API_TEST_PATH, ""),
  );
  exit(0);
}

apiTest();
