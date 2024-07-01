import startAPIServer, { APIProcess } from "./api";
import {
  retrieveNativePHPConfig,
  retrievePhpIniSettings,
  startAppServer,
} from "./php";
import { appendCookie } from "./utils";
import state from "./state";

export function startApi(): Promise<APIProcess> {
    return startAPIServer(state.randomSecret);
}

export async function startApp() {
  const result = await startAppServer(
    state.randomSecret,
    state.electronApiPort,
    state.phpIni
  );

  state.phpPort = result.port;

  await appendCookie();

  return result.process;
}

export { retrieveNativePHPConfig, retrievePhpIniSettings };
