import { DbService } from "../src/services/dbService"

describe("DbService Tests", () => {
  let dbService: DbService

  beforeAll(async () => {
    // Use an in-memory database for testing
    dbService = new DbService(":memory:")
    await dbService.connect()
  })

  afterAll(async () => {
    await dbService.close()
  })

  afterEach(async () => {
    // Clean up the database after each test
    await dbService.run("DELETE FROM items")
  })

  it("should create a new item", async () => {
    const newItem = { name: "Test Item", description: "This is a test item" }
    const result = await dbService.insertItem(newItem)

    expect(result.id).toBeDefined()
    expect(result.name).toBe(newItem.name)
    expect(result.description).toBe(newItem.description)
  })

  it("should retrieve all items", async () => {
    // Insert test items
    await dbService.insertItem({ name: "Item 1", description: "Description 1" })
    await dbService.insertItem({ name: "Item 2", description: "Description 2" })

    const items = await dbService.getAllItems()

    expect(Array.isArray(items)).toBe(true)
    expect(items.length).toBe(2)
    expect(items[0].name).toBe("Item 1")
    expect(items[1].name).toBe("Item 2")
  })

  it("should update an item", async () => {
    // Insert a test item
    const item = await dbService.insertItem({
      name: "Original Item",
      description: "Original description",
    })
    const itemId = item.id!.toString()

    // Update the item
    const updatedData = {
      name: "Updated Item",
      description: "Updated description",
    }
    await dbService.updateItem(itemId, updatedData)

    // Fetch the item again to verify changes
    const items = await dbService.getAllItems()
    const updatedItem = items.find((i) => i.id === item.id)

    expect(updatedItem).toBeDefined()
    expect(updatedItem!.name).toBe("Updated Item")
    expect(updatedItem!.description).toBe("Updated description")
  })

  it("should delete an item", async () => {
    // Insert a test item
    const item = await dbService.insertItem({
      name: "Item to delete",
      description: "Will be deleted",
    })
    const itemId = item.id!.toString()

    // Verify item exists
    let items = await dbService.getAllItems()
    expect(items.length).toBe(1)

    // Delete the item
    await dbService.deleteItem(itemId)

    // Verify item was deleted
    items = await dbService.getAllItems()
    expect(items.length).toBe(0)
  })
})
