// подключение express
const express = require("express");
// создаем объект приложения
const app = express();
const port = 3000;

//file separation
const pagesRoute = require("./routes/pages")
// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
     
    // отправляем ответ
    response.send("<h2>Привет Express!</h2>");
});
app.use(express.json());
// File separation
app.use("/",pagesRoute)
// начинаем прослушивать подключения на 3000 порту

// определяем обработчик для маршрута "/"
app.get("/", function(req, res){
    // отправляем ответ
    res.send("<h2>Привет Express!</h2>");
});
//send value using /api?value=1
app.get("/api",function(req,res){
    const value = req.query.value
    res.send(value);
});
//send value through url
app.get("/api/:id",function(req,res){
    const value = req.params.id
    res.send(value);
});
// Error handling
app.get('*', function(req, res){
    res.status(404).send({error:"Unsupported url"});
});
// начинаем прослушивать подключения на 3000 порту
app.listen(port,() => {console.log(`Listening on port:${port}`)});
