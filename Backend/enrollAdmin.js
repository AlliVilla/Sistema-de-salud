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

        const adminExists = await wallet.get("admin");
        if (adminExists) {
            console.log('La identidad "admin" ya existe en el wallet.');
            return;
        }

        const enrollment = await ca.enroll({
            enrollmentID: "admin",
            enrollmentSecret: "adminpw",
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: "Org1MSP",
            type: "X.509",
        };

        await wallet.put("admin", x509Identity);
        console.log('Identidad "admin" enrolada y guardada en el wallet correctamente.');
    } catch (error) {
        console.error(`Error al enrolar el admin: ${error}`);
        process.exit(1);
    }
}

main();
