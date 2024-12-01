import { NodeTerminal } from "@effect/platform-node";
import type { PlatformError } from "@effect/platform/Error";
import { Terminal, type QuitException } from "@effect/platform/Terminal";
import { Effect } from "effect";

export type CLIError = QuitException | PlatformError;

export class CLIService extends Effect.Service<CLIService>()("app/CLI", {
	effect: Effect.gen(function* () {
		const terminal = yield* Terminal;

		const display = (...messages: string[]) =>
			Effect.gen(function* () {
				return yield* terminal.display([...messages, ""].join("\n"));
			});

		const prompt = (message?: string) =>
			Effect.gen(function* () {
				if (message != null) {
					yield* display(message);
				}

				return yield* terminal.readLine;
			});

		return {
			prompt,
			display,
		};
	}),
	dependencies: [NodeTerminal.layer],
}) {}
