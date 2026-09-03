import rateLimit from "express-rate-limit";

const base = {
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Demasiadas peticiones. Intenta de nuevo más tarde.", result: false }
};

export const loginLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    limit: 10,
    skipSuccessfulRequests: true
});

export const createAccountLimiter = rateLimit({
    ...base,
    windowMs: 60 * 60 * 1000,
    limit: 5
});

export const confirmEmailLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    limit: 20
});

export const apiLimiter = rateLimit({
    ...base,
    windowMs: 15 * 60 * 1000,
    limit: 300
});
