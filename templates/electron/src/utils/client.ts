import { createClient } from "client";

const url = new URL(location.href);
if (!url.searchParams.has("_milkioServer")) alert("Failed to establish a connection with milkio");

export const client = createClient({
	baseUrl: url.searchParams.get("_milkioServer") ?? "",
});
