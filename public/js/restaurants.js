import * as api from "./api.js"
import * as objectsCommon from "./objectsCommon.js"

var objectsDiv = document.getElementById('objects-list-div');

async function init()
{
    
}

async function loadMore()
{
    var loadedObjects = (await objectsCommon.getObjectsOfCategory("restaurant", 2));
    if(loadedObjects)
    {
        for(const object of loadedObjects)
        {
            var objectInfo = (await api.getObjectInfo(object.id)).info;
            showObject(object, objectInfo);
        }
    }
    else
    {
        console.log("Out of objects");
    }
}

async function showObject(object, objectInfo)
{
    var objectDiv = document.createElement('div');
    var leftBlockDiv = document.createElement('div');
    var rightBlockDiv = document.createElement('div');
    var img = document.createElement('img');
    var objectName = document.createElement('div');
    var objectDescription = document.createElement('div');

    if (object.images[0] != null)
    {
        var imgBlob = await api.getImage(object.images[0]);
        var imgURL = URL.createObjectURL(imgBlob);
        img.setAttribute('src', imgURL)
    }

    objectName.textContent = object.name;
    if(objectInfo.attributes[0] != null)
    {
        //objectDescription.textContent = (object.description.length > 32) ? object.description.slice(0, 32-1) + '...' : object.description;
        objectDescription.textContent = (objectInfo.attributes[0].length > 32) ? objectInfo.attributes[0].slice(0, 32-1) + '...' : objectInfo.attributes[0];
    }

    objectDiv.classList.add('restaurant-div');
    img.classList.add('restaurant-img');
    objectName.classList.add('restaurant-title');
    objectDescription.classList.add('restaurant-text');
    leftBlockDiv.classList.add('restaurant-text-block');
    rightBlockDiv.classList.add('restaurant-text-block');
    /*
    objectDiv.onclick = () =>
    {
        window.location.href = './object.html?id=' + p.id;
    }
    */



    objectDiv.appendChild(leftBlockDiv);
    objectDiv.appendChild(rightBlockDiv);
    leftBlockDiv.appendChild(img);

    rightBlockDiv.appendChild(objectName);
    rightBlockDiv.appendChild(objectDescription);
    objectsDiv.appendChild(objectDiv);

    if(false)
    {
        var favoriteIcon = document.createElement('img');
        favoriteIcon.src = "images/heart.svg";
        favoriteIcon.classList.add('favorite-icon');
        favoriteIcon.onclick = () =>
        {
            document.querySelectorAll('div').forEach((e) => {e.remove();})
        }
        leftBlockDiv.appendChild(favoriteIcon);
    }
}

init()

document.getElementById("load-more-button").addEventListener('click', () => 
{
    loadMore()
})