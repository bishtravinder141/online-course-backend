const jwt = require("jsonwebtoken");
const User= require("../models/userModel");

const isAuthenticated=async (req,res,next)=>{
    const {token}=req.cookies;

    if(!token){
        res.status(401).json({
            success:false,
            message:"Not Authenticated"
        })
    }

    const decode=jwt.verify(token,"thisisiklhskhfd");
    req.user=await User.findById(decode._id);
    next()


}

const authorizeAdmin=(req,res,next)=>{
    if(req.user.role!=="admin"){
        res.status(403).json({
            success:false,
            message: `${req.user.role} is not allowed to access this resources`
        })
    }
    next()

}

module.exports={isAuthenticated,authorizeAdmin}