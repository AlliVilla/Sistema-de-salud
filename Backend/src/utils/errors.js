import mongoose from "mongoose";

// Centraliza el mapeo de errores de Mongoose a respuestas HTTP legibles.
// Evita que errores de validación/esquema lleguen como 500 "Internal server error".

export function mapMongoError(error) {
    if (error instanceof mongoose.Error.ValidationError) {
        const message = Object.values(error.errors).map((e) => e.message).join(" · ");
        return { status: 400, message };
    }
    if (error instanceof mongoose.Error.CastError) {
        return { status: 400, message: "Identificador no válido." };
    }
    if (error && error.name === "MongoServerError" && error.code === 11000) {
        return { status: 409, message: "El correo electrónico ya está en uso." };
    }
    return { status: 500, message: "Error interno del servidor." };
}