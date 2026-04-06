import { spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
const tscCli = join(projectRoot, "node_modules", "typescript", "bin", "tsc");
const distServer = join(projectRoot, "dist", "server.js");

let serverProcess = null;
let buildInProgress = false;
let buildQueued = false;
let restartTimer = null;

const watchedPaths = [
  join(projectRoot, "src"),
  join(projectRoot, "package.json"),
  join(projectRoot, "tsconfig.json"),
  join(projectRoot, ".env"),
];

const log = (message) => {
  console.log(`[dev] ${message}`);
};

const runBuild = () =>
  new Promise((resolveBuild) => {
    const buildProcess = spawn(process.execPath, [tscCli, "-p", "tsconfig.json"], {
      cwd: projectRoot,
      stdio: "inherit",
    });

    buildProcess.on("exit", (code) => {
      resolveBuild(code === 0);
    });
  });

const stopServer = () =>
  new Promise((resolveStop) => {
    if (!serverProcess) {
      resolveStop();
      return;
    }

    const currentProcess = serverProcess;
    serverProcess = null;

    currentProcess.once("exit", () => {
      resolveStop();
    });

    currentProcess.kill();
  });

const startServer = () => {
  if (!existsSync(distServer)) {
    log("Skipping restart because dist/server.js is not available yet.");
    return;
  }

  serverProcess = spawn(process.execPath, [distServer], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  serverProcess.on("exit", (code, signal) => {
    if (serverProcess) {
      log(`Server exited with ${signal ? `signal ${signal}` : `code ${code}`}.`);
      serverProcess = null;
    }
  });
};

const rebuildAndRestart = async () => {
  if (buildInProgress) {
    buildQueued = true;
    return;
  }

  buildInProgress = true;
  log("Building backend...");
  const buildSucceeded = await runBuild();

  if (buildSucceeded) {
    await stopServer();
    log("Starting backend server...");
    startServer();
  } else {
    log("Build failed. Waiting for another file change.");
  }

  buildInProgress = false;

  if (buildQueued) {
    buildQueued = false;
    await rebuildAndRestart();
  }
};

const scheduleRestart = () => {
  if (restartTimer) {
    clearTimeout(restartTimer);
  }

  restartTimer = setTimeout(() => {
    restartTimer = null;
    void rebuildAndRestart();
  }, 150);
};

for (const watchedPath of watchedPaths) {
  watch(watchedPath, { recursive: true }, () => {
    scheduleRestart();
  });
}

const shutdown = async () => {
  if (restartTimer) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }

  await stopServer();
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

void rebuildAndRestart();
