import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { existsSync } from 'fs';
import { loadEnv } from 'vite';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);

function loadEnvFiles() {
  const baseDirs = [process.cwd(), root].filter((d, i, a) => a.indexOf(d) === i);
  for (const dir of baseDirs) {
    const envPath = path.resolve(dir, '.env');
    const envLocalPath = path.resolve(dir, '.env.local');
    if (existsSync(envPath)) dotenv.config({ path: envPath, override: true });
    if (existsSync(envLocalPath)) dotenv.config({ path: envLocalPath, override: true });
  }
}

function toFileUrl(p) {
  return pathToFileURL(path.resolve(p)).href;
}

let apiReady = null;

function loadApi() {
  if (apiReady) return apiReady;
  apiReady = (async () => {
    loadEnvFiles();
    const env = loadEnv('development', root, '');
    Object.entries(env).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v != null) process.env[k] = v;
    });
    loadEnvFiles();
    const { connectDB } = await import(toFileUrl(path.join(root, 'server/db.js')));
    const app = (await import(toFileUrl(path.join(root, 'server/app.js')))).default;
    await connectDB();
    return app;
  })();
  return apiReady;
}

export default function vitePluginApi() {
  return {
    name: 'vite-plugin-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api')) return next();
        loadApi()
          .then((app) => {
            app(req, res, (err) => {
              if (err) {
                console.error('[api]', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message || 'Server error' }));
              } else {
                next();
              }
            });
          })
          .catch((err) => {
            console.error('[api load error]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Server error' }));
          });
      });
    },
  };
}
