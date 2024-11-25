import { Terminal } from "@effect/platform"
import type { PlatformError } from "@effect/platform/Error"
import { Effect, Context, Layer } from "effect"

export type CLIError = Terminal.QuitException | PlatformError

export class CLI extends Context.Tag("CLI")<
  CLI,
  { 
    readonly prompt: (message?: string) => Effect.Effect<string, CLIError, never>,
    readonly display: (...messages: string[]) => Effect.Effect<void, CLIError, never> 
  }
>() {}

export const CLILive = Layer.effect(
  CLI,
  Effect.gen(function* () {
    const terminal = yield* Terminal.Terminal

    const display = (...messages: string[]) => Effect.gen(function* () {
      return yield* terminal.display([...messages, ""].join("\n"))
     })

    return {
      prompt: (message) => Effect.gen(function* () {
        if (message != null) {
          yield* display(message);
        }

        return yield* terminal.readLine
      }),
      display,
    }
  })
)
