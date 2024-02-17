const express = require("express");
const app = express();
const users = require("./routes/user.js")
const posts = require("./routes/post.js")
const cookieParser = require("cookie-parser");
app.use(cookieParser("sercretcode"));


app.get("/getsingnedcookie",(req,res)=>{
   res.cookie("made-in","india",{signed: true});
   res.send("singned cookie send")
});

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
});


app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.cookie("made in india","namaste india ");
    res.cookie("name","praveen")
 res.send("send you some cookies")
});

app.get("/greet",(req,res)=>{
let {name = "anonymus"} = req.cookies;
res.send(`hii, ${name}`)
});

app.use("/users",users);
app.use("/posts",posts);

app.get("/",(req,res)=>{
    res.send("hii, i am root")
});


app.listen(3000,()=>{
    console.log("server is  listenting to 3000")
});

