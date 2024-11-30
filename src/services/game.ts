import { Context, Effect, Layer, Match } from "effect";
import { CLI, type CLIError } from "./cli";
import { MoveService, type Move } from "./move";

enum Result {
	Win = "win",
	Lose = "lose",
	Draw = "draw",
}

class GameInputError {
	readonly _tag = "GameInputError";
}

export class Game extends Context.Tag("Game")<
	Game,
	{
		readonly getComputerMove: Effect.Effect<Move, never, never>;
		readonly getPlayerMove: () => Effect.Effect<
			Move,
			CLIError | GameInputError,
			never
		>;
		readonly getResult: (
			playerMove: Move,
			computerMove: Move,
		) => Effect.Effect<Result, never, never>;
	}
>() {}

export const GameLive = Layer.effect(
	Game,
	Effect.gen(function* () {
		const cli = yield* CLI;
		const moveService = yield* MoveService;

		return {
			getComputerMove: moveService.getRandomMove,
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
						Match.when(1, () => (pRank > cpuRank ? Result.Win : Result.Lose)),
						Match.orElse(() => (pRank > cpuRank ? Result.Lose : Result.Win)),
					);
				}),
		};
	}),
);
