const express=require("express");
const mongoose=require("mongoose");
const app=express();
const dotnev=require("dotenv");

dotnev.config({path:'./config.env'});
app.use(express.json());

require("./db/conn");
// const User =require('./models/schema');

const db=process.env.DB;
const port=process.env.PORT||5000;

app.use(require("./router/auth"));
 

if (process.env.NODE_ENV - "production"){
    app.use(express.static("vite-project/dist"));
}


app.listen(port,()=>{
    console.log(`connected to ${port}`);
});

