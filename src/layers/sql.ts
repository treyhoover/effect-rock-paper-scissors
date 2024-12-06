import { NodeContext } from "@effect/platform-node";
import { SqliteClient, SqliteMigrator } from "@effect/sql-sqlite-node";
import { Layer } from "effect";
import { fileURLToPath } from "node:url";

const migrationsPath = fileURLToPath(new URL("../migrations", import.meta.url));
const dbPath = fileURLToPath(new URL("../../data/db.sqlite", import.meta.url));

const ClientLive = SqliteClient.layer({
	filename: dbPath,
});

const MigratorLive = SqliteMigrator.layer({
	loader: SqliteMigrator.fromFileSystem(migrationsPath),
}).pipe(Layer.provide(NodeContext.layer));

export const SqlLive = MigratorLive.pipe(Layer.provideMerge(ClientLive));
