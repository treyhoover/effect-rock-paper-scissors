import { Model } from "@effect/sql";
import { Schema } from "effect";

export const GameResultId = Schema.Number.pipe(Schema.brand("GameResultId"));

export class GameResult extends Model.Class<GameResult>("GameResult")({
	id: Model.Generated(GameResultId),
	playerMove: Schema.String,
	cpuMove: Schema.String,
	result: Schema.String,
	createdAt: Model.DateTimeInsert,
	updatedAt: Model.DateTimeUpdate,
}) {}

export class GameResultNotFound extends Schema.TaggedError<GameResultNotFound>()(
	"GameResultNotFound",
	{
		id: GameResultId,
	},
) {}
