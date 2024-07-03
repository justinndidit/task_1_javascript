"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appHandler_1 = require("../handlers/appHandler");
//test
const router = (0, express_1.Router)();
router.get("/", appHandler_1.getUserDetailsAndGreet);
exports.default = router;
