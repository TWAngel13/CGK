const express = require("express");
const router = express.Router();
const dbApi = require("../db/db")
const {isInteger} = require("../sanityCheck");
const { restart } = require("nodemon");
module.exports = router;
////
const places = {
    entertainments:1,
    park:2,
    restaurant:3,
}
router.get("/park/:id/",async function(req,res){
    const objectID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getPlace(res,objectID,startPos,maxSize,places.park)
    
});
router.get("/restaurant/:id/",async function(req,res){
    const objectID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getPlace(res,objectID,startPos,maxSize,places.restaurant)
});
router.get("/entertainment/:id/",async function(req,res){
    const objectID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getPlace(res,objectID,startPos,maxSize,places.entertainments)
});
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
    const tags = await getTags(objectID,typePlace)
    const message = {
        info:info,
        reviews:reviews,
        tags:tags
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
async function getTags(objectID,typePlace){
    switch(typePlace){
        case places.entertainments:
            return await dbApi.getEntertainmentTags(objectID)
            break
        case places.park:
            return await dbApi.getParkTags(objectID)
            break
        case places.restaurant:
            return await dbApi.getRestaurantTags(objectID)
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