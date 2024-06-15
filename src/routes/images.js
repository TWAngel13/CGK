const express = require("express");
const router = express.Router();
const {isInteger, isString, isArrayOfStrings} = require("../sanityCheck");
const Object = require('../db/object');
const { InvalidParameters, NotExists } = require("../constaints/errorCodes");
const FireBase = require("../firebase/firebase");
module.exports = router;
////
const places = {
    entertainments:1,
    park:2,
    restaurant:3,
}
router.get("/id/:id/",async function(req,res){
    const id = req.params.id
    const result = await getImage(id);
    switch(result){
        case -1:
            res.status(InvalidParameters.statusCode).send({error:InvalidParameters.error});
            break;
        case -2:
            res.status(NotExists.statusCode).send({error:NotExists.error});
            break;
        default:
            const url = FireBase.getImageUrl(result);
            res.status(200).send({url:url});
    }
});


async function getImage(_id,){
    const id = Number(_id)
    if(!isInteger(id)){
        return InvalidParameters.code
    }
    if(!await Object.imageExists(id)){
        return NotExists.code
    }
    return await Object.getImage(id)
}