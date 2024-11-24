import * as Command from "@effect/cli/Command"

const command = Command.make("rps")

export const run = Command.run(command, {
  name: "Rock Paper Scissors",
  version: "0.0.0"
})
