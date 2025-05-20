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
Object.defineProperty(exports, "__esModule", { value: true });
const dbService_1 = require("./services/dbService");
const terminalUI_1 = require("./ui/terminalUI");
function app() {
    // Database connection
    const dbService = new dbService_1.DbService("./database/database.db");
    dbService.connect();
    // Start the server
    // Initialize terminal UI
    const terminalUI = new terminalUI_1.TerminalUI(dbService);
    terminalUI.start();
    // Handle graceful shutdown
    process.on("SIGINT", () => __awaiter(this, void 0, void 0, function* () {
        console.log("\nShutting down...");
        yield dbService.close();
        process.exit(0);
    }));
}
exports.default = app;
