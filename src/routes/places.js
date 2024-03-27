const express = require("express");
const router = express.Router();
const dbApi = require("../db/db")
const {isInteger, isString} = require("../sanityCheck");
module.exports = router;
////
//http://localhost:3000/api/objects/restaurant/id/2
const places = {
    entertainments:1,
    park:2,
    restaurant:3,
}
router.get("/park/id/:id/",async function(req,res){
    const objectID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getPlace(res,objectID,startPos,maxSize,places.park)
    
});
router.get("/restaurant/id/:id/",async function(req,res){
    const objectID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getPlace(res,objectID,startPos,maxSize,places.restaurant)
});
router.get("/entertainment/id/:id/",async function(req,res){
    const objectID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getPlace(res,objectID,startPos,maxSize,places.entertainments)
});
router.get("/park/tags",async function(req,res){
    res.status(200).send(await getAllTags(places.park))
});
router.get("/restaurant/tags",async function(req,res){
    res.status(200).send(await getAllTags(places.restaurant))
});
router.get("/entertainment/tags",async function(req,res){
    res.status(200).send(await getAllTags(placeExists.entertainments))
});
router.get("/restaurant/list",async function(req,res){
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const search = req.query.search?req.query.search:""
    await getListOfPlaces(res,places.restaurant,startPos,maxSize,undefined,search)
});
router.get("/entertainment/list",async function(req,res){
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const search = req.query.search?req.query.search:""
    await getListOfPlaces(res,places.entertainments,startPos,maxSize,undefined,search)
});
router.get("/park/list",async function(req,res){
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    const search = req.query.search?req.query.search:""
    await getListOfPlaces(res,places.park,startPos,maxSize,undefined,search)
});
async function getListOfPlaces(res,typePlace,_startPos,_maxPos,sort,_search){
    const startPos = Number(_startPos)
    const maxPos = Number(_maxPos)
    const search = String(_search)
    if (!isInteger(startPos) || !isInteger(maxPos) || !isString(search)){
        res.status(405).send({error:"Something is wrong"})
        return
    }
    switch(typePlace){
        case places.entertainments:
            res.status(200).send(await dbApi.getAllEntertainments(startPos,maxPos,sort,search))
            return
        case places.park:
            res.status(200).send(await dbApi.getAllParks(startPos,maxPos,sort,search))
            return
        case places.restaurant:
            res.status(200).send(await dbApi.getAllRestaurants(startPos,maxPos,sort,search))
            return
    }
}
async function getPlace(res,_objectID,_startPos,_maxPos,typePlace){
    const objectID = Number(_objectID)
    const startPos = Number(_startPos)
    const maxPos = Number(_maxPos)
    if(!isInteger(objectID) || !isInteger(startPos) || !isInteger(maxPos)){
        res.status(405).send({error:"Something is wrong"})
        return
    }
    if(!await placeExists(objectID,typePlace)){
        res.status(404).send({error:"Object doesn't exists"})
        return
    }
    const info = await getInfo(objectID,typePlace)
    const reviews = await getReview(objectID,startPos,maxPos,typePlace)
    const message = {
        info:info,
        reviews:reviews,
    }
    res.status(200).send(message)
    
}
async function getReview(objectID,startPos,maxSize,typePlace){
    switch(typePlace){
        case places.entertainments:
            return await dbApi.getReviewsForEntertainment(objectID,startPos,maxSize)
            break
        case places.park:
            return await dbApi.getReviewsForPark(objectID,startPos,maxSize)
            break
        case places.restaurant:
            return await dbApi.getReviewsForRestaurant(objectID,startPos,maxSize)
            break
    }
    return
}
async function getInfo(objectID,typePlace){
    switch(typePlace){
        case places.entertainments:
            return (await dbApi.getInfoForEntertainment(objectID))
            break
        case places.park:
            return (await dbApi.getInfoForPark(objectID))
            break
        case places.restaurant:
            return await dbApi.getInfoFoRestaurant(objectID)
            break
    }
}
async function getAllTags(typePlace){
    switch(typePlace){
        case places.entertainments:
            return await dbApi.getAllTagsEntertainment()
            break
        case places.park:
            return await dbApi.getAllTagsPark()
            break
        case places.restaurant:
            return await dbApi.getAllTagsRestaurant()
            break
    }
}
async function placeExists(_objectID,typePlace){
    const objectID = Number(_objectID)
    switch(typePlace){
        case places.entertainments:
            return await dbApi.entertainmentExists(objectID)
            break
        case places.park:
            return await dbApi.parkExists(objectID)
            break
        case places.restaurant:
            return await dbApi.restaurantExists(objectID)
            break
    }
}