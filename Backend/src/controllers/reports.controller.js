import Report from "../models/reports.js"
import { mapMongoError } from "../utils/errors.js"

// Los reportes SIEMPRE pertenecen al usuario autenticado (req.user.id).
// Nunca se confía en un user_id enviado en el body, y las consultas
// se filtran por el dueño para no exponer datos de otros pacientes.

const createReport = async(req, res) => {
    try{
        const { heart_rate, temperature, oxygenation } = req.body;
        if(!heart_rate || !temperature || !oxygenation ){
            return res.status(400).send({ message: "Bad request, some fields are empty", result: false })
        }

        const newReport = new Report({ user_id: req.user.id, heart_rate, temperature, oxygenation })

        const result = await newReport.save()

        const sendReport = {
            id: result._id,
            user_id: result.user_id,
            heart_rate: result.heart_rate, 
            temperature: result.temperature, 
            oxygenation: result.oxygenation,
            createdAt: result.createdAt
        }
        res.status(201).send({message: "Report created succesfully", report: sendReport});
    }catch(error){
        console.error("ERROR CREATING REPORT:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}   

const getReports = async(req, res) => {
    try{
        const reports = await Report.find({ user_id: req.user.id })
        if(reports.length === 0){
            return res.status(404).send({ message: "Reports not found", result: false })
        }
        return res.status(200).send({reports})
    }catch(error){
        console.error("ERROR FETCHING REPORTS:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const getReport = async(req, res) => {
    try{
        const { id } = req.params
        const findReport = await Report.findOne({ _id: id, user_id: req.user.id })
        if(!findReport){
            return res.status(404).send({ message: "Report not found", result: false })
        }
        return res.status(200).send({findReport})
    }catch(error){
        console.error("ERROR FETCHING REPORT:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

export default { createReport,  getReports, getReport }