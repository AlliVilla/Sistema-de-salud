import User from "../models/users.js"
import bycrypt from 'bcryptjs'
import crypto from "crypto"
import transporter from "../middlewares/email.js"
import { signToken } from "../middlewares/auth.middleware.js"
import { mapMongoError } from "../utils/errors.js"

const createUser = async (req, res) => {
    try {
        const { email, password, name, phone, emergency_phone, address, age, condition } = req.body;
        if (!email || !password || !name || !phone || !emergency_phone || !address || !age || !condition) {
            return res.status(400).send({ message: "Faltan campos obligatorios", result: false })
        }

        const findEmail = await User.findOne({ email })
        if (findEmail) {
            if (findEmail.emailConfirmation) {
                return res.status(409).send({ message: "El correo electrónico ya está en uso", result: false })
            }

            const confirmationToken = crypto.randomBytes(32).toString("hex")
            const hashedToken = crypto.createHash("sha256").update(confirmationToken).digest("hex")
            const hash_password = await bycrypt.hash(password, 10)

            await User.findByIdAndUpdate(findEmail._id, {
                password: hash_password,
                name,
                phone,
                emergency_phone,
                address,
                age,
                condition,
                emailConfirmationToken: hashedToken,
                emailConfirmationExpires: Date.now() + 15 * 60 * 1000
            })

            await transporter.sendMail({
                from: `"Grupo 4 Vanguardia" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Confirma tu correo electrónico",
                html: `
                        <h2>Bienvenido a Falta el nombre aqui</h2>

                        <p>
                            Tu cuenta ha sido creada correctamente.
                        </p>

                        <h1>
                            ${confirmationToken}
                        </h1>

                        <p>
                            Este es tu token para confirmar tu correo electrónico.
                        </p>

                        <p>
                            Este token expirará en 15 minutos.
                        </p>
                    `
            });

            return res.status(201).send({
                message: "Usuario creado correctamente, esperando confirmacion de email",
                user: {
                    id: findEmail._id,
                    email: findEmail.email,
                    name: findEmail.name,
                    phone: findEmail.phone,
                    emergency_phone: findEmail.emergency_phone,
                    address: findEmail.address,
                    status: findEmail.status,
                    age: findEmail.age,
                    condition: findEmail.condition
                }
            });
        }

        const confirmationToken = crypto.randomBytes(32).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(confirmationToken).digest("hex")

        const hash_password = await bycrypt.hash(password, 10)

        // Seeding del primer administrador: si no existe ningún usuario
        // con rol 'Admin' en el sistema, el primer usuario registrado se
        // convierte automáticamente en administrador. Así hay una forma
        // inicial de acceder al panel de administración.
        const adminCount = await User.countDocuments({ role: 'Admin' })
        const role = adminCount === 0 ? 'Admin' : 'Client'

        const newUser = new User({
            email,
            password: hash_password,
            name,
            phone,
            emergency_phone,
            address,
            age,
            condition,
            role,
            emailConfirmationToken: hashedToken,
            emailConfirmationExpires: Date.now() + 15 * 60 * 1000
        })

        const result = await newUser.save();
        if (!result) {
            return res.status(400).send({ message: "No se pudo crear el usuario", result: false })
        }

        const sendUser = {
            id: result._id,
            email: result.email,
            name: result.name,
            phone: result.phone,
            emergency_phone: result.emergency_phone,
            address: result.address,
            status: result.status,
            age: result.age,
            condition: result.condition
        }

        await transporter.sendMail({
            from: `"Grupo 4 Vanguardia" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Confirma tu correo electrónico",
            html: `
                    <h2>Bienvenido a Falta el nombre aqui</h2>

                    <p>
                        Tu cuenta ha sido creada correctamente.
                    </p>

                    <h1>
                        ${confirmationToken}
                    </h1>

                    <p>
                        Este es tu token para confirmar tu correo electrónico.
                    </p>

                    <p>
                        Este token expirará en 15 minutos.
                    </p>
                `
        });

        res.status(201).send({ message: "Usuario creado correctamente, esperando confirmacion de email", user: sendUser });
    } catch (error) {
        console.error("ERROR CREATING USER:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const validateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: "Faltan campos obligatorios", result: false })
        }

        const findUser = await User.findOne({ email })

        // Misma respuesta para "no existe", "inactivo" y "contraseña incorrecta"
        // para evitar la enumeración de cuentas por el código de estado.
        if (!findUser || findUser.status === false || !findUser.emailConfirmation) {
            return res.status(401).send({ message: "Correo o contraseña incorrectos", result: false })
        }

        const result = await bycrypt.compare(password, findUser.password)
        if (!result) {
            return res.status(401).send({ message: "Correo o contraseña incorrectos", result: false })
        }

        const token = signToken({ sub: findUser._id.toString(), email: findUser.email, role: findUser.role })
        res.status(200).send({ message: "Usuario validado correctamente", email: findUser.email, role: findUser.role, token, result: true });
    } catch (error) {
        console.error("ERROR VALIDATING USER:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ message: "El ID del usuario es requerido", result: false })
        }

        // Un usuario solo puede editar su propio perfil.
        if (id !== req.user.id) {
            return res.status(403).send({ message: "No tienes permiso para modificar este usuario", result: false })
        }

        const { name, phone, emergency_phone, address, status, age, condition } = req.body;
        const fields = { name, phone, emergency_phone, address, status, age, condition };
        const update = Object.fromEntries(
            Object.entries(fields).filter(([, value]) => value !== undefined)
        );

        if (Object.keys(update).length === 0) {
            return res.status(400).send({ message: "No hay campos para actualizar", result: false })
        }

        const updatedUser = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
        if (!updatedUser) {
            return res.status(404).send({ message: "Usuario no encontrado", result: false })
        }

        res.status(200).send({ message: "Usuario actualizado correctamente", user: updatedUser });
    } catch (error) {
        console.error("ERROR UPDATING USER:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const getUsers = async (req, res) => {
    try {
        // Solo administradores (protegido por requireRole en la ruta).
        // Se restringe a campos no sensibles: el admin gestiona usuarios
        // y roles, pero no debe ver los datos de salud de los clientes.
        const users = await User.find().select(ADMIN_SELECTION).sort({ createdAt: -1 })
        if (users.length === 0) {
            return res.status(404).send({ message: "No se encontraron usuarios", result: false })
        }
        return res.status(200).send({ users })
    } catch (error) {
        console.error("ERROR FETCHING USERS:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -emailConfirmationToken -emailConfirmationExpires')
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado", result: false })
        }
        return res.status(200).send({ user })
    } catch (error) {
        console.error("ERROR FETCHING PROFILE:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).send({ message: "El token de verificación es requerido", result: false })
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const findUser = await User.findOne({
            emailConfirmationToken: hashedToken,
            emailConfirmationExpires: { $gt: Date.now() }
        })
        if (!findUser) {
            return res.status(404).send({ message: "La verificacion a fallado", result: false })
        }

        await User.findByIdAndUpdate(findUser._id, {
            emailConfirmation: true,
            emailConfirmationToken: null,
            emailConfirmationExpires: null
        })

        return res.status(200).send({ message: "Email validado con exito", result: true })
    } catch (error) {
        console.error("ERROR CONFIRMIR USER'S EMAIL:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

/**
 * ─── ADMINISTRACIÓN DE USUARIOS ────────────────────────────────────────
 * Los administradores gestionan únicamente usuarios y sus roles.
 * NO tienen acceso a datos de salud (reportes/diagnósticos).
 * Los métodos excluyen explícitamente campos sensibles de los clientes y
 * solo exponen lo necesario para la gestión (email, nombre, rol, estado).
 */

const ADMIN_SELECTION = '-password -emailConfirmationToken -emailConfirmationExpires'

const adminListUsers = async (req, res) => {
    try {
        const users = await User.find().select(ADMIN_SELECTION).sort({ createdAt: -1 })
        return res.status(200).send({ users })
    } catch (error) {
        console.error("ERROR FETCHING USERS (ADMIN):", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const adminGetUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).send({ message: "El ID del usuario es requerido", result: false })
        }
        const user = await User.findById(id).select(ADMIN_SELECTION)
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado", result: false })
        }
        return res.status(200).send({ user })
    } catch (error) {
        console.error("ERROR FETCHING USER (ADMIN):", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const adminUpdateRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        if (!id) {
            return res.status(400).send({ message: "El ID del usuario es requerido", result: false })
        }
        if (!role || !['Admin', 'Client'].includes(role)) {
            return res.status(400).send({ message: "Rol inválido. Debe ser 'Admin' o 'Client'", result: false })
        }

        // Un administrador no puede quitar su propio rol para evitar
        // dejar el sistema sin administradores.
        if (id === req.user.id && role !== 'Admin') {
            return res.status(403).send({
                message: "No puedes quitar tu propio rol de administrador",
                result: false
            })
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select(ADMIN_SELECTION)

        if (!updated) {
            return res.status(404).send({ message: "Usuario no encontrado", result: false })
        }

        return res.status(200).send({
            message: "Rol actualizado correctamente",
            user: updated
        })
    } catch (error) {
        console.error("ERROR UPDATING ROLE (ADMIN):", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const adminUpdateStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        if (!id) {
            return res.status(400).send({ message: "El ID del usuario es requerido", result: false })
        }
        if (typeof status !== 'boolean') {
            return res.status(400).send({ message: "El estado debe ser verdadero o falso", result: false })
        }

        // Un administrador no puede desactivarse a sí mismo para evitar
        // quedarse sin acceso.
        if (id === req.user.id && status === false) {
            return res.status(403).send({
                message: "No puedes desactivar tu propia cuenta",
                result: false
            })
        }

        const updated = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).select(ADMIN_SELECTION)

        if (!updated) {
            return res.status(404).send({ message: "Usuario no encontrado", result: false })
        }

        return res.status(200).send({
            message: "Estado actualizado correctamente",
            user: updated
        })
    } catch (error) {
        console.error("ERROR UPDATING STATUS (ADMIN):", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const adminDeleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).send({ message: "El ID del usuario es requerido", result: false })
        }
        if (id === req.user.id) {
            return res.status(403).send({
                message: "No puedes eliminar tu propia cuenta",
                result: false
            })
        }

        const deleted = await User.findByIdAndDelete(id)
        if (!deleted) {
            return res.status(404).send({ message: "Usuario no encontrado", result: false })
        }

        return res.status(200).send({
            message: "Usuario eliminado correctamente",
            result: true
        })
    } catch (error) {
        console.error("ERROR DELETING USER (ADMIN):", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

export default { createUser, validateUser, editUser, getUsers, getMe, confirmEmail, adminListUsers, adminGetUser, adminUpdateRole, adminUpdateStatus, adminDeleteUser };