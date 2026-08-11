import User from "../models/users.js"

const create = async(req, res) => {
    try{
        const { email, password, name, phone, emergency_phone, address } =  req.body;
        if(!email || !password || !name || !phone || !emergency_phone || !address ){
            return res.status(400).send("Bad request, some fields are empty")
        }

        const newUser = new User({
            email, 
            password, 
            name, 
            phone, 
            emergency_phone, 
            address
        })

        const findEmail = await User.find({ email })
        if(findEmail){
            return res.status(409).send("Resource already exists, email already in use")
        }

        const result = await newUser.save();
        if(!result){
            return res.status(400).send("User creation failed")
        }

        const sendUser = {
            email: result.email, 
            name: result.name,
            phone: result.phone,
            emergency_phone: result.emergency_phone,
            address: result.address,
        }
        res.status(201).send({message: "User created succesfully", user: sendUser});
    }catch(error){
        console.error("ERROR CREATING USER:", error);

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

const validateUser = async(req, res) => {
    try{
        const { email, password } =  req.body;
        if(!email || !password ){
            return res.status(400).send({message: "Bad request, some fields are empty", result: false})
        }

        const findUser = await User.find({ email, password })
        if(!findUser){
            return res.status(204).send({ message: "User not found", result: false})
        }

        res.status(200).send({message: "User found succesfully", email: email, result: true});
    }catch(error){
        return res.status(500).send({message: "Internal server error", result: false})
    }
}

export default { create, validateUser };