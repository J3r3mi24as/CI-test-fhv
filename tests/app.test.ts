import { DbService } from "../src/services/dbService";
import app from "../src/app";

// Mock the TerminalUI class
jest.mock('../src/ui/terminalUI', () => {
  return {
    TerminalUI: jest.fn().mockImplementation(() => {
      return {
        start: jest.fn()
      };
    })
  };
});

describe("DbService Tests", () => {
  let dbService: DbService;

  beforeAll(async () => {
    // Use an in-memory database for testing
    dbService = new DbService("./database/database.db");
    await dbService.connect();
  });

  afterAll(async () => {
    await dbService.close();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await dbService.run("DELETE FROM items");
  });

  it('should start the application', async () => {
    // Check if the database connection is established
    expect(dbService).toBeDefined();
    
    app();
    // Check if the items table exists
    const result = await dbService.all("SELECT name FROM sqlite_master WHERE type='table' AND name='items'");
    expect(result.length).toBe(1);
  });

  it("should create a new item", async () => {
    const newItem = { name: "Test Item", description: "This is a test item" };
    const result = await dbService.insertItem(newItem);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(newItem.name);
    expect(result.description).toBe(newItem.description);
  });

  it("should retrieve all items", async () => {
    // Insert test items
    await dbService.insertItem({ name: "Item 1", description: "Description 1" });
    await dbService.insertItem({ name: "Item 2", description: "Description 2" });

    const items = await dbService.getAllItems();

    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBe(2);
    expect(items[0].name).toBe("Item 1");
    expect(items[1].name).toBe("Item 2");
  });

  it("should update an item", async () => {
    // Insert a test item
    const item = await dbService.insertItem({
      name: "Original Item",
      description: "Original description",
    });
    const itemId = item.id!.toString();

    // Update the item
    const updatedData = {
      name: "Updated Item",
      description: "Updated description",
    };
    await dbService.updateItem(itemId, updatedData);

    // Fetch the item again to verify changes
    const items = await dbService.getAllItems();
    const updatedItem = items.find((i) => i.id === item.id);

    expect(updatedItem).toBeDefined();
    expect(updatedItem!.name).toBe("Updated Item");
    expect(updatedItem!.description).toBe("Updated description");
  });

  it("should delete an item", async () => {
    // Insert a test item
    const item = await dbService.insertItem({
      name: "Item to delete",
      description: "Will be deleted",
    });
    const itemId = item.id!.toString();

    // Verify item exists
    let items = await dbService.getAllItems();
    expect(items.length).toBe(1);

    // Delete the item
    await dbService.deleteItem(itemId);

    // Verify item was deleted
    items = await dbService.getAllItems();
    expect(items.length).toBe(0);
  });
});

describe("App Tests", () => {
  let dbService: DbService;

  beforeAll(async () => {
    // Use an in-memory database for testing
    dbService = new DbService("./database/database.db");
    await dbService.connect();
  });

  afterAll(async () => {
    await dbService.close();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await dbService.run("DELETE FROM items");
  });

  it('should start the application correctly', async () => {
    // Check if the database connection is established
    expect(dbService).toBeDefined();
    
    // Mock process.on to handle the SIGINT event
    const processSpy = jest.spyOn(process, 'on');
    
    app();
    
    // Check if the application registered the SIGINT handler
    expect(processSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    
    // Check if the items table exists
    const result = await dbService.all("SELECT name FROM sqlite_master WHERE type='table' AND name='items'");
    expect(result.length).toBe(1);
    
    processSpy.mockRestore();
  });

  it('should handle shutdown correctly', async () => {
    // Mock console.log and process.exit
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      return undefined as never;
    });
    // Mock process.on to handle the SIGINT event
    const processSpy = jest.spyOn(process, 'on');
    
    // Run the application
    app();
    
    // Get the SIGINT handler
    const sigintCall = processSpy.mock.calls.find(call => call[0] === 'SIGINT');
    expect(sigintCall).toBeDefined();
    const sigintHandler = sigintCall && sigintCall[1];
    
    // Call the handler
    if (typeof sigintHandler === 'function') {
      await sigintHandler();
    }
    
    // Verify the handler behavior
    expect(consoleSpy).toHaveBeenCalledWith('\nShutting down...');
    expect(exitSpy).toHaveBeenCalledWith(0);
    
    // Restore the mocks
    consoleSpy.mockRestore();
    exitSpy.mockRestore();
    processSpy.mockRestore();
  });
});
