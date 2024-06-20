
import * as api from "./api.js"
import { notifyError } from "./global/navbar.js";
import * as objectsCommon from "./objectsCommon.js"

const stars = (() => {
    const _stars = [];
    for (let i = 1; i<=5; i++){
        _stars.push(document.getElementById(`star${i}`))
    }
    return _stars;
})()
const token = localStorage.getItem("auth_token");
const objectID = (new URLSearchParams(window.location.search)).get('id');
const publishButton = document.getElementById("publish-review");
const objectsDiv = document.getElementById('objects-list-div');
const textDiv = document.getElementById("text-review");


async function init()
{
    if (!(token && api.getUserInfoAuth(token)) || !objectID){
        window.location.href = '/';
        return;
    }
    
    const object = (await api.getObjectInfo(objectID)).info;
    if (!object){
        window.location.href = '/';
        return;
    }
    const existingReview = await api.getUserReview(localStorage.getItem("user_id"),objectID);

    await objectsCommon.showObject(object, object,object.categoryname[0],objectsDiv);
    for (const _star in stars){
        const star = Number(_star)
        stars[star].onmouseenter = () => {setStars(star)};
        stars[star].onmouseleave = () => {removeStars(star)};
        stars[star].onclick = () => {rememberStars(star)};
    }
    publishButton.onclick = () => {
        publishButton.textContent = "Поставьте оценку"
        publishButton.className = "object-button-red"
        setTimeout(() => {
            publishButton.className = "object-button"
            publishButton.textContent = existingReview?"ИЗМЕНИТЬ ОТЗЫВ":"ОТПРАВИТЬ"
        },1000)
    }
    if (existingReview) {
        rememberStars(existingReview.rating-1)
        textDiv.value = existingReview.text
        publishButton.textContent = "ИЗМЕНИТЬ ОТЗЫВ"
    }
    document.getElementById("outer-loader").remove()
    document.getElementById("main-div").style.display = ""
}
async function setStars(pos,last = 0){
    for (let i = 0; i<= pos; i++){
        stars[i].className = "fa fa-star review-star-checked"
    }

}
async function removeStars(pos,last = 0){
    for (let i = pos; i>=last; i=i-1){
        stars[i].className = "fa fa-star"
    }
}
async function rememberStars(pos = 0){
    publishButton.onclick = async () => {
        
        const text = textDiv.value;
        await api.createReview(token,pos+1,objectID,text);
        window.location.href = './object.html?id=' + objectID;
    }
    removeStars(4)
    setStars(pos);
    for (let i = 0; i<=4; i++){
        stars[i].onmouseenter = () => {setStars(i,pos+1)};
        stars[i].onmouseleave = () => {removeStars(i,pos+1)};
    }
    
}
init();