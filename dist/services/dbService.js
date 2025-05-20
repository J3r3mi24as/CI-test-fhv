"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbService = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
class DbService {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.db = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield (0, sqlite_1.open)({
                filename: this.dbPath,
                driver: sqlite3_1.default.Database,
            });
            // Create items table if it doesn't exist
            yield this.db.exec(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )
    `);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.db) {
                yield this.db.close();
                this.db = null;
            }
        });
    }
    run(query, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db) {
                throw new Error("Database not connected");
            }
            return this.db.run(query, params);
        });
    }
    get(query, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db) {
                throw new Error("Database not connected");
            }
            return this.db.get(query, params);
        });
    }
    all(query, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.db) {
                throw new Error("Database not connected");
            }
            return this.db.all(query, params);
        });
    }
    // Item-specific methods
    getAllItems() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.all("SELECT * FROM items", []);
        });
    }
    insertItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.run("INSERT INTO items (name, description) VALUES (?, ?)", [item.name, item.description]);
            const id = result.lastID;
            return Object.assign(Object.assign({}, item), { id });
        });
    }
    updateItem(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.run("UPDATE items SET name = ?, description = ? WHERE id = ?", [
                item.name,
                item.description,
                id,
            ]);
            return Object.assign(Object.assign({}, item), { id: parseInt(id) });
        });
    }
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.run("DELETE FROM items WHERE id = ?", [id]);
        });
    }
    getItemById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = yield this.get("SELECT * FROM items WHERE id = ?", [id]);
            return item;
        });
    }
}
exports.DbService = DbService;
