import crypto from "crypto";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8001";
const AI_SERVICE_TIMEOUT_MS = Number(process.env.AI_SERVICE_TIMEOUT_MS || 300000);

const buildHash = (report, model) => {
    const input = `${model}|${report.heart_rate}|${report.temperature}|${report.oxygenation}`;
    return crypto.createHash("sha256").update(input).digest("hex");
};

const generateDiagnostic = async (report) => {
    const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            heart_rate: report.heart_rate,
            temperature: report.temperature,
            oxygenation: report.oxygenation
        }),
        signal: AbortSignal.timeout(AI_SERVICE_TIMEOUT_MS)
    });

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`AI service responded ${response.status}: ${detail}`);
    }

    const data = await response.json();

    return {
        anomaly: data.anomaly,
        description: data.description,
        hash: buildHash(report, data.model),
        model: data.model
    };
};

export default { generateDiagnostic };
