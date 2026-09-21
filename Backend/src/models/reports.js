import mongoose from "mongoose";

const reports = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, 'El reporte debe estar relacionado con un usuario.']
    },
    heart_rate: {
        type: Number,
        required: [true, 'La ritmo cardiaco es requerido.']
    },
    temperature: {
        type: Number,
        required: [true, 'La temperatura es requerida.']
    },
    oxygenation: {
        type: Number,
        required: [true, 'La oxigenacion es requerida.']
    },
    is_aggregate: {
        type: Boolean,
        default: false
    },
    sample_count: {
        type: Number,
        default: 1
    },
    source_report_ids: {
        type: [mongoose.Schema.ObjectId],
        ref: "Report",
        default: []
    },
},{
    timestamps: { createdAt: true, updatedAt: false }
});

export default mongoose.model("Report", reports)