const express = require("express");
const router = express.Router();
const User = require("../db/user")
const {isInteger, isString, isArrayOfStrings} = require("../sanityCheck");
const { InvalidParameters, AlreadyExists, NotExists } = require("../constaints/errorCodes");
const Object = require("../db/object");
module.exports = router;
//http://localhost:3000/signup

router.post("/signup",async function(req,res){
    const userName = String(req.body.userName)
    const userMail = String(req.body.userMail)
    const userPassword = String(req.body.userPassword)
    if(!req.body.userName && !req.body.userMail && !req.body.userPassword){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.statusCode})
        return;
    }
    if( !isString(userName) || !isString(userMail)  || !isString(userPassword)){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.statusCode})
        return;
    }
    const result = await User.createUser(userName,userMail,userPassword).then((result)=>{
        if(result == AlreadyExists.code){
            res.status(AlreadyExists.statusCode).send({"error":AlreadyExists.error})
        }
        else{
            res.status(200).send(result);
        }
    });
});
router.post("/signin",async function(req,res){
    const userMail = String(req.body.userMail)
    const userPassword = String(req.body.userPassword)
    if(!req.body.userMail && !req.body.userPassword){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.statusCode})
        return;
    }
    if(!isString(userMail) || !isString(userPassword)){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.statusCode})
        return;
    }
    const token = await User.loginUser(userMail,userPassword);
    if(token == NotExists.code){
        res.status(NotExists.statusCode).send({error:NotExists.statusCode})
    }
    res.status(200).send(token)
});
router.post("/logout",async function(req,res){
    const userToken = String(req.body.token);
    if(!req.body.token){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error})
    }
    await User.logout(userToken);
    res.send(200).send("ok");
});
router.post("/createReview",async function(req,res){
   const userToken = String(req.body.token)
   const userRating = Number(req.body.rating)
   const objectID = Number(req.body.objectID);
   const reviewText = req.body.text?String(req.body.text):null
   const images = req.body.images?parseJSON(req.body.image):null
   if(!req.body.token || !req.body.objectID || !req.body.rating){
    res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error})
   }
   const userID = await User.validateToken(userToken)
   if(!isInteger(objectID) || !await Object.exists(objectID) || !userID){
    res.status(NotExists.statusCode).send({error:NotExists.error})
   }
   const reviewID = await User.createReview(userID,userRating,objectID,reviewText)
   if(images){
        images.forEach(async element => {
            if(isString(element)){
                await User.addImage(objectID,reviewID,element)
            }
        });
   }
   res.status(200).send("ok")
});
router.post("/addFavourites",async function(req,res){
    const userToken = String(req.body.token)
    const objectID = Number(req.body.objectID);
    if(!req.body.token || !req.body.objectID ){
     res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error})
    }
    const userID = await User.validateToken(userToken)
    if(!isInteger(objectID) || !await Object.exists(objectID) || !userID){
     res.status(NotExists.statusCode).send({error:NotExists.error})
    }
    await User.addFavourites(userID,objectID)
    res.status(200).send("ok")
 });
 router.post("/removeFavourites",async function(req,res){
    const userToken = String(req.body.token)
    const objectID = Number(req.body.objectID);
    if(!req.body.token || !req.body.objectID ){
     res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error})
    }
    const userID = await User.validateToken(userToken)
    if(!isInteger(objectID) || !await Object.exists(objectID) || !userID){
     res.status(NotExists.statusCode).send({error:NotExists.error})
    }
    await User.removeFavourites(userID,objectID)
    res.status(200).send("ok")
 });
router.post("/uploadImageToReview",async function(req,res){
    const image = String(req.body.image)
    const objectID = Number(req.body.objectID);
    const reviewID = Number(req.body.reviewID);
    const token = String(req.body.token)
    if(!req.body.image || !req.body.objectID || !req.body.reviewID || !req.body.token){
     res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error})
    }
    if(!isString(image) || !isString(objectID) || !isInteger(reviewID) || !isString(token)){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error})
    }
    const userID = await User.validateToken(token)
    if(!await Object.exists(objectID) || !userID){
     res.status(NotExists.statusCode).send({error:NotExists.error})
    }
    
    res.status(200).send("ok")
 });
 function parseJSON(stream){
    try{
        return JSON.parse(stream)
    } catch(e){
        return undefined
    }
}