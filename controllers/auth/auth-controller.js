const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { json } = require("express");

// register
const registerUser = async(req, res)=>{
    const { username, email, password} = req.body;
    try{
        const checkUser = await User.findOne({email});
        if(checkUser) return res.json({success: false, message: 'User Already Exist with the same email please try again!'})
        
            const  hashPassword = await bycrypt.hash(password, 12);
        const newUser = new User({
            username: username, 
            email: email,
            password: hashPassword 
        })
        await newUser.save();
        res.status(200).json({
            success: true,
            message:'Register sucessfull'
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message:"some error occured"
        })
    }
}

//login
const loginUser = async(req, res)=>{
    const { email, password} = req.body;
    try{
        const checkUser = await User.findOne({email});
        if(!checkUser) return res.json({success: false, message: 'incorrect username and password'})
        
        const checkPasswordMatch = await bycrypt.compare(password, checkUser.password);
        if(!checkPasswordMatch) return res.json({success: false, message: "incorrect username and password"});

        const token = jwt.sign({
            id:checkUser._id, role:checkUser.role, email:checkUser.email, username: checkUser.username
        }, 'CLIENT_SECRET_KEY',{expiresIn:'60m'})
        res.cookie('token', token, {httpOnly: true, secure : false}).json({
            success:true,
            message: 'Logged in sucesssfully',
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                username: checkUser.username
            }
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            sucess: false,
            message:"some error occured"
        })
    }
}


//logout
const logOut = (req, res) =>{
    res.clearCookie('token').json({
        success: true,
        message:'logged out successfully'
    })
}


//auth middleware
const authMiddleware = async(req, res, next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success: false,
        message: 'Unauthorized user'
    })

    try {
        const decoded  = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next()
    } catch (e) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        })
    }
}


module.exports ={registerUser, loginUser,logOut, authMiddleware};