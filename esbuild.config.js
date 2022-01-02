const esbuild = require("esbuild");
const esbuildSvelte = require("esbuild-svelte");
const sveltePreprocess = require("svelte-preprocess");
const { createServer } = require("http");

const watch = process.argv.includes("--watch");
const clients = [];

esbuild
  .build({
    entryPoints: ["app/javascript/application.js"],
    bundle: true,
    outfile: "app/assets/builds/application.js",
    banner: {
      js: ' (() => new EventSource("http://localhost:8082").onmessage = () => location.reload())();',
    },
    plugins: [
      esbuildSvelte({
        preprocess: sveltePreprocess(),
      }),
    ],
    watch: watch
      ? {
          onRebuild(error) {
            clients.forEach((res) => res.write("data: update\n\n"));
            clients.length = 0;
            console.log(error ? error : "...");
          },
        }
      : false,
  })
  .catch(() => process.exit(1));

createServer((req, res) => {
  return clients.push(
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
    })
  );
}).listen(8082);
