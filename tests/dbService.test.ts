import { assert } from "console";
import { DbService } from "../src/services/dbService";

describe("DbService Tests", () => {
  let dbService: DbService;

  beforeAll(async () => {
    dbService = new DbService("./database/database.db");
    await dbService.connect();
  });

  afterAll(async () => {
    await dbService.close();
  });

  afterEach(async () => {
    await dbService.run("DELETE FROM items");
  });

  it("should handle database connection errors", async () => {
    const invalidDbService = new DbService("invalid/path/db.sqlite");

    try{

      await invalidDbService.connect();
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toContain("ERR_CONNECT");
    }
    
  });

  it("should handle errors when running queries", async () => {
    try{

      // Invalid SQL should throw an error
      await dbService.run("INVALID SQL QUERY");
    } catch (error: any) {
      expect(error).toBeDefined();
      expect(error.message).toContain("SQLITE_ERROR");
    }
    
  });

  it("should handle errors when fetching items", async () => {
    
    try{

      // Force an error by querying a non-existent table
       await dbService.all("SELECT * FROM non_existent_table");
       assert(false, "Expected an error but none was thrown");
    } catch (error: any) {

      expect(error).toBeDefined();
      expect(error.message).toContain("SQLITE_ERROR");
    }
    
  });

  it("should handle errors when updating non-existent items", async () => {
   try{

     await dbService.updateItem("999", { name: "Updated", description: "Updated" });
   } catch (error: any) {
      expect(error).toBeDefined();  
      expect(error.message).toContain("SQLITE_ERROR");
   }
  });

  it("should handle errors when deleting non-existent items", async () => {
    try{

      await dbService.deleteItem("999");
    } catch (error: any) {

      expect(error).toBeDefined();
      expect(error.message).toContain("SQLITE_ERROR");
    }
  });
});