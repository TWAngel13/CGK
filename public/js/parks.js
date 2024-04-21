import * as api from "./api.js"
import * as objectsCommon from "./objectsCommon.js"

var objectsDiv = document.getElementById('objects-list-div');

async function init()
{
    for(const object of (await objectsCommon.getObjectsOfCategory("park")))
    {
        var objectInfo = (await api.getObjectInfo(object.id)).info;
        showObject(object, objectInfo);
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

    objectDiv.classList.add('park-div');
    img.classList.add('park-img');
    objectName.classList.add('park-title');
    objectDescription.classList.add('park-text');
    leftBlockDiv.classList.add('park-text-block');
    rightBlockDiv.classList.add('park-text-block');
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