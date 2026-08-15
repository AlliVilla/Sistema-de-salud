import mongoose from "mongoose";

const users = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'El correo es requerido.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Correo inválido"]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida.'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'El nombre completo es requerido.'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'El numero de teléfono es requerido.'],
        trim: true,
        match: [/^\d{8}$/, "Debe contener exactamente 8 dígitos"]
    },
    emergency_phone: {
        type: String,
        required: [true, 'El numero de emergencia es requerido.'],
        trim: true,
        match: [/^\d{8}$/, "Debe contener exactamente 8 dígitos"]
    },
    address: {
        type: String,
        required: [true, 'La dirección es requerida.'],
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    age: {
        type: Number,
        required: [true, 'La edad es requerida.'],
        min: [0, 'La edad no puede ser negativa.'],
        max: [90, 'La edad no es válida.']
    },
    condition: {
        type: String,
        required: [true, 'Su condicion es requerida.'],
        trim: true
    }
},{
    timestamps: true
});

export default mongoose.model("User", users)