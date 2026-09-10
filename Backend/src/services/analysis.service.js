import Report from "../models/reports.js";
import User from "../models/users.js";
import ollamaService from "./ollama.service.js";
import diagnosticsController from "../controllers/diagnostics.controller.js";

// Análisis automático por lotes: cada vez que el usuario acumula
// `diagnosis_frequency` reportes reales, se promedian los últimos N y se
// consulta a la IA. Si hay anomalía se crea un reporte sintético (promedio)
// y se persiste el diagnóstico con blockchain + Telegram.

const round = (value, decimals) => {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
};

const average = (reports, field, decimals) => {
    const total = reports.reduce((sum, report) => sum + report[field], 0);
    return round(total / reports.length, decimals);
};

const runScheduledAnalysis = async (userId, frequency) => {
    try {
        const reports = await Report.find({
            user_id: userId,
            is_aggregate: { $ne: true }
        })
            .sort({ createdAt: -1 })
            .limit(frequency);

        if (reports.length === 0) return;

        const averaged = {
            heart_rate: average(reports, "heart_rate", 0),
            temperature: average(reports, "temperature", 1),
            oxygenation: average(reports, "oxygenation", 0)
        };

        const result = await ollamaService.generateDiagnostic(averaged);

        if (!result.anomaly) {
            console.log(
                `[analysis] Usuario ${userId}: sin anomalía en el promedio de ${reports.length} reportes.`
            );
            return;
        }

        const aggregate = await Report.create({
            user_id: userId,
            heart_rate: averaged.heart_rate,
            temperature: averaged.temperature,
            oxygenation: averaged.oxygenation,
            is_aggregate: true,
            sample_count: reports.length,
            source_report_ids: reports.map((report) => report._id)
        });

        const user = await User.findOne({ _id: userId }).select("name telegramChatId");

        const persisted = await diagnosticsController.persistDiagnostic({
            report: aggregate,
            user,
            hash: result.hash,
            description: result.description
        });

        console.log(
            `[analysis] Usuario ${userId}: diagnóstico generado para el promedio de ${reports.length} reportes.`,
            {
                blockchainError: persisted.blockchainError,
                telegramError: persisted.telegramError
            }
        );
    } catch (error) {
        console.error("[analysis] Error en el análisis programado:", error);
    }
};

export default { runScheduledAnalysis };
