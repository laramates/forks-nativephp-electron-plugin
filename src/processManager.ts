import ps from "ps-node";
import {spawn} from "child_process";
import {join} from "path";
import {getDefaultEnvironmentVariables} from "./server/php";
import state from "./server/state";

class ProcessManager {
    processes = [];
    intervals = [];
    timeouts = [];

    public defaultWorkingDirectory(): string {
        let appPath = join(__dirname, '../../../../../resources/app/').replace('app.asar', 'app.asar.unpacked')

        if (process.env.NODE_ENV === 'development') {
            appPath = process.env.APP_PATH;
        }

        return appPath;
    }

    public spawn(
        command: string,
        args: string[],
        options: object,
        interval: number,
        delay: number,
    ) {
        console.log(`Spawning process "${[command, ...args].join(' ')}"`);

        const finalOptions = Object.assign({
            cwd: this.defaultWorkingDirectory(),
            env: {
                ...process.env,
                ...getDefaultEnvironmentVariables(state.randomSecret, state.electronApiPort),
            }
        }, options);

        if (command === 'php') {
            command = state.php;
        }

        const proc = spawn(command, args, finalOptions);

        proc.stdout.on('data', (data) => {
            console.log(Buffer.from(data).toString('utf8'));
        });

        proc.stderr.on('data', (data) => {
            console.log(Buffer.from(data).toString('utf8'));
        });

        this.processes.push(proc);

        console.log(`  Spawned process with ID ${proc.pid}`);

        return proc.pid;
    }

    public adopt(
        process
    ) {
        this.processes.push(process);
    }

    public kill(
        pid
    ) {
        console.log(`Killing process with ID ${pid}`);

        // try {
        //     ps.kill(pid);
        // } catch (err) {
        //     console.error(err);
        // }
        //
        // this.processes = this.processes
        //     .filter((p) => {
        //         if (p && p.pid === pid) {
        //             return false;
        //         } else {
        //             return true;
        //         }
        //     });
    }

    public quit() {
        this.processes
            .filter((p) => p !== undefined)
            .forEach((process) => {
                try {
                    ps.kill(process.pid);
                } catch (err) {
                    console.error(err);
                }
            });
    }
}

export = new ProcessManager();
