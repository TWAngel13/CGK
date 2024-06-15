import * as api from "./api.js"
import { notifyError } from "./global/navbar.js";


var position = 0;
var favourites = await (async () => {
    const favouritesUnparsed = localStorage.getItem("user_favourites");
    if (favouritesUnparsed){
        return await JSON.parse(favouritesUnparsed);
    } else {
        return null;
    }
})();
export async function getObjectsOfCategory(category, number = 1)
{
    var result = (await api.getObjectsList(undefined, position, number, undefined, category,undefined)).objects
    position += number;
    return result;
}

export async function searchObjects(searchString, number = 1,tags = undefined)
{
    var result = (await api.getObjectsList(searchString, position, number, tags, undefined,undefined)).objects
    position += number;
    return result;
}

export async function showObject(object, objectInfo,cssName,objectsDiv)
{

    var objectDiv = document.createElement('div');
    var leftBlockDiv = document.createElement('div');
    var rightBlockDiv = document.createElement('div');
    var img = document.createElement('img');
    var objectName = document.createElement('div');
    var descriptionDiv = document.createElement('div');

    if (object.images[0] != null)
    {
        var imgBlob = await api.getImage(object.images[0]);
        var imgURL = URL.createObjectURL(imgBlob);
        img.setAttribute('src', imgURL)
    }

    objectName.textContent = object.name;
    if(objectInfo.attributes != null)
    {
        var addressDiv = document.createElement('div');
        var phoneDiv = document.createElement('div');
        addressDiv.textContent = objectInfo.attributes.address;
        phoneDiv.textContent = objectInfo.attributes.phone.split(',')[0];
        descriptionDiv.appendChild(addressDiv);
        descriptionDiv.appendChild(phoneDiv);
        //descriptionDiv.textContent = objectInfo.attributes.address + objectInfo.attributes.phone;
    }

    objectDiv.classList.add(`${cssName}-div`);
    img.classList.add(`${cssName}-img`);
    objectName.classList.add(`${cssName}-title`);
    descriptionDiv.classList.add(`${cssName}-text`);
    leftBlockDiv.classList.add(`${cssName}-text-block`);
    rightBlockDiv.classList.add(`${cssName}-text-block`);
 
    objectDiv.onclick = () =>
    {
        window.location.href = './object.html?id=' + object.id;
    }

    objectDiv.appendChild(leftBlockDiv);
    objectDiv.appendChild(rightBlockDiv);
    leftBlockDiv.appendChild(img);

    rightBlockDiv.appendChild(objectName);
    rightBlockDiv.appendChild(descriptionDiv);
    objectsDiv.appendChild(objectDiv);
    
    const favoriteIcon = await addToFavouritesButton(object.id);
    leftBlockDiv.appendChild(favoriteIcon);
}
export async function addToFavouritesButton(objectID){
    var favourited = (favourites && favourites.includes(objectID));
    const token = localStorage.getItem("auth_token");
    var favoriteIcon = document.createElement('img');
    const onHover = () => {
        favoriteIcon.src = "images/heart.svg";
    };
    const onUnHover = () => {
        favoriteIcon.src = "images/heartEmpty.svg";
    }
    favoriteIcon.src =  favourited?"images/heart.svg":"images/heartEmpty.svg";
    favoriteIcon.classList.add('favorite-icon');
    if(!favourited){
        favoriteIcon.onmouseover = onHover;
        favoriteIcon.onmouseleave = onUnHover;
    }
    favoriteIcon.onclick = async (event) =>
    {
        event.stopPropagation();
        if (token && api.getUserInfoAuth(token)){
            if (!favourited){
                await api.addToFavourites(token,objectID);
                favoriteIcon.src = "images/heart.svg";
                favoriteIcon.onmouseleave = null;
                favourites.push(objectID)
            } else {
                await api.removeFromFavourites(token,objectID);
                favoriteIcon.src = "images/heartEmpty.svg";
                if(favourites.indexOf(objectID) != -1){
                    favourites.splice(favourites.indexOf(objectID), 1);
                }   
                favoriteIcon.onmouseover = onHover;
                favoriteIcon.onmouseleave = onUnHover;
            }
            console.log(favourites)
            favourited = !favourited;
            localStorage.setItem("user_favourites",(await JSON.stringify(favourites)));
        } else {
            notifyError("Сперва войдите в аккаунт")
        }
    }
    return favoriteIcon;
}