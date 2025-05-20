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
exports.TerminalUI = void 0;
const readline_1 = __importDefault(require("readline"));
class TerminalUI {
    constructor(dbService) {
        this.dbService = dbService;
        this.rl = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    start() {
        console.log("===== Item Management Terminal UI =====");
        this.showMainMenu();
    }
    showMainMenu() {
        console.log("\nMain Menu:");
        console.log("1. List all items");
        console.log("2. Add a new item");
        console.log("3. Update an item");
        console.log("4. Delete an item");
        console.log("5. Exit");
        this.rl.question("Select an option (1-5): ", (answer) => {
            switch (answer) {
                case "1":
                    this.listItems();
                    break;
                case "2":
                    this.addItem();
                    break;
                case "3":
                    this.updateItem();
                    break;
                case "4":
                    this.deleteItem();
                    break;
                case "5":
                    console.log("Goodbye!");
                    this.rl.close();
                    process.exit(0);
                    break;
                default:
                    console.log("Invalid option. Please try again.");
                    this.showMainMenu();
            }
        });
    }
    listItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.dbService.getAllItems();
                console.log("\n===== All Items =====");
                if (items.length === 0) {
                    console.log("No items found.");
                }
                else {
                    items.forEach((item) => {
                        console.log(`ID: ${item.id} | Name: ${item.name} | Description: ${item.description}`);
                    });
                }
                this.showMainMenu();
            }
            catch (error) {
                console.error("Error listing items:", error);
                this.showMainMenu();
            }
        });
    }
    addItem() {
        this.rl.question("Enter item name: ", (name) => {
            this.rl.question("Enter item description: ", (description) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const newItem = yield this.dbService.insertItem({ name, description });
                    console.log(`Item added successfully with ID: ${newItem.id}`);
                    this.showMainMenu();
                }
                catch (error) {
                    console.error("Error adding item:", error);
                    this.showMainMenu();
                }
            }));
        });
    }
    updateItem() {
        this.rl.question("Enter item ID to update: ", (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const items = yield this.dbService.getAllItems();
                const item = items.find((i) => i.id === parseInt(id));
                if (!item) {
                    console.log(`No item found with ID: ${id}`);
                    this.showMainMenu();
                    return;
                }
                console.log(`Current values - Name: ${item.name} | Description: ${item.description}`);
                this.rl.question("Enter new name (leave blank to keep current): ", (name) => {
                    this.rl.question("Enter new description (leave blank to keep current): ", (description) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield this.dbService.updateItem(id, {
                                name: name || item.name,
                                description: description || item.description,
                            });
                            console.log(`Item updated successfully!`);
                            this.showMainMenu();
                        }
                        catch (error) {
                            console.error("Error updating item:", error);
                            this.showMainMenu();
                        }
                    }));
                });
            }
            catch (error) {
                console.error("Error retrieving item:", error);
                this.showMainMenu();
            }
        }));
    }
    deleteItem() {
        this.rl.question("Enter item ID to delete: ", (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbService.deleteItem(id);
                console.log(`Item with ID ${id} deleted successfully`);
                this.showMainMenu();
            }
            catch (error) {
                console.error("Error deleting item:", error);
                this.showMainMenu();
            }
        }));
    }
}
exports.TerminalUI = TerminalUI;
