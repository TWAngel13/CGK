const express = require("express");
const app = express();
const port = 3000;

const firebase = require("./firebase/firebase");

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const objectsRoute = require("./routes/objects");
const imagesRoute = require("./routes/images")
const newsRoute = require("./routes/news");
firebase.init();
app.use(express.json());
app.use("/api/auth/",authRoute)
app.use("/api/users/",usersRoute)
app.use("/api/objects/",objectsRoute)
app.use("/api/images/",imagesRoute)
app.use("/api/news/",newsRoute)
// Error handling
app.get('/api/*', function(req, res){
    res.status(404).send({error:"Url Not Found"});
});
app.use(express.static(__dirname + "./../public"));
app.use("*", express.static(__dirname + "./../public/404.html"));

app.listen(port,() => {console.log(`Listening on port:${process.env.PORT}`)});
