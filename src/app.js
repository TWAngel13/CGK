const express = require("express");
const app = express();
const port = 3000;

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const placesRoute = require("./routes/places")
app.use(express.json());
app.use("/auth/",authRoute)
app.use("/users/",usersRoute)
app.use("/objects/",placesRoute)
// Error handling
app.get('*', function(req, res){
    res.status(404).send({error:"Not Found"});
});
app.listen(port,() => {console.log(`Listening on port:${process.env.PORT}`)});
