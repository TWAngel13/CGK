const express = require("express");
const router = express.Router();
module.exports = router;
//http://localhost:3000/A1?value=1
router.get("/A1",function(req,res){
    const value = req.query.value
    res.send(value);
});