import mongoose from "mongoose"
import Diagnostic from "../models/diagnostics.js"
import Report from "../models/reports.js"
import ollamaService from "../services/ollama.service.js"
import { mapMongoError } from "../utils/errors.js"

// Los diagnósticos solo son accesibles para el dueño del reporte asociado.
// Si el report_id pertenece a otro usuario, la operación devuelve 404.

async function getOwnedReportIds(userId) {
    const reports = await Report.find({ user_id: userId }).select("_id");
    return reports.map((r) => r._id);
}

const createDiagnostic = async(req, res) => {
    try{
        const { report_id, hash, description } = req.body;
        if(!report_id || !hash || !description ){
            return res.status(400).send({ message: "Bad request, some fields are empty", result: false })
        }

        const reportFound = await Report.findOne({ _id: report_id, user_id: req.user.id });
        if(!reportFound){
            return res.status(404).send({ message: "Report not found", result: false })
        }

        const newDiagnostic = new Diagnostic({ report_id, hash, description })

        const result = await newDiagnostic.save()

        const sendDiagnostic = {
            id: result._id,
            report_id: result.report_id, 
            hash: result.hash,
            description: result.description
        }
        res.status(201).send({message: "Diagnostic created succesfully", diagnostic: sendDiagnostic});
    }catch(error){
        console.error("ERROR CREATING DIAGNOSTIC:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}   

const getDiagnostics = async(req, res) => {
    try{
        const reportIds = await getOwnedReportIds(req.user.id);
        const diagnostics = await Diagnostic.find({ report_id: { $in: reportIds } })
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

        const newDiagnostic = new Diagnostic({
            report_id: reportFound._id,
            hash: result.hash,
            description: result.description
        })

        const saved = await newDiagnostic.save()

        const sendDiagnostic = {
            id: saved._id,
            report_id: saved.report_id,
            description: saved.description
        }
        return res.status(201).send({message: "Diagnostic created succesfully", diagnostic: sendDiagnostic});
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

export default { createDiagnostic, getDiagnostic, getDiagnostics, generate }