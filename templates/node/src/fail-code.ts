import type { MilkioFailCode } from "milkio";

export const failCode = {
	NETWORK_ERROR: (_data: undefined) => "Network Error",
	INTERNAL_SERVER_ERROR: (_data: undefined) => "Internal Server Error",
	NOT_FOUND: (_data: undefined) => "Not Found",
	NOT_ALLOW_METHOD: (_data: undefined) => "Not Allow Method",
	TYPE_SAFE_ERROR: (data: { path: string; expected: string; value: string }) => `Parameter Error: The current value is '${data.value}', which does not meet '${data.expected}' requirements`,
	BUSINESS_FAIL: (data: string) => `${data}`,
	// You can add your own mistakes here
	// ...
} satisfies MilkioFailCode;
