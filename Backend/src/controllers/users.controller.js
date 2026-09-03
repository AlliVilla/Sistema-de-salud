import User from "../models/users.js"
import bycrypt from 'bcryptjs'
import crypto from "crypto"
import transporter  from "../middlewares/email.js"
import { signToken } from "../middlewares/auth.middleware.js"
import { mapMongoError } from "../utils/errors.js"

const createUser = async(req, res) => {
    try{
        const { email, password, name, phone, emergency_phone, address, age, condition } =  req.body;
        if(!email || !password || !name || !phone || !emergency_phone || !address || !age || !condition ){
            return res.status(400).send({ message: "Faltan campos obligatorios", result: false })
        }

        const findEmail = await User.findOne({ email })
        if(findEmail){
            if(findEmail.emailConfirmation){
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
                emailConfirmationExpires: Date.now()+15*60*1000
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

            return res.status(201).send({message: "Usuario creado correctamente, esperando confirmacion de email", user: sendUser});
        }

        const confirmationToken = crypto.randomBytes(32).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(confirmationToken).digest("hex")

        const hash_password = await bycrypt.hash(password, 10)
        const newUser = new User({
            email, 
            password: hash_password, 
            name, 
            phone, 
            emergency_phone, 
            address,
            age,
            condition,
            emailConfirmationToken: hashedToken,
            emailConfirmationExpires: Date.now()+15*60*1000
        })

        const result = await newUser.save();
        if(!result){
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

        res.status(201).send({message: "Usuario creado correctamente, esperando confirmacion de email", user: sendUser});
    }catch(error){
        console.error("ERROR CREATING USER:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const validateUser = async(req, res) => {
    try{
        const { email, password } =  req.body;
        if(!email || !password ){
            return res.status(400).send({ message: "Faltan campos obligatorios", result: false })
        }

        const findUser = await User.findOne({ email })

        // Misma respuesta para "no existe", "inactivo" y "contraseña incorrecta"
        // para evitar la enumeración de cuentas por el código de estado.
        if(!findUser || findUser.status === false || !findUser.emailConfirmation){
            return res.status(401).send({ message: "Correo o contraseña incorrectos", result: false })
        }

        const result = await bycrypt.compare(password, findUser.password)
        if(!result){
            return res.status(401).send({ message: "Correo o contraseña incorrectos", result: false })
        }

        const token = signToken({ sub: findUser._id.toString(), email: findUser.email })
        res.status(200).send({message: "Usuario validado correctamente", email: findUser.email, token, result: true});
    }catch(error){
        console.error("ERROR VALIDATING USER:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const editUser = async(req, res) => {
    try{
        const { id } =  req.params;
        if(!id ){
            return res.status(400).send({ message: "El ID del usuario es requerido", result: false })
        }

        // Un usuario solo puede editar su propio perfil.
        if(id !== req.user.id){
            return res.status(403).send({ message: "No tienes permiso para modificar este usuario", result: false })
        }

        const { name, phone, emergency_phone, address, status, age, condition, role } =  req.body;
        const fields = { name, phone, emergency_phone, address, status, age, condition, role };
        const update = Object.fromEntries(
            Object.entries(fields).filter(([, value]) => value !== undefined)
        );

        if(Object.keys(update).length === 0){
            return res.status(400).send({ message: "No hay campos para actualizar", result: false })
        }

        const updatedUser = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
        if(!updatedUser){
            return res.status(404).send({ message: "Usuario no encontrado", result: false })
        }

        res.status(200).send({message: "Usuario actualizado correctamente", user: updatedUser});
    }catch(error){
        console.error("ERROR UPDATING USER:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const getUsers = async(req, res) => {
    try{
        const users = await User.find().select('-password')
        if(users.length === 0){
            return res.status(404).send({ message: "No se encontraron usuarios", result: false })
        }
        return res.status(200).send({users})
    }catch(error){
        console.error("ERROR FETCHING USERS:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const getMe = async(req, res) => {
    try{
        const user = await User.findById(req.user.id)
            .select('-password -emailConfirmationToken -emailConfirmationExpires')
        if(!user){
            return res.status(404).send({ message: "Usuario no encontrado", result: false })
        }
        return res.status(200).send({user})
    }catch(error){
        console.error("ERROR FETCHING PROFILE:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

const confirmEmail = async(req, res) => {
    try{
        const { token } = req.params;
        if(!token ){
            return res.status(400).send({ message: "El token de verificación es requerido", result: false })
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
        
        const findUser = await User.findOne({ 
            emailConfirmationToken: hashedToken, 
            emailConfirmationExpires: { $gt: Date.now() }
        })
        if(!findUser){
            return res.status(404).send({ message: "La verificacion a fallado", result: false })
        }

        await User.findByIdAndUpdate(findUser._id, { 
            emailConfirmation: true, 
            emailConfirmationToken: null,
            emailConfirmationExpires: null
        })

        return res.status(200).send({ message: "Email validado con exito", result: true })
    }catch(error){
        console.error("ERROR CONFIRMIR USER'S EMAIL:", error);
        const { status, message } = mapMongoError(error);
        return res.status(status).send({ message, result: false })
    }
}

export default { createUser, validateUser, editUser, getUsers, getMe, confirmEmail };