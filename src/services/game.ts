import { Effect, Match } from "effect";
import { CLIService } from "./cli";
import { MoveService, type Move } from "./move";

enum Result {
	Win = "win",
	Loss = "loss",
	Draw = "draw",
}

class GameInputError {
	readonly _tag = "GameInputError";
}

export class GameService extends Effect.Service<GameService>()("app/Game", {
	effect: Effect.gen(function* () {
		const cli = yield* CLIService;
		const moveService = yield* MoveService;

		return {
			getComputerMove: () => moveService.getRandomMove,
			getPlayerMove: () =>
				Effect.gen(function* () {
					const input = yield* cli.prompt(
						"What is your move? (rock, paper, or scissors)",
					);
					const isInvalidMove = !moveService.isValid(input);

					if (isInvalidMove) {
						yield* cli.display("Invalid move. Please try again.");

						return yield* Effect.fail(new GameInputError());
					}

					return input;
				}),

			getResult: (playerMove: Move, computerMove: Move) =>
				Effect.gen(function* () {
					const pRank = moveService.rank(playerMove);
					const cpuRank = moveService.rank(computerMove);
					const diff = Math.abs(pRank - cpuRank);

					return Match.value(diff).pipe(
						Match.when(0, () => Result.Draw),
						Match.when(1, () => (pRank > cpuRank ? Result.Win : Result.Loss)),
						Match.orElse(() => (pRank > cpuRank ? Result.Loss : Result.Win)),
					);
				}),
		};
	}),
	dependencies: [CLIService.Default, MoveService.Default],
}) {}
