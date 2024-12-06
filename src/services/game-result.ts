import { SqliteClient } from "@effect/sql-sqlite-node";
import { Effect, Schema } from "effect";
import { SqlSchema } from "@effect/sql";
import { GameResult } from "@/models/game-result";
import { SqlLive } from "@/layers/sql";
import { GameResultRepo } from "@/repos/game-result";

export class GameResultService extends Effect.Service<GameResultService>()(
	"GameResultService",
	{
		effect: Effect.gen(function* () {
			const repo = yield* GameResultRepo;
			const sql = yield* SqliteClient.SqliteClient;

			const getStats = SqlSchema.findOne({
				Request: Schema.Void,
				Result: Schema.Struct({
					totalGames: Schema.Number,
					numWins: Schema.Number,
					numLosses: Schema.Number,
					numDraws: Schema.Number,
					numRockPlays: Schema.Number,
					numPaperPlays: Schema.Number,
					numScissorsPlays: Schema.Number,
					numCpuRockPlays: Schema.Number,
					numCpuPaperPlays: Schema.Number,
					numCpuScissorsPlays: Schema.Number,
				}),
				execute: () => sql`
					SELECT
						COUNT(*) AS totalGames,
						SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS numWins,
						SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) AS numLosses,
						SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) AS numDraws,
						COUNT(CASE WHEN playerMove = 'rock' THEN 1 END) AS numRockPlays,
						COUNT(CASE WHEN playerMove = 'paper' THEN 1 END) AS numPaperPlays,
						COUNT(CASE WHEN playerMove = 'scissors' THEN 1 END) AS numScissorsPlays,
						COUNT(CASE WHEN cpuMove = 'rock' THEN 1 END) AS numCpuRockPlays,
						COUNT(CASE WHEN cpuMove = 'paper' THEN 1 END) AS numCpuPaperPlays,
						COUNT(CASE WHEN cpuMove = 'scissors' THEN 1 END) AS numCpuScissorsPlays
					FROM
						game_results;
				`,
			});

			const findAll = SqlSchema.findAll({
				Request: Schema.Void,
				Result: GameResult,
				execute: () => sql`select * from game_results`,
			});

			const save = (gameResult: typeof GameResult.jsonCreate.Type) =>
				repo.insert(GameResult.insert.make(gameResult));

			return {
				save,
				findAll,
				getStats,
			};
		}),
		dependencies: [SqlLive, GameResultRepo.Default],
	},
) {}
