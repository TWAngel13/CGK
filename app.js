// подключение express
const express = require("express");
// создаем объект приложения
const app = express();

app.use(express.static(__dirname + "/public"));
 
app.use("*", express.static("./public/404.html"));

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);
