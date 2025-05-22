import { DbService } from "./services/dbService"
import { TerminalUI } from "./ui/terminalUI"

export default function app() {
  // Database connection
  const dbService = new DbService("./database/database.db")
  dbService.connect()

  // Start the server

    // Initialize terminal UI
  const terminalUI = new TerminalUI(dbService)
  terminalUI.start()

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\nShutting down...")
    await dbService.close()
    process.exit(0)
  })
}

app()
