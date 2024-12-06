import { Model } from "@effect/sql";
import { Schema } from "effect";

export const GameResultId = Schema.Number.pipe(Schema.brand("GameResultId"));

export type GameResultFields = {
	readonly id: Schema.Schema<number, number, never>;
	readonly playerMove: Schema.Schema<string, string, never>;
	readonly cpuMove: Schema.Schema<string, string, never>;
	readonly result: Schema.Schema<string, string, never>;
	readonly createdAt: Schema.Schema<Date, Date, never>;
	readonly updatedAt: Schema.Schema<Date, Date, never>;
};

export class GameResult extends Model.Class<GameResultFields>("GameResult")({
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
