import User from "../models/users.js"
import bycrypt from 'bcryptjs'
import { signToken } from "../middlewares/auth.middleware.js"

const createUser = async(req, res) => {
    try{
        const { email, password, name, phone, emergency_phone, address, age, condition } =  req.body;
        if(!email || !password || !name || !phone || !emergency_phone || !address || !age || !condition ){
            return res.status(400).send("Bad request, some fields are empty")
        }

        const findEmail = await User.findOne({ email })
        if(findEmail){
            return res.status(409).send("Resource already exists, email already in use")
        }

        const hash_password = await bycrypt.hash(password, 10)
        const newUser = new User({
            email, 
            password: hash_password, 
            name, 
            phone, 
            emergency_phone, 
            address,
            age,
            condition
        })

        const result = await newUser.save();
        if(!result){
            return res.status(400).send("User creation failed")
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
        res.status(201).send({message: "User created succesfully", user: sendUser});
    }catch(error){
        console.error("ERROR CREATING USER:", error);
        return res.status(500).send("Internal server error")
    }
}

const validateUser = async(req, res) => {
    try{
        const { email, password } =  req.body;
        if(!email || !password ){
            return res.status(400).send({message: "Bad request, some fields are empty", result: false})
        }

        const findUser = await User.findOne({ email })
        if(!findUser){
            return res.status(404).send({ message: "User not found", result: false})
        }

        if(findUser.status === false){
            return res.status(403).send({ message: "User is inactive", result: false})
        }

        const result = await bycrypt.compare(password, findUser.password)
        if(!result){
            return res.status(404).send({ message: "Incorrect password", result: false})
        }

        const token = signToken({ sub: findUser._id.toString(), email: findUser.email })
        res.status(200).send({message: "User found succesfully", email: findUser.email, token, result: true});
    }catch(error){
        console.error("ERROR VALIDATING USER:", error);
        return res.status(500).send({message: "Internal server error", result: false})
    }
}

const editUser = async(req, res) => {
    try{
        const { id } =  req.params;
        if(!id ){
            return res.status(400).send("User ID is required")
        }

        const { name, phone, emergency_phone, address, status, age, condition } =  req.body;
        const fields = { name, phone, emergency_phone, address, status, age, condition };
        const update = Object.fromEntries(
            Object.entries(fields).filter(([, value]) => value !== undefined)
        );

        if(Object.keys(update).length === 0){
            return res.status(400).send("Bad request, no fields to update")
        }

        const updatedUser = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
        if(!updatedUser){
            return res.status(404).send("User not found")
        }

        res.status(200).send({message: "User updated succesfully", user: updatedUser});
    }catch(error){
        console.error("ERROR UPDATING USER:", error);
        return res.status(500).send("Internal server error")
    }
}

const getUsers = async(req, res) => {
    try{
        const users = await User.find().select('-password')
        if(users.length === 0){
            return res.status(404).send("Users not found")
        }
        return res.status(200).send({users})
    }catch(error){
        console.error("ERROR FETCHING USERS:", error);
        return res.status(500).send("Internal server error")
    }
}

export default { createUser, validateUser, editUser, getUsers };