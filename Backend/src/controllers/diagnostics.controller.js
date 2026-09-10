import mongoose from "mongoose"
import Diagnostic from "../models/diagnostics.js"
import Report from "../models/reports.js"
import User from "../models/users.js"
import telegramService from "../services/telegram.service.js";
import ollamaService from "../services/ollama.service.js"
import { mapMongoError } from "../utils/errors.js"

import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Los diagnósticos solo son accesibles para el dueño del reporte asociado.
// Si el report_id pertenece a otro usuario, la operación devuelve 404.

const channelName = "mychannel";
const chaincodeName = "registrocontract";
const connectionProfilePath = path.resolve(
    process.cwd(),
    "connection-profile.json"
);
const walletPath = path.resolve(process.cwd(), "wallet");

const conectarRed = async (identidad = "appUser") => {
    const connectionProfile = JSON.parse(
        fs.readFileSync(connectionProfilePath, "utf8")
    );
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identityExists = await wallet.get(identidad);
    if (!identityExists) {
        throw new Error(
            `La identidad "${identidad}" no existe en el wallet. Regístrala primero.`
        );
    }

    const gateway = new Gateway();
    await gateway.connect(connectionProfile, {
        wallet,
        identity: identidad,
        discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);

    return { gateway, contract };
};

async function getOwnedReportIds(userId) {
    const reports = await Report.find({ user_id: userId }).select("_id");
    return reports.map((r) => r._id);
}

// Persiste un diagnóstico, lo registra en Hyperledger Fabric y notifica por
// Telegram. Se usa tanto para el disparo manual (/diagnostic/generate) como
// para el análisis automático por lotes (analysis.service.js).
// `report` puede ser un Report real o un Report sintético (promedio).
const persistDiagnostic = async ({ report, user, hash, description }) => {
    let gateway;
    let blockchainRecord = null;
    let blockchainError = null;
    let txHash = null;

    const newDiagnostic = new Diagnostic({
        report_id: report._id,
        hash,
        description
    })

    const saved = await newDiagnostic.save()

    const sendDiagnostic = {
        id: saved._id,
        report_id: saved.report_id,
        hash: saved.hash,
        description: saved.description
    }

    try {
        const conexion = await conectarRed();
        gateway = conexion.gateway;
        const { contract } = conexion;

        const transaction = contract.createTransaction("CreateAsset");
        txHash = transaction.getTransactionId();

        const resultado = await transaction.submit(
            sendDiagnostic.id.toString(),
            JSON.stringify({
                pulse: report.heart_rate,
                temp: report.temperature,
                oxygen: report.oxygenation,
                desc: description,
                hash
            })
        );

        blockchainRecord = JSON.parse(resultado.toString());
    } catch (bcError) {
        blockchainError = bcError.message;
    } finally {
        if (gateway) gateway.disconnect();
    }

    let telegramError = null;
    if (user?.telegramChatId) {
        try {
            await telegramService.sendMessage(
                user.telegramChatId,
                `Nuevo diagnóstico generado \n\n` +
                `Hola ${user.name}, \n\n` +
                `Se ha generado un nuevo diagnóstico médico automáticamente en Poner nombre aqui. \n\n` +
                `Diagnóstico:\n${description}\n\n` +
                `La información ha sido registrada y puede ser consultada desde tu historial.`
            );
        } catch (error) {
            telegramError = error.message;
            console.error("ERROR SENDING TELEGRAM MESSAGE:", error);
        }
    }

    return { sendDiagnostic, blockchainRecord, blockchainError, txHash, telegramError };
};

const createDiagnostic = async(req, res) => {
    let gateway;
    try{
        const { report_id, description } = req.body;
        if(!report_id || !description ){
            return res.status(400).send({ message: "Bad request, some fields are empty", result: false })
        }

        const reportFound = await Report.findOne({ _id: report_id, user_id: req.user.id });
        if(!reportFound){
            return res.status(404).send({ message: "Report not found", result: false })
        }

        const userFound = await User.findOne({ _id: reportFound.user_id }).select("name phone emergency_phone telegramChatId")
        if(!userFound){
            return res.status(404).send({ message: "User not found", result: false })
        }

        const hash = crypto.createHash("sha256").update(JSON.stringify({
            pulse: reportFound.heart_rate, 
            temp: reportFound.temperature, 
            oxygen: reportFound.oxygenation,
            desc: description
        })).digest("hex")

        let blockchainRecord = null;
        let blockchainError = null;
        let txHash = null;

        const newDiagnostic = new Diagnostic({ report_id, hash, description })

        const result = await newDiagnostic.save()

        const sendDiagnostic = {
            id: result._id,
            report_id: result.report_id, 
            hash: result.hash,
            description: result.description
        }

        try {
            const conexion = await conectarRed();
            gateway = conexion.gateway;
            const { contract } = conexion;

            const transaction = contract.createTransaction("CreateAsset");
            txHash = transaction.getTransactionId();

            const resultado = await transaction.submit(
                sendDiagnostic.id.toString(),
                JSON.stringify({ 
                    pulse: reportFound.heart_rate, 
                    temp: reportFound.temperature, 
                    oxygen: reportFound.oxygenation,
                    desc: description,
                    hash 
                })
            );

            blockchainRecord = JSON.parse(resultado.toString());
        } catch (bcError) {
            blockchainError = bcError.message;
        }

        let telegramError = null;
        if (userFound.telegramChatId) {
            try {
                await telegramService.sendMessage(
                    userFound.telegramChatId,
                    `Nuevo diagnóstico generado \n\n` +
                    `Hola ${userFound.name}, \n\n` +
                    `Se ha generado un nuevo diagnóstico médico en Poner nombre aqui. \n\n` +
                    `Diagnóstico:\n${description}\n\n` +
                    `La información ha sido registrada y puede ser consultada desde tu historial.`
                );
            } catch (error) {
                telegramError = error.message;
                console.error("ERROR SENDING TELEGRAM MESSAGE:", error);
            }
        }

        return res.status(201).json({
            message: blockchainError
                ? "Created diagnostico successfully, but blockchain registration failed."
                : "Created diagnostico successfully and registered on blockchain.",
            hash,
            txHash,
            data: {
                diagnostic: sendDiagnostic,
                blockchain: blockchainRecord,
                blockchainError,
                telegramError
            },
        });
    }catch(error){
        console.error("ERROR CREATING DIAGNOSTIC:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    } finally {
        if(gateway) gateway.disconnect();
    }
}   

const getDiagnostics = async(req, res) => {
    try{
        const reportIds = await getOwnedReportIds(req.user.id);
        const diagnostics = await Diagnostic.find({ report_id: { $in: reportIds } }).populate('report_id')
        if(diagnostics.length === 0){
            return res.status(404).send({ message: "Diagnostics not found", result: false })
        }
        return res.status(200).send({diagnostics})
    }catch(error){
        console.error("ERROR FETCHING DIAGNOSTICS:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const getDiagnostic = async(req, res) => {
    try{
        const { id } = req.params
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send("Bad request, invalid report id")
        }
        const reportIds = await getOwnedReportIds(req.user.id);
        const findDiagnostic = await Diagnostic.findOne({ _id: id, report_id: { $in: reportIds } })
        if(!findDiagnostic){
            return res.status(404).send({ message: "Diagnostic not found", result: false })
        }
        return res.status(200).send({findDiagnostic})
    }catch(error){
        console.error("ERROR FETCHING DIAGNOSTIC:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const generate = async(req, res) => {
    try{
        const { report_id } = req.params
        if(!mongoose.Types.ObjectId.isValid(report_id)){
            return res.status(400).send("Bad request, invalid report id")
        }

        const reportFound = await Report.findOne({ _id: report_id, user_id: req.user.id })
        if(!reportFound){
            return res.status(404).send("Report not found")
        }

        const existing = await Diagnostic.findOne({ report_id })
        if(existing){
            const sendExisting = {
                id: existing._id,
                report_id: existing.report_id,
                description: existing.description
            }
            return res.status(200).send({message: "Diagnostic already exists", diagnostic: sendExisting})
        }

        const result = await ollamaService.generateDiagnostic(reportFound)
        if(!result.anomaly){
            return res.status(200).send({message: "No anomaly detected", diagnostic: null})
        }

        const userFound = await User.findOne({ _id: reportFound.user_id }).select("name telegramChatId")

        const { sendDiagnostic, blockchainRecord, blockchainError, txHash, telegramError } =
            await persistDiagnostic({
                report: reportFound,
                user: userFound,
                hash: result.hash,
                description: result.description
            })

        return res.status(201).json({
            message: blockchainError
                ? "Created diagnostico successfully, but blockchain registration failed."
                : "Created diagnostico successfully and registered on blockchain.",
            hash: result.hash,
            txHash,
            data: {
                diagnostic: sendDiagnostic,
                blockchain: blockchainRecord,
                blockchainError,
                telegramError,
            },
        });
    }catch(error){
        console.error("ERROR GENERATING DIAGNOSTIC:", error)

        if(error.name === "TimeoutError" || error.name === "AbortError"){
            return res.status(504).send("AI service timeout")
        }
        if(error.cause?.code === "ECONNREFUSED"){
            return res.status(503).send("AI service unavailable")
        }
        return res.status(500).send("Internal server error")
    }
}

const verificarIntegridad = async (req, res) => {
    let gateway;
    try {
        const { id } = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send("Bad request, invalid report id")
        }

        // 1. Trae el registro actual desde la base de datos
        const reportIds = await getOwnedReportIds(req.user.id);
        const findDiagnostic = await Diagnostic.findOne({ _id: id, report_id: { $in: reportIds } })
        if (!findDiagnostic) {
            return res
                .status(404)
                .json({ message: "Report not found in database." });
        }
        const diagnosticData = findDiagnostic.toJSON();
        const findReport = await Report.findOne({ _id: diagnosticData.report_id })
        if(!findReport){
            return res.status(404).send({ message: "Report not found", result: false })
        }

        // 2. Recalcula el hash con los datos ACTUALES de la base de datos
        const hashActual = crypto
            .createHash("sha256")
            .update(
                JSON.stringify({
                    pulse: findReport.heart_rate,
                    temp: findReport.temperature,
                    oxygen: findReport.oxygenation,
                    desc: diagnosticData.description
                })
            )
            .digest("hex");

        // 3. Trae el registro guardado en la blockchain (inmutable)
        const conexion = await conectarRed();
        gateway = conexion.gateway;
        const { contract } = conexion;

        let resultado
        try{
            resultado = await contract.evaluateTransaction("GetAsset", id);
        }catch(error){
            return res.status(200).json({
                message: "El diagnostico no esta guardado en la blockchain."
            });
        }        
        const registroBlockchain = JSON.parse(resultado.toString());
        const hashBlockchain = registroBlockchain.hash;

        if (!hashBlockchain) {
            return res.status(200).json({
                message: "El diagnostico en blockchain no tiene hash guardado (fue creado antes de habilitar esta verificación)."
            });
        }

        // 4. Compara ambos hashes
        const integro = hashActual === hashBlockchain;

        return res.status(200).json({
            message: integro
                ? "El diagnostico no ha sido alterado. Integridad confirmada."
                : "¡Alerta! El diagnostico en la base de datos no coincide con la blockchain.",
            data: {
                integro,
                hashActual,
                hashBlockchain,
                diagnostic: diagnosticData,
            },
        });
    } catch (error) {
        if (error.message.includes("no existe")) {
            return res.status(404).json({
                message: "Este registro no existe en la blockchain.",
            });
        }
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message,
        });
    } finally {
        if (gateway) gateway.disconnect();
    }
};

export default { createDiagnostic, getDiagnostic, getDiagnostics, generate, verificarIntegridad, persistDiagnostic }