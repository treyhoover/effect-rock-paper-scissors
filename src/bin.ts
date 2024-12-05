import { Effect, Layer, Option, Schedule } from "effect";
import { NodeRuntime } from "@effect/platform-node";
import { GameService } from "./services/game";
import { GameResultService } from "./GameResult/service";

const EnvLive = Layer.mergeAll(GameService.Default, GameResultService.Default);

const program = Effect.gen(function* () {
	const gameService = yield* GameService;
	const gameResultService = yield* GameResultService;
	const results = yield* gameResultService.getStats();

	if (Option.isSome(results)) {
		console.table({
			Total: results.value.totalGames,
			Wins: results.value.numWins,
			Losses: results.value.numLosses,
			Draws: results.value.numDraws,
		});
	}

	const playerMove = yield* gameService
		.getPlayerMove()
		.pipe(Effect.retry(Schedule.forever));
	const cpuMove = yield* gameService.getComputerMove();
	const result = yield* gameService.getResult(playerMove, cpuMove);

	yield* gameResultService.save({
		playerMove,
		cpuMove,
		result,
	});

	console.log(`You played: ${playerMove}`);
	console.log(`Computer played: ${cpuMove}`);
	console.log(`Result: ${result}`);
});

const runnable = Effect.provide(program, EnvLive);

NodeRuntime.runMain(runnable);
