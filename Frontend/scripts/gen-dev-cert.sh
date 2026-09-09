#!/usr/bin/env bash
set -euo pipefail

# Genera un certificado confiado (mkcert) para que Web Bluetooth funcione
# tanto en localhost como en la IP de red, sin advertencias de "no seguro".
#
# Uso:
#   ./scripts/gen-dev-cert.sh                      (detecta la IP de LAN)
#   ./scripts/gen-dev-cert.sh 172.16.229.84        (IP explícita)
#   ./scripts/gen-dev-cert.sh 172.16.229.84 192.168.1.10
#
# Requiere mkcert y nss-tools (certutil). Instalación:
#   yay -S mkcert nss-tools    (o paru -S mkcert nss-tools)

cd "$(dirname "$0")/.."

if ! command -v mkcert >/dev/null 2>&1; then
  echo "ERROR: mkcert no está instalado. Instálalo con: yay -S mkcert nss-tools" >&2
  exit 1
fi

# IPs a cubrir: las pasadas como argumentos o las IPs de LAN detectadas.
IPS=("$@")
if [ ${#IPS[@]} -eq 0 ]; then
  mapfile -t IPS < <(ip -o -4 addr show scope global | awk '{print $4}' | cut -d/ -f1)
fi
if [ ${#IPS[@]} -eq 0 ]; then
  IPS=("127.0.0.1")
fi

echo "==> Registrando la CA local en el sistema (pedirá sudo)…"
mkcert -install

mkdir -p certs

echo "==> Generando certificado para: localhost 127.0.0.1 ${IPS[*]}"
mkcert -cert-file certs/dev-cert.pem -key-file certs/dev-key.pem localhost 127.0.0.1 "${IPS[@]}"

echo
echo "OK. Certificado en: certs/dev-cert.pem y certs/dev-key.pem"
echo "Ahora reinicia: pnpm run dev  -> servirá por https://localhost:8443 e https://<IP>:8443"
