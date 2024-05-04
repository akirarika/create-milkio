// @ts-ignore
import Enquirer from "enquirer";

export const useInteractiveCli = () => {
	const interactiveCli = {
		async input(message, initial) {
			try {
				const result = await Enquirer.prompt([
					{
						type: "input",
						name: "data",
						initial,
						message,
					},
				]);
				return result.data;
			} catch (error) {
				process.exit(0);
			}
		},
		async confirm(message) {
			try {
				const result = await Enquirer.prompt([
					{
						type: "input",
						name: "data",
						message,
					},
				]);
				return result.data;
			} catch (error) {
				process.exit(0);
			}
		},
		async select(message, choices) {
			try {
				const result = await Enquirer.prompt([
					{
						type: "select",
						name: "data",
						message,
						choices,
					},
				]);
				return result.data;
			} catch (error) {
				process.exit(0);
			}
		},
		async autocomplete(message, choices) {
			try {
				const result = await Enquirer.prompt([
					{
						type: "autocomplete",
						name: "data",
						message,
						choices,
					},
				]);
				return result.data;
			} catch (error) {
				process.exit(0);
			}
		},
	};
	return interactiveCli;
};
