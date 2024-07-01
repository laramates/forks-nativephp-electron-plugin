"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const cache = {};
router.get('/:key', (req, res) => {
    var _a;
    res.json({
        value: (_a = cache[req.params.key]) !== null && _a !== void 0 ? _a : null
    });
});
router.get('/', (req, res) => {
    res.json(cache);
});
router.post('/:key', (req, res) => {
    cache[req.params.key] = req.body.value;
    res.sendStatus(200);
});
router.delete('/:key', (req, res) => {
    delete cache[req.params.key];
    res.sendStatus(200);
});
exports.default = router;
