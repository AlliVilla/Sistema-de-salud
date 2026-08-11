const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 8443
const DIST_DIR = path.join(__dirname, '..', '..', 'Frontend', 'dist')

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const httpServer = http.createServer((req, res) => {
  let filePath

  if (req.url === '/') {
    filePath = path.join(DIST_DIR, 'index.html')
  } else {
    filePath = path.join(DIST_DIR, req.url)
    const ext = path.extname(filePath)
    if (!ext) {
      filePath = path.join(DIST_DIR, 'index.html')
    }
  }

  const ext = path.extname(filePath)
  const contentType = MIME[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Monitor disponible en http://localhost:${PORT}`)
  console.log('Abre esta URL en Chrome o Edge para usar Web Bluetooth.')
})
