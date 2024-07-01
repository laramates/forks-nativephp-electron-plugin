"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ps_node_1 = __importDefault(require("ps-node"));
const child_process_1 = require("child_process");
const path_1 = require("path");
const php_1 = require("./server/php");
const state_1 = __importDefault(require("./server/state"));
class ProcessManager {
    constructor() {
        this.processes = [];
        this.intervals = [];
        this.timeouts = [];
    }
    defaultWorkingDirectory() {
        let appPath = (0, path_1.join)(__dirname, '../../../../../resources/app/').replace('app.asar', 'app.asar.unpacked');
        if (process.env.NODE_ENV === 'development') {
            appPath = process.env.APP_PATH;
        }
        return appPath;
    }
    spawn(command, args, options, interval, delay) {
        console.log(`Spawning process "${[command, ...args].join(' ')}"`);
        const finalOptions = Object.assign({
            cwd: this.defaultWorkingDirectory(),
            env: Object.assign(Object.assign({}, process.env), (0, php_1.getDefaultEnvironmentVariables)(state_1.default.randomSecret, state_1.default.electronApiPort))
        }, options);
        if (command === 'php') {
            command = state_1.default.php;
        }
        const proc = (0, child_process_1.spawn)(command, args, finalOptions);
        proc.stdout.on('data', (data) => {
            console.log(Buffer.from(data).toString('utf8'));
        });
        proc.stderr.on('data', (data) => {
            console.log(Buffer.from(data).toString('utf8'));
        });
        this.processes.push(proc);
        return proc.pid;
    }
    adopt(process) {
        this.processes.push(process);
    }
    quit() {
        this.processes
            .filter((p) => p !== undefined)
            .forEach((process) => {
            try {
                ps_node_1.default.kill(process.pid);
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
module.exports = new ProcessManager();
