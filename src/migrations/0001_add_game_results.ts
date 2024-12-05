import { Effect } from "effect";
import { SqlClient } from "@effect/sql";

export default Effect.gen(function* () {
	const sql = yield* SqlClient.SqlClient;

	yield* sql.onDialectOrElse({
		pg: () =>
			sql`
      CREATE TABLE game_results (
        id SERIAL PRIMARY KEY,
        playerMove TEXT CHECK(playerMove IN ('rock', 'paper', 'scissors')) NOT NULL,
        cpuMove TEXT CHECK(cpuMove IN ('rock', 'paper', 'scissors')) NOT NULL,
        result TEXT CHECK(result IN ('win', 'loss', 'draw')) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `,
		orElse: () =>
			sql`
      CREATE TABLE game_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerMove TEXT CHECK(playerMove IN ('rock', 'paper', 'scissors')) NOT NULL,
        cpuMove TEXT CHECK(cpuMove IN ('rock', 'paper', 'scissors')) NOT NULL,
        result TEXT CHECK(result IN ('win', 'loss', 'draw')) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `,
	});
});
