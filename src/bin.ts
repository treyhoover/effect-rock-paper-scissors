import { Effect, Layer, Schedule } from "effect"
import { NodeRuntime, NodeTerminal } from "@effect/platform-node";
import { CLILive } from "./services/cli.js";
import { Game, GameLive } from "./services/game.js";
import { MoveLive } from "./services/move.js";

const program = Effect.gen(function* () {
  const game = yield* Game;
  const playerMove = yield* game.getPlayerMove().pipe(Effect.retry(Schedule.forever));
  const computerMove = yield* game.getComputerMove();
  const result = yield* game.getResult(playerMove, computerMove);

  console.log(`You played: ${playerMove}`);
  console.log(`Computer played: ${computerMove}`);
  console.log(`Result: ${result}`);
})

const MainLive = GameLive.pipe(
  Layer.provide(MoveLive),
  Layer.provide(CLILive),
  Layer.provide(NodeTerminal.layer),
)

const runnable = Effect.provide(program, MainLive);

NodeRuntime.runMain(runnable);

