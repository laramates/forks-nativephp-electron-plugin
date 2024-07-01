import express from 'express'

const router = express.Router();

const cache = {};

router.get('/:key', (req, res) => {
    res.json({
        value: cache[req.params.key] ?? null
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

export default router;
