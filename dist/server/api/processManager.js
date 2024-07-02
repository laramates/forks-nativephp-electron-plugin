"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const processManager_1 = __importDefault(require("../../processManager"));
const router = express_1.default.Router();
router.post('/spawn', (req, res) => {
    const spawnedProcess = processManager_1.default.spawn(req.body.command, req.body.args, req.body.options, req.body.interval, req.body.delay);
    res.send({
        pid: spawnedProcess,
    });
});
router.post('/kill', (req, res) => {
    processManager_1.default.kill(req.body.pid);
    res.sendStatus(200);
});
exports.default = router;
