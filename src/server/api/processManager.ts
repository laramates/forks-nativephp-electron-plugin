import express from 'express'
import ProcessManager from '../../processManager';

const router = express.Router();

router.post('/spawn', (req, res) => {
    const spawnedProcess = ProcessManager.spawn(
        req.body.command,
        req.body.args,
        req.body.options,
        req.body.interval,
        req.body.delay,
    );

    res.send({
        pid: spawnedProcess,
    });
})

router.post('/kill', (req, res) => {
    ProcessManager.kill(
        req.body.pid,
    );

    res.sendStatus(200);
})

export default router;
