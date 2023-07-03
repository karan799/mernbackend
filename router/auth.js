const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const authenticate =require("../middleware/authenticate")
const User=require("../models/schema");
const cookieParser = require("cookie-parser");

const router=express.Router();
router.use(cookieParser());

router.get("/",(req,res)=>{
    res.send("hello");
})

// router.use(function(req, res) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173/Register"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   
//   });
router.post("/api/Registerr", async (req, res) => {
      const { name, email, phone, work, password, cpassword} =req.body;

      if (!name || !email || !phone || !work || !password || !password) {
        return res.status(422).json({ error: "Plz filled the field properly" });
       }

      try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
              return res.status (422).json({ error: "Email already Exist" });
        } else if (password !=cpassword) {
              return res.status (422).json({ error: "password are not matching" });
        } else {
 
              const user = new User({ name, email, phone, work, password, cpassword });
         
        await user.save();
        res.status (201).json({ message: "user registered successfuly" });
        }
    }catch (err) {
        console.log(err);
     }
    });
    


router.post("/api/login", async (req, res) => {
    try{let token;
        const{email,password}=req.body;

        if(!email||!password)
        {
            res.status(400).json({message:"plese fill all data"})
        }

       
        const userLogin = await User.findOne({ email: email });
        // console.log(userLogin);
        if(userLogin)
        { const isMatch = await bcrypt.compare(password, userLogin.password);
         
             token =await userLogin.generateAuthToken();
             console.log(token);
             res.cookie(" jwtoken", token, {
                expires: new Date(Date.now() +25892000000),
                httpOnly:true
            });

             if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials" });
            } else {
                  res.json({ message: `user Signin Successfully${token}` });
            }
            
        }
        

       

    }catch(err){
        console.log(err)

    }
});

router.get("/api/about",authenticate, async (req, res) => {
    console.log('hello im about');
    res.send(req.rootUser);
    
})
router.get("/api/logout",authenticate, async (req, res) => {
    console.log('hello im logout');
    res.clearCookie('jwtoken',{path:'/'})
    res.status(200).send('user logout');
    
})


router.post("/api/contact",authenticate, async (req, res) => {
    
    console.log("addmessage");

    try {
        const { name, email, message} =req.body;
    if ( !email ) {
        return res.status(422).json({ error: "Plz filled the field properly e" });
       }
    if (!name  ) {
      return res.status(422).json({ error: "Plz filled the field properly n" });
     }
     if ( !email ) {
        return res.status(422).json({ error: "Plz filled the field properly e" });
       }
       if ( !message ) {
        return res.status(422).json({ error: "Plz filled the field properly m" });
       }

      const userExist = await User.findOne({ _id:req.userId });
      console.log("userExist");

      if (userExist) {
        const userMessage=await userExist.addMessage(name,email,message);
        console.log(userMessage);

        await userExist.save();
        res.status(201).json({message:"contact saved"})
          

      }
  }catch (err) {
      console.log(err);
   }
  });
  

module.exports=router;