import mongoose from "mongoose";

const diagnostics = new mongoose.Schema({
    report_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Report",
        required: [true, 'El diagnostico debe estar relacionado con un reporte.']
    },
    hash: {
        type: String,
        required: [true, 'El hash es requerido.']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida.']
    }
},{
    timestamps: false
});

export default mongoose.model("Diagnostic", diagnostics)