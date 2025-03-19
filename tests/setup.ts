import { createServer } from "http";
import { parse } from "url";
import next from "next";

const app = next({ dev: true });
const handle = app.getRequestHandler();

let server: ReturnType<typeof createServer> | null = null;

export async function startTestServer(): Promise<number> {
  await app.prepare();

  server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  return new Promise((resolve, reject) => {
    server!.listen(0, (err?: Error) => {
      if (err) {
        reject(err);
      } else {
        const address = server!.address();
        const port =
          typeof address === "object" && address ? address.port : 3000;
        resolve(port);
      }
    });
  });
}

export async function stopTestServer(): Promise<void> {
  if (server) {
    return new Promise((resolve, reject) => {
      server!.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
