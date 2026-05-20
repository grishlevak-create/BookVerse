const fs = require('node:fs');
const path = require('node:path');

function pathSegmentsToKeep(basePath) {
  const trimmed = (basePath || '/').trim().replace(/^\/+|\/+$/g, '');
  if (!trimmed) return 0;
  return trimmed.split('/').filter(Boolean).length;
}

const base = process.env.VITE_BASE_PATH || '/';
const keep = pathSegmentsToKeep(base);
const distDir = path.resolve(__dirname, '..', 'dist');
const out = path.join(distDir, '404.html');

const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>BookVerse</title>
    <script>
      var pathSegmentsToKeep = ${keep};
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
          l.pathname
            .split('/')
            .slice(0, 1 + pathSegmentsToKeep)
            .join('/') +
          '/?/' +
          l.pathname
            .slice(1)
            .split('/')
            .slice(pathSegmentsToKeep)
            .join('/')
            .replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash
      );
    </script>
  </head>
  <body></body>
</html>
`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(out, html, 'utf8');
