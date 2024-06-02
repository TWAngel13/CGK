const express = require("express");
const router = express.Router();
const User = require("../db/user")
const {isInteger, isString} = require("../sanityCheck");
const { InvalidParameters, NotExists, AccessDenied } = require("../constaints/errorCodes");
module.exports = router;
////
http://localhost:3000/users/<ID>/reviews/<NAME>   optional --> ?start=0&max=10000


router.post("/id/:id/",async function(req,res){
    const userID = req.params.id
    const token = req.body.token
    const result = await getUserInfo(userID,token)
    switch(result){
        case -1:
            res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error});
            break;
        case -2:
            res.status(NotExists.statusCode).send({error:NotExists.error});
            break;
        default:
            res.status(200).send(result)
    }
});
router.get("/id/:id/reviews/",async function(req,res){
    const userID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const result = await getReviews(userID,startPos,maxSize)
    switch(result){
        case -1:
            res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error});
            break;
        case -2:
            res.status(NotExists.statusCode).send({error:NotExists.error});
            break;
        default:
            res.status(200).send(result)
    }
});
router.post("/id/:id/favourites/",async function(req,res){
    const token = req.body.token
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const result = await getFavourites(token,startPos,maxSize)
    switch(result){
        case -1:
            res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error});
            break;
        case -2:
            res.status(NotExists.statusCode).send({error:NotExists.error});
            break;
        default:
            res.status(200).send(result)
    }
});
router.get("/list",async function(req,res){
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const result = await getAllUsers(startPos,maxSize)
    if(result == InvalidParameters.code){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error})
        return
    }
    res.status(200).send(result);
});
async function getUserInfo(id,token){
    const userID = token?await User.validateToken(String(token)):Number(id)
    const logined = token?true:false
    if(!userID || !isInteger(userID)){
        return InvalidParameters.code
    }
    if(logined){
        return await User.getUserInfoAuth(userID);
    }
    else{
        return await User.getUserInfoMinimal(userID);
    }
}
async function getAllUsers(_startPos,_maxSize){
    const startPos = Number(_startPos?_startPos:0)
    const maxSize = Number(_maxSize<100?_maxSize:100)
    if(!isInteger(startPos) || !isInteger(maxSize)){
        return InvalidParameters.code
    }
    return await User.getAllUsers(startPos,maxSize)
}   
async function getReviews(_userID,_startPos,_maxSize){
    const userID = Number(_userID)
    const startPos = Number(_startPos?_startPos:0)
    const maxSize = Number(_maxSize<100?_maxSize:100)
    if(!isInteger(userID) || !isInteger(startPos) || !isInteger(maxSize)){
        return InvalidParameters.code
    }
    if(!await User.exists(userID)){
        return NotExists.code;
    }
    return await User.getUserReviews(userID,startPos,maxSize);
}
async function getFavourites(_token,_startPos,_maxSize){
    const token = _token;
    const startPos = Number(_startPos?_startPos:0)
    const maxSize = Number(_maxSize<100?_maxSize:100)
    if(!isString(token) || !isInteger(startPos) || !isInteger(maxSize)){
        return InvalidParameters.code
    }
    const userID = await User.validateToken(token)
    if(!userID){
        return NotExists.code;
    }
    return await User.getUserFavourites(userID,startPos,maxSize);
}