const express = require("express");
const router = express.Router();
const User = require("../db/user")
const {isInteger, isString, isArrayOfStrings} = require("../sanityCheck");
module.exports = router;
//http://localhost:3000/signup?name=122232&mail=22114@idk.ru

router.get("/signup",function(req,res){
    const userName = String(req.query.name)
    const userMail = String(req.query.mail)
    if(!isString(userMail) || !isString(userName)){
        res.status(400).send({error:"Some of parameters are missing"})
        return;
    }
    const result = User.createUser(userName,userMail).then((result)=>{
        res.status(200).send({result:result});
    });
});