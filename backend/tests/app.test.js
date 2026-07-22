"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
(0, vitest_1.describe)("API", () => {
    (0, vitest_1.it)("GET /", async () => {
        const res = await (0, supertest_1.default)(app_1.default).get("/");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.text).toBe("Backend is working!");
    });
});
//# sourceMappingURL=app.test.js.map