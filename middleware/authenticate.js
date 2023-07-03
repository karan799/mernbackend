const cookieParser = require("cookie-parser");
const User=require("../models/schema");
const jwt=require('jsonwebtoken');
const router = require("../router/auth");

const authenticate =async (req,res,next)=>{
try{

    const token=req.cookies.jwtoken;
 


    const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
    

    const rootUser= await User.findOne({_id:verifyToken.id,"tokens.token":token});
   

    
    if(!rootUser)
    throw new Error("tokenn not found");

    req.token=token;
    req.rootUser=rootUser;
    req.userId=rootUser._id;

    next();
}
catch(err){
    res.status(401).send("aunauthorized tokenns");
    
}
}

module.exports=authenticate;