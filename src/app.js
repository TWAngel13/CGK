const express = require("express");
const app = express();
const port = 3000;

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const placesRoute = require("./routes/places");
const imagesRoute = require("./routes/images")
app.use(express.json());
app.use("/api/auth/",authRoute)
app.use("/api/users/",usersRoute)
app.use("/api/objects/",placesRoute)
app.use("/api/images/",imagesRoute)
// Error handling
app.get('/api/*', function(req, res){
    res.status(404).send({error:"Url Not Found"});
});
app.use(express.static(__dirname + "./../public"));
app.use("*", express.static(__dirname + "./../public/404.html"));

app.listen(port,() => {console.log(`Listening on port:${process.env.PORT}`)});
