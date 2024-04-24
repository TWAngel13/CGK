const express = require("express");
const router = express.Router();
const {isInteger, isString, isArrayOfStrings} = require("../sanityCheck");
const Object = require('../db/object')
const {InvalidParameters,NotExists} = require('../constaints/errorCodes');
const { isNull } = require("tls");
const { isNumber } = require("tls");
module.exports = router;
//// 
//http://localhost:3000/api/objects/restaurant/id/2
router.get("/id/:id/",async function(req,res){
    const objectID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const result = await getObjectInfo(objectID,startPos,maxSize)
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
router.get("/tags",async function(req,res){
    res.status(200).send(await getAllTags())
});
router.get("/id/:id/attributes",async function(req,res){
    const objectID = req.params.id
    const result = await getAllObjectAttributes(objectID);
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
router.get("/tagsID/:id/",async function(req,res){
    const id = req.params.id
    const result = getAllTagsByID(id)
    if(result == InvalidParameters.code){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error})
        return;
    }
    res.status(200).send(await getAllTagsByID(id));
});
router.get("/list",async function(req,res){
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const search = req.query.search?req.query.search:""
    const tags = req.query.tags?parseJSON(req.query.tags):null
    const objectCategory = req.query.objectCategory?String(req.query.objectCategory):null
    const result = await getListOfPlaces(startPos,maxSize,undefined,search,tags,objectCategory)
    if(result == InvalidParameters.code){
        res.status(InvalidParameters.statusCode).send({error:InvalidParameters.text})
        return;
    }
    res.status(200).send(result);
});
async function getListOfPlaces(_startPos,_maxPos,sort,_search,_tags,_objectCategory){
    const startPos = Number(_startPos)
    const maxPos = Number(_maxPos)
    const search = String(_search)
    const tags = _tags
    const objectCategory = _objectCategory
    if (!isInteger(startPos) || !isInteger(maxPos) || !isString(search) || (!isArrayOfStrings(tags) && tags !== null || tags===undefined)){
        return InvalidParameters.code
    }
    return await Object.getAllObjects(startPos,maxPos,sort,search,tags,objectCategory);
}
async function getObjectInfo(_objectID,_startPos,_maxPos){
    const objectID = Number(_objectID)
    const startPos = Number(_startPos)
    const maxPos = Number(_maxPos)
    if(!isInteger(objectID) || !isInteger(startPos) || !isInteger(maxPos)){
        return InvalidParameters.code
    }
    if(!await Object.exists(objectID)){
        return NotExists.code
    }
    const info = await Object.getInfo(objectID)
    const reviews = await Object.getAllReviews(objectID,startPos,maxPos)
    const message = {
        info:info,
        reviews:reviews,
    }
    return message;
}
async function getAllTags(){
    return await(Object.getAllTags())
}
async function getAllTagsByID(_id){
    const id = Number(_id)
    if(!isInteger(id)){
        return InvalidParameters.code
    }
    return await Object.getAllTagsByType(id);
}
async function getAllObjectAttributes(_id){
    const id = Number(_id)
    if(!isInteger(id)){
        return InvalidParameters.code
    }
    return await Object.getObjectAttributes(id);
}
function parseJSON(stream){
    try{
        return JSON.parse(stream)
    } catch(e){
        return undefined
    }
}