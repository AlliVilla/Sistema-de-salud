import Diagnostic from "../models/diagnostics.js"
import Report from "../models/reports.js"

const createDiagnostic = async(req, res) => {
    try{
        const { report_id, hash, description } = req.body;
        if(!report_id || !hash || !description ){
            return res.status(400).send("Bad request, some fields are empty")
        }

        const reportFound = await Report.findById(report_id);
        if(!reportFound){
            return res.status(404).send("Report not found")
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
        return res.status(500).send("Internal server error")
    }
}   

const getDiagnostics = async(req, res) => {
    try{
        const diagnostics = await Diagnostic.find()
        if(diagnostics.length === 0){
            return res.status(404).send("Diagnostics not found")
        }
        return res.status(200).send({diagnostics})
    }catch(error){
        console.error("ERROR FETCHING DIAGNOSTICS:", error);
        return res.status(500).send("Internal server error")
    }
}

const getDiagnostic = async(req, res) => {
    try{
        const { id } = req.params
        const findDiagnostic = await Diagnostic.findById(id)
        if(!findDiagnostic){
            return res.status(404).send("Diagnostic not found")
        }
        return res.status(200).send({findDiagnostic})
    }catch(error){
        console.error("ERROR FETCHING DIAGNOSTIC:", error);
        return res.status(500).send("Internal server error")
    }
}

export default { createDiagnostic, getDiagnostic, getDiagnostics }