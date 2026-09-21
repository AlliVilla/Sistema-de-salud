#!/bin/sh
set -e

WALLET_DIR="/app/wallet"

# Solo enrola si la identidad todavía no existe en el wallet.
# En tu caso ya vienen admin.id y appUser.id incluidos, así que
# esto normalmente se salta y sirve solo de red de seguridad
# (p.ej. si borras el volumen del wallet).
if [ ! -f "$WALLET_DIR/appUser.id" ]; then
    echo "[entrypoint] appUser no encontrado en el wallet, enrolando..."

    if [ ! -f "$WALLET_DIR/admin.id" ]; then
        echo "[entrypoint] admin no encontrado, enrolando admin primero..."
        node enrollAdmin.js
    fi

    node registerUser.js
else
    echo "[entrypoint] appUser ya existe en el wallet, se omite el enroll."
fi

exec "$@"