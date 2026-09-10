#!/bin/bash
# Levanta Hyperledger Fabric test-network desde cero (para compañeros que
# no tienen nada instalado, solo Docker Desktop) y despliega el chaincode
# del proyecto, que vive dentro de este mismo repo en chaincode/registrocontract.
#
# Uso: correr desde cualquier parte dentro del repo clonado.
#   chmod +x bootstrap-network.sh
#   ./bootstrap-network.sh
# Requisitos: Docker Desktop corriendo, curl, git.

set -e

# --- Ajusta estas 2 variables si tu canal fue creado con otra versión ---
FABRIC_VERSION="2.5.9"       # confirma con: peer version
CA_VERSION="1.5.7"
CHAINCODE_NAME="registrocontract"
CHAINCODE_LANG="javascript"
# -------------------------------------------------------------------------

REPO_ROOT="$(git rev-parse --show-toplevel)"
CHAINCODE_PATH="$REPO_ROOT/chaincode"

if [ ! -d "$CHAINCODE_PATH" ]; then
    echo "ERROR: no encontré chaincode en $CHAINCODE_PATH"
    echo "Verifica que el chaincode esté commiteado en el repo bajo chaincode/registrocontract"
    exit 1
fi

INSTALL_DIR="$HOME/.fabric-env"

echo "== 1/4: Instalando binarios e imágenes de Fabric (${FABRIC_VERSION}) =="
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

if [ ! -d "fabric-samples" ]; then
    curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh
    chmod +x install-fabric.sh
    ./install-fabric.sh docker samples binary "$FABRIC_VERSION" "$CA_VERSION"
else
    echo "fabric-samples ya existe en $INSTALL_DIR, se omite la descarga."
fi

export PATH="$INSTALL_DIR/fabric-samples/bin:$PATH"

echo "== 2/4: Levantando test-network con CA =="
cd fabric-samples/test-network
./network.sh down || true
./network.sh up createChannel -ca -c mychannel

echo "== 3/4: Empaquetando y desplegando el chaincode ($CHAINCODE_NAME) =="
# Se usa la ruta absoluta al chaincode dentro del repo, así funciona sin
# importar dónde quedó instalado fabric-samples en cada máquina.
./network.sh deployCC \
    -ccn "$CHAINCODE_NAME" \
    -ccp "$CHAINCODE_PATH" \
    -ccl "$CHAINCODE_LANG"

echo "== 4/4: Listo =="
echo "Red Fabric arriba en la red docker 'fabric_test', canal 'mychannel',"
echo "chaincode '$CHAINCODE_NAME' desplegado desde $CHAINCODE_PATH."
echo ""
echo "Siguiente paso: desde Backend/, correr:"
echo "  docker compose up --build"