import * as api from "./api.js"
const token = localStorage.getItem("auth_token");
const username = document.getElementById("username");
const favourites = document.getElementById("favourites");
const reviews = document.getElementById("reviews");
async function init()
{
    if (!token) {
        window.location.href = "login.html";
    }
    const userInfo = await api.getUserInfoAuth(token);
    if(!userInfo){
        localStorage.removeItem("auth_token");
        window.location.href = "login.html";
    }
    username.textContent = userInfo.name;
    console.log(userInfo)
    for (const element in userInfo.favourites){
        const object = (await api.getObjectInfo(userInfo.favourites[element].objectid)).info;
        var div = document.createElement("div");
        div.classList.add("my-1")
        div.textContent = object.name;
        favourites.appendChild(div)
    }
    for (const element in userInfo.review){
        const object = (await api.getObjectInfo(userInfo.review[element].object)).info;
        var div = document.createElement("div");
        div.classList.add("my-1")
        div.textContent = object.name;
        reviews.appendChild(div)
    }
}

init();