import { Wallets } from "fabric-network";
import FabricCAServices from "fabric-ca-client";
import fs from "fs";
import path from "path";

const connectionProfilePath = path.resolve(process.cwd(), "connection-profile.json");
const walletPath = path.resolve(process.cwd(), "wallet");

async function main() {
    try {
        const ccp = JSON.parse(fs.readFileSync(connectionProfilePath, "utf8"));

        const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );

        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const userExists = await wallet.get("appUser");
        if (userExists) {
            console.log('La identidad "appUser" ya existe en el wallet.');
            return;
        }

        const adminIdentity = await wallet.get("admin");
        if (!adminIdentity) {
            console.log('No se encontró la identidad "admin". Corre enrollAdmin.js primero.');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, "admin");

        const secret = await ca.register(
            {
                affiliation: "org1.department1",
                enrollmentID: "appUser",
                role: "client",
            },
            adminUser
        );

        const enrollment = await ca.enroll({
            enrollmentID: "appUser",
            enrollmentSecret: secret,
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: "Org1MSP",
            type: "X.509",
        };

        await wallet.put("appUser", x509Identity);
        console.log('Identidad "appUser" registrada y guardada en el wallet correctamente.');
    } catch (error) {
        console.error(`Error al registrar el usuario: ${error}`);
        process.exit(1);
    }
}

main();
