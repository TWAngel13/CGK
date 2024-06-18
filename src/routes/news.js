const express = require("express");
const router = express.Router();
const {isInteger, isString, isArrayOfStrings} = require("../sanityCheck");
const News = require("../db/news");
const { InvalidParameters, NotExists } = require("../constaints/errorCodes");
module.exports = router;
////
const places = {
    entertainments:1,
    park:2,
    restaurant:3,
}
router.get("/id/:id/",async function(req,res){
    const newsID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const result = await getNews(newsID,startPos,maxSize)
    switch(result){
        case -1:
            res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error});
            break;
        case -2:
            res.status(NotExists.statusCode).send({error:NotExists.error});
            break;
        default:
            res.status(200).send(result);
    }
    
});
router.get("/list",async function(req,res){
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const result = await getAllNews(startPos,maxSize)
    if(result == InvalidParameters.code){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.text})
        return;
    }
    res.status(200).send(result);
});
async function getNews(_newsID,_startPos,_maxPos){
    const newsID = Number(_newsID)
    const startPos = Number(_startPos)
    const maxPos = Number(_maxPos)
    if(!isInteger(newsID) || !isInteger(startPos) || !isInteger(maxPos)){
        return InvalidParameters.code
    }
    if(!await News.exists(newsID)){
        return NotExists.code
    }
    const info = await News.getNews(_newsID);
    const message = {
        info:info,
    }
    return message;
}
async function getAllNews(_startPos,_maxPos){
    const startPos = Number(_startPos)
    const maxPos = Number(_maxPos)
    if (!isInteger(startPos) || !isInteger(maxPos)){
        return InvalidParameters.code
    }
    return await News.getAllNews(startPos,maxPos);
}