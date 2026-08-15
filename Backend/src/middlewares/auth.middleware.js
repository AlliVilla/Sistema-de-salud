import crypto from "crypto";

// Seguridad del JWT.
// - La clave SIEMPRE viene de JWT_SECRET; NO existe fallback hardcodeado.
//   Si falta (o es débil) el proceso aborta al cargar el módulo (fail-closed):
//   jamás se firman/validan tokens con una clave pública embebida en el repo.
// - La firma es HMAC-SHA256 y se compara con timingSafeEqual.
// - exp es OBLIGATORIO y numérico; los tokens sin expiración se rechazan.

const MIN_SECRET_LENGTH = 32;

function loadSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < MIN_SECRET_LENGTH) {
        throw new Error(
            `JWT_SECRET no está configurado o es demasiado corto (mínimo ${MIN_SECRET_LENGTH} caracteres). ` +
            "Configura una clave fuerte en Backend/.env (ver Backend/.env.example). " +
            "El arranque se detiene por seguridad."
        );
    }
    return secret;
}

const JWT_SECRET = loadSecret();

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

function base64url(input) {
    return Buffer.from(input).toString("base64url");
}

export function signToken(payload) {
    const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + TOKEN_TTL_SECONDS;
    const body = base64url(JSON.stringify({ ...payload, iat, exp }));
    const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
    return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
    try {
        const [header, body, signature] = token.split(".");
        if (!header || !body || !signature) return null;

        // Fuerza el algoritmo; rechaza tokens firmados con otro alg.
        const headerObj = JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
        if (headerObj.alg !== "HS256") return null;

        const expected = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

        const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        const now = Math.floor(Date.now() / 1000);

        // La expiración es obligatoria: sin exp numérica (o ya vencida) se rechaza.
        if (typeof payload.exp !== "number" || payload.exp <= now) return null;
        if (typeof payload.sub !== "string" || !payload.sub) return null;

        return payload;
    } catch {
        return null;
    }
}

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    const payload = verifyToken(token);
    if (!payload) {
        return res.status(401).json({ message: "Unauthorized, invalid or expired token" });
    }

    req.user = { id: payload.sub };
    next();
};

export default authMiddleware;