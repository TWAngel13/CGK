import * as api from "./api.js"
import * as objectsCommon from "./objectsCommon.js"

var objectsDiv = document.getElementById('objects-list-div');
async function loadMore()
{
    var loadedObjects = (await objectsCommon.getObjectsOfCategory("entertainment", 3));
    console.log(loadedObjects);
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
// async function init()
// {
//     for(const object of (await objectsCommon.getObjectsOfCategory("entertainment")))
//     {
//         var objectInfo = (await api.getObjectInfo(object.id)).info;
//         showObject(object, objectInfo);
//     }
// }

async function showObject(object, objectInfo)
{
    var objectDiv = document.createElement('div');
    var leftBlockDiv = document.createElement('div');
    var rightBlockDiv = document.createElement('div');
    var img = document.createElement('img');
    var objectName = document.createElement('div');
    var descriptionDiv = document.createElement('div');
    console.log(object);

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

    objectDiv.classList.add('entertainment-div');
    img.classList.add('entertainment-img');
    objectName.classList.add('entertainment-title');
    descriptionDiv.classList.add('entertainment-text');
    leftBlockDiv.classList.add('entertainment-text-block');
    rightBlockDiv.classList.add('entertainment-text-block');
 
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

document.getElementById("load-more-button").addEventListener('click', () => 
{
    loadMore();
})