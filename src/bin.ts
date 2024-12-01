import { Effect, Schedule } from "effect";
import { NodeRuntime } from "@effect/platform-node";
import { GameService } from "./services/game.js";

const program = Effect.gen(function* () {
	const game = yield* GameService;
	const playerMove = yield* game
		.getPlayerMove()
		.pipe(Effect.retry(Schedule.forever));
	const computerMove = yield* game.getComputerMove();
	const result = yield* game.getResult(playerMove, computerMove);

	console.log(`You played: ${playerMove}`);
	console.log(`Computer played: ${computerMove}`);
	console.log(`Result: ${result}`);
});

const runnable = Effect.provide(program, GameService.Default);

NodeRuntime.runMain(runnable);
