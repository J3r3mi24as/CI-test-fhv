import readline from "readline"
import { DbService } from "../services/dbService"

export class TerminalUI {
  private rl: readline.Interface
  private dbService: DbService

  constructor(dbService: DbService) {
    this.dbService = dbService
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  public start(): void {
    console.log("===== Item Management Terminal UI =====")
    this.showMainMenu()
  }

  private showMainMenu(): void {
    console.log("\nMain Menu:")
    console.log("1. List all items")
    console.log("2. Add a new item")
    console.log("3. Update an item")
    console.log("4. Delete an item")
    console.log("5. Exit")

    this.rl.question("Select an option (1-5): ", (answer) => {
      switch (answer) {
        case "1":
          this.listItems()
          break
        case "2":
          this.addItem()
          break
        case "3":
          this.updateItem()
          break
        case "4":
          this.deleteItem()
          break
        case "5":
          console.log("Goodbye!")
          this.rl.close()
          process.exit(0)
          break
        default:
          console.log("Invalid option. Please try again.")
          this.showMainMenu()
      }
    })
  }

  private async listItems(): Promise<void> {
    try {
      const items = await this.dbService.getAllItems()

      console.log("\n===== All Items =====")
      if (items.length === 0) {
        console.log("No items found.")
      } else {
        items.forEach((item) => {
          console.log(
            `ID: ${item.id} | Name: ${item.name} | Description: ${item.description}`
          )
        })
      }
      this.showMainMenu()
    } catch (error) {
      console.error("Error listing items:", error)
      this.showMainMenu()
    }
  }

  private addItem(): void {
    this.rl.question("Enter item name: ", (name) => {
      this.rl.question("Enter item description: ", async (description) => {
        try {
          const newItem = await this.dbService.insertItem({ name, description })
          console.log(`Item added successfully with ID: ${newItem.id}`)
          this.showMainMenu()
        } catch (error) {
          console.error("Error adding item:", error)
          this.showMainMenu()
        }
      })
    })
  }

  private updateItem(): void {
    this.rl.question("Enter item ID to update: ", async (id) => {
      try {
        const items = await this.dbService.getAllItems()
        const item = items.find((i) => i.id === parseInt(id))

        if (!item) {
          console.log(`No item found with ID: ${id}`)
          this.showMainMenu()
          return
        }

        console.log(
          `Current values - Name: ${item.name} | Description: ${item.description}`
        )

        this.rl.question(
          "Enter new name (leave blank to keep current): ",
          (name) => {
            this.rl.question(
              "Enter new description (leave blank to keep current): ",
              async (description) => {
                try {
                  await this.dbService.updateItem(id, {
                    name: name || item.name,
                    description: description || item.description,
                  })
                  console.log(`Item updated successfully!`)
                  this.showMainMenu()
                } catch (error) {
                  console.error("Error updating item:", error)
                  this.showMainMenu()
                }
              }
            )
          }
        )
      } catch (error) {
        console.error("Error retrieving item:", error)
        this.showMainMenu()
      }
    })
  }

  private deleteItem(): void {
    this.rl.question("Enter item ID to delete: ", async (id) => {
      try {
        await this.dbService.deleteItem(id)
        console.log(`Item with ID ${id} deleted successfully`)
        this.showMainMenu()
      } catch (error) {
        console.error("Error deleting item:", error)
        this.showMainMenu()
      }
    })
  }
}
