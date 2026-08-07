const http = require('http');
const dgram = require('dgram');
const fs = require('fs');
const path = require('path');

const UDP_PORT = 4210; 
const HTTP_PORT = 3001;
const MAX_HISTORIAL = 30;

let historial = []; 

const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
  const temp = parseFloat(msg.toString());
  const lectura = { temp, timestamp: new Date().toISOString() };

  historial.push(lectura);
  if (historial.length > MAX_HISTORIAL) historial.shift();

  console.log(`[${lectura.timestamp}] ${rinfo.address} -> ${temp} °C`);
});

udpServer.on('error', (err) => {
  console.error(`Error UDP: ${err.stack}`);
  udpServer.close();
});

udpServer.bind(UDP_PORT, () => {
  console.log(`Escuchando datos UDP en el puerto ${UDP_PORT}`);
});


const httpServer = http.createServer((req, res) => {
  if (req.url === '/data') {
    const ultima = historial[historial.length - 1] || { temp: null, timestamp: null };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ultima,
      historial: [...historial].reverse() // más reciente primero
    }));
    return;
  }

  const indexPath = path.join(__dirname, 'public', 'index.html');
  fs.readFile(indexPath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error cargando la página');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`Página disponible en http://localhost:${HTTP_PORT}`);
});