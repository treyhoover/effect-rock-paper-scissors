import { Model } from "@effect/sql";
import { Effect } from "effect";
import { GameResult } from "./model.js";
import { SqlLive } from "../lib/Sql.js";

export class GameResultRepo extends Effect.Service<GameResultRepo>()(
	"GameResult/Repo",
	{
		effect: Model.makeRepository(GameResult, {
			tableName: "game_results",
			spanPrefix: "GameResultRepo",
			idColumn: "id",
		}),
		dependencies: [SqlLive],
	},
) {}
