const express = require("express");
const router = express.Router();
const Restaurant = require("../db/restaurant")
const Entertainment = require("../db/entertainment")
const Park = require("../db/park")
const {isInteger, isString, isArrayOfStrings} = require("../sanityCheck");
module.exports = router;
////
const places = {
    entertainments:1,
    park:2,
    restaurant:3,
}
router.get("/reviews/restaurant/:id/",async function(req,res){
    const id = req.params.id
    await getImageReview(id,places.restaurant,res)
});
router.get("/reviews/park/:id/",async function(req,res){
    const id = req.params.id
    await getImageReview(id,places.park,res)
});
router.get("/reviews/entertainment/:id/",async function(req,res){
    const id = req.params.id
    await getImageReview(id,places.entertainments,res)
});
router.get("/places/restaurant/:id/",async function(req,res){
    const id = req.params.id
    await getImagePlace(id,places.restaurant,res)
});
router.get("/places/park/:id/",async function(req,res){
    const id = req.params.id
    await getImagePlace(id,places.park,res)
});
router.get("/places/entertainment/:id/",async function(req,res){
    const id = req.params.id
    await getImagePlace(id,places.entertainments,res)
});

async function getImageReview(_id,typePlace,res){
    const id = Number(_id)
    if(!isInteger(id)){
        res.status(405).send({error:"Something is wrong"})
        return
    }
    switch(typePlace){
        case places.entertainments:
            res.status(200).setHeader('content-type', 'image/png').send(
                await Entertainment.getImageFromReview(id)
            )
            return
        case places.park:
            res.status(200).setHeader('content-type', 'image/png').send(
                await Park.getImageFromReview(id)
            )
            return
        case places.restaurant:
            res.status(200).setHeader('content-type', 'image/png').send(
                await Restaurant.getImageFromReview(id)
            )
            return
    }
}
async function getImagePlace(_id,typePlace,res){
    const id = Number(_id)
    if(!isInteger(id)){
        res.status(405).send({error:"Something is wrong"})
        return
    }
    switch(typePlace){
        case places.entertainments:
            res.status(200).setHeader('content-type', 'image/png').send(
                await Entertainment.getImage(id)
            )
            return
        case places.park:
            res.status(200).setHeader('content-type', 'image/png').send(
                await Park.getImage(id)
            )
            return
        case places.restaurant:
            res.status(200).setHeader('content-type', 'image/png').send(
                await Restaurant.getImage(id)
            )
            return
    }
}