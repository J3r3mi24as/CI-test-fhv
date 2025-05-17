import sqlite3 from "sqlite3"
import { open, Database } from "sqlite"

export interface Item {
  id?: number
  name: string
  description: string
}

export class DbService {
  private db: Database | null = null

  constructor(private dbPath: string) {}

  async connect() {
    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database,
    })

    // Create items table if it doesn't exist
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )
    `)
  }

  async close() {
    if (this.db) {
      await this.db.close()
      this.db = null
    }
  }

  async run(query: string, params: any[] = []) {
    if (!this.db) {
      throw new Error("Database not connected")
    }
    return this.db.run(query, params)
  }

  async get(query: string, params: any[] = []) {
    if (!this.db) {
      throw new Error("Database not connected")
    }
    return this.db.get(query, params)
  }

  async all(query: string, params: any[] = []) {
    if (!this.db) {
      throw new Error("Database not connected")
    }
    return this.db.all(query, params)
  }

  // Item-specific methods

  async getAllItems(): Promise<Item[]> {
    return this.all("SELECT * FROM items", [])
  }

  async insertItem(item: Item): Promise<Item> {
    const result = await this.run(
      "INSERT INTO items (name, description) VALUES (?, ?)",
      [item.name, item.description]
    )

    const id = result.lastID;
    return { ...item, id }
  }

  async updateItem(id: string, item: Item): Promise<Item> {
    await this.run("UPDATE items SET name = ?, description = ? WHERE id = ?", [
      item.name,
      item.description,
      id,
    ])

    return { ...item, id: parseInt(id) }
  }

  async deleteItem(id: string): Promise<void> {
    await this.run("DELETE FROM items WHERE id = ?", [id])
  }

  async getItemById(id: string): Promise<Item | undefined> {
    const item = await this.get("SELECT * FROM items WHERE id = ?", [id])
    return item as Item | undefined
  }
}
