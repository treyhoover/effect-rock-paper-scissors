import { Model } from "@effect/sql";
import { Effect } from "effect";
import { GameResult } from "../models/game-result.js";
import { SqlLive } from "@/layers/sql.js";

export class GameResultRepo extends Effect.Service<GameResultRepo>()(
	"GameResultRepo",
	{
		effect: Model.makeRepository(GameResult, {
			tableName: "game_results",
			spanPrefix: "GameResultRepo",
			idColumn: "id",
		}),
		dependencies: [SqlLive],
	},
) {}
