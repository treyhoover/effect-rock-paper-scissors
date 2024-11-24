import { Terminal } from "@effect/platform"
import type { PlatformError } from "@effect/platform/Error"
import { Effect, Match, Option, Random } from "effect"
import { NodeRuntime, NodeTerminal } from "@effect/platform-node"

const moves = ["rock", "paper", "scissors"] as const;

type Move = typeof moves[number];
type GameResult = "win" | "lose" | "draw"

const isMove = (input: string): input is Move => moves.includes(input as Move)

const parseMove = (input: string): Option.Option<Move> => {
  const move = input.toLowerCase().trim()
  return isMove(move) ? Option.some(move) : Option.none()
}

const display = (...messages: string[]) =>
  Effect.gen(function* () {
    const terminal = yield* Terminal.Terminal
    yield* terminal.display(`${messages.join("\n")}\n`)
  })

const getPlayerMove: Effect.Effect<
  Move,
  Terminal.QuitException | PlatformError,
  Terminal.Terminal
> = Effect.gen(function* () {
  yield* display("Enter your move (rock/paper/scissors): ")
  
  const terminal = yield* Terminal.Terminal
  const input = yield* terminal.readLine
  const move = parseMove(input)
  if (Option.isNone(move)) {
    yield* display("Invalid move! Please enter rock, paper, or scissors")
    return yield* getPlayerMove
  }
  return move.value
})

const getComputerMove: Effect.Effect<Move> = Random.choice(moves)

const determineWinner = (playerMove: Move, computerMove: Move): GameResult => {
  const playerIdx = moves.indexOf(playerMove)
  const computerIdx = moves.indexOf(computerMove)

  return Match.value(playerIdx - computerIdx).pipe(
    Match.when(0, () => "draw" as const),
    Match.when(1, () => "win" as const),
    Match.when(-2, () => "win" as const),
    Match.orElse(() => "lose" as const),
  )
}

const displayRoundResult = (
  playerMove: Move,
  computerMove: Move,
  result: GameResult
) => {
  const roundResultMessages: Record<GameResult, string> = {
    win: "You win! 🎉",
    lose: "Computer wins! 😢",
    draw: "It's a draw! 🤝",
  }

  return display(
    `You chose ${playerMove}`,
    `Computer chose ${computerMove}`,
    roundResultMessages[result]
  );
}

const playAgainPrompt = Effect.gen(function* () {
  const terminal = yield* Terminal.Terminal
  yield* terminal.display("Play again? (y/n): ")
  const response = yield* terminal.readLine
  return response.toLowerCase().trim().startsWith("y")
})

const playRound: Effect.Effect<
  void,
  Terminal.QuitException | PlatformError,
  Terminal.Terminal
> = Effect.gen(function* () {
  const playerMove = yield* getPlayerMove
  const compMove = yield* getComputerMove
  const result = determineWinner(playerMove, compMove)
  yield* displayRoundResult(playerMove, compMove, result)
  
  const playAgain = yield* playAgainPrompt
  if (playAgain) {
    yield* display("\n--- New Round ---")
    return yield* playRound
  }
})

const game: Effect.Effect<
  void,
  Terminal.QuitException | PlatformError,
  Terminal.Terminal
> = Effect.gen(function* () {
  yield* display("Let's play Rock Paper Scissors!")
  yield* playRound
  yield* display("Thanks for playing! 👋")
})

NodeRuntime.runMain(Effect.provide(game, NodeTerminal.layer))
