import { spawn } from "node:child_process";

const env = { ...process.env };

for (const [key, value] of Object.entries(env)) {
  if (!value) continue;
  const trimmed = value.trim();
  const isQuoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));

  if (isQuoted) {
    env[key] = trimmed.slice(1, -1);
  }
}

env.PORT = env.PORT || "3000";
env.HOSTNAME = "0.0.0.0";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });

    child.on("error", reject);
  });
}

await run("npx", ["prisma", "migrate", "deploy"]);

const server = spawn("node", ["server.js"], {
  env,
  stdio: "inherit",
});

server.on("exit", (code) => {
  process.exit(code ?? 0);
});
