import Report from "../models/reports.js"
import User from "../models/users.js"

const createReport = async(req, res) => {
    try{
        const { user_id, heart_rate, temperature, oxygenation } = req.body;
        if(!user_id || !heart_rate || !temperature || !oxygenation ){
            return res.status(400).send("Bad request, some fields are empty")
        }

        const userFound = await User.findById(user_id);
        if(!userFound){
            return res.status(404).send("User not found")
        }

        const newReport = new Report({ user_id, heart_rate, temperature, oxygenation })

        const result = await newReport.save()

        const sendReport = {
            id: result._id,
            heart_rate: result.heart_rate, 
            temperature: result.temperature, 
            oxygenation: result.oxygenation
        }
        res.status(201).send({message: "Report created succesfully", report: sendReport});
    }catch(error){
        return res.status(500).send("Internal server error")
    }
}   

const getReports = async(req, res) => {
    try{
        const reports = await Report.find()
        if(reports.length === 0){
            return res.status(404).send("Reports not found")
        }
        return res.status(200).send({reports})
    }catch(error){
        return res.status(500).send("Internal server error")
    }
}

const getReport = async(req, res) => {
    try{
        const { id } = req.params
        if(!id){
            return res.status(400).send("Bad request, some fields are empty")
        }
        const findReport = await Report.findById(id)
        if(!findReport){
            return res.status(404).send("Report not found")
        }
        return res.status(200).send({findReport})
    }catch(error){
        return res.status(500).send("Internal server error")
    }
}

export default { createReport,  getReports, getReport }