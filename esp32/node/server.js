const http = require('http');
const fs = require('fs');
const path = require('path');

const HTTP_PORT = 3000;

const httpServer = http.createServer((req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  fs.readFile(indexPath, (err, data) => {
    if (err) { res.writeHead(500); res.end('Error cargando la página'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`Monitor disponible en http://localhost:${HTTP_PORT}`);
  console.log('Abre esta URL en Chrome o Edge para usar Web Bluetooth.');
});
