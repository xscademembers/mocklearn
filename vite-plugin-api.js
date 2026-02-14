import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadEnv } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname);

function toFileUrl(p) {
  return pathToFileURL(path.resolve(p)).href;
}

let apiReady = null;

function loadApi() {
  if (apiReady) return apiReady;
  apiReady = (async () => {
    const env = loadEnv('development', root, '');
    Object.assign(process.env, env);
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
