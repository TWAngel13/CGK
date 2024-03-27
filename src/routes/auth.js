const express = require("express");
const router = express.Router();
const dbApi = require("../db/db")
module.exports = router;
//http://localhost:3000/signup?name=122232&mail=22114@idk.ru

router.get("/signup",function(req,res){
    const userName = req.query.name.toString()
    const userMail = req.query.mail.toString()
    if(!userMail || !userName){
        res.status(400).send({error:"Some of parameters are missing"})
    }
    const result = dbApi.addUser(userName,userMail).then((result)=>{
        res.status(200).send({result:result});
    });
});