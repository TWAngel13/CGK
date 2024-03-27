const express = require("express");
const router = express.Router();
const dbApi = require("../db/db")
const {isInteger} = require("../sanityCheck");
module.exports = router;
////
const objectsReview = {
    entertainments:1,
    park:2,
    restaurant:3,
}

http://localhost:3000/users/<ID>/reviews/<NAME>   optional --> ?start=0&max=10000

router.get("/id/:id/reviews/restaurants",async function(req,res){
    const userID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getReview(userID,startPos,maxSize,objectsReview.restaurant,res)
    
});
router.get("/id/:id/reviews/entertainments",async function(req,res){
    const userID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getReview(userID,startPos,maxSize,objectsReview.entertainments,res)
    
});
router.get("/id/:id/reviews/parks",async function(req,res){
    const userID = req.params.id
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    await getReview(userID,startPos,maxSize,objectsReview.park,res)
});
router.get("/list",async function(req,res){
    const startPos = req.query.start?req.query.start:0
    const maxSize = req.query.max<100?req.query.max:100
    
});
async function getReview(_userID,_startPos,_maxSize,typePlace,res){
    const userID = Number(_userID)
    const startPos = Number(_startPos?_startPos:0)
    const maxSize = Number(_maxSize<100?_maxSize:100)
    if(!isInteger(userID) || !isInteger(startPos) || !isInteger(maxSize)){
        res.status(405).send({error:"Something is wrong"})
        return
    }
    if(!await dbApi.userExists(userID)){
        res.status(404).send({error:"User doesn't exists"})
        return;
    }
    switch(typePlace){
        case objectsReview.entertainments:
            dbApi.getEntertainmentReviews(userID,startPos,maxSize).then((result)=>{
                res.status(200).send({reviews:result})
            })
            break
        case objectsReview.park:
            dbApi.getParkReviews(userID,startPos,maxSize).then((result)=>{
                res.status(200).send({reviews:result})
            })
            break
        case objectsReview.restaurant:
            dbApi.getRestaurantsReviews(userID,startPos,maxSize).then((result)=>{
                res.status(200).send({reviews:result})
            })
            break
    }
    return
}