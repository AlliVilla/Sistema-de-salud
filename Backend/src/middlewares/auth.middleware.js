import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

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

        const expected = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
        const a = Buffer.from(signature);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

        const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
        if (typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000)) return null;
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