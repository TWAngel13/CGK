import * as api from "./api.js"
import * as objectsCommon from "./objectsCommon.js"

var objectsDiv = document.getElementById('objects-list-div');
const searchInput = document.getElementById('search-input');
async function init()
{
    const _search = (new URLSearchParams(window.location.search)).get('search');
    const search = _search?_search.substring(1,_search.length-1):undefined;
    const _tags = (new URLSearchParams(window.location.search)).get('tags');
    const tags = await JSON.parse(_tags);
    if (search){
        searchInput.value = search;
    }
    const loadButton = document.getElementById("load-more-button");
    loadButton.onclick = () => {loadMore(search,tags)};
    loadMore(search,tags);

}
async function loadMore(search,tags)
{
    var loadedObjects = (await objectsCommon.searchObjects(search,2,tags));
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
        if(objectInfo.attributes.address){
            var addressDiv = document.createElement('div');
            addressDiv.textContent = objectInfo.attributes.address;
            descriptionDiv.appendChild(addressDiv);
        }
        if(objectInfo.attributes.phone){
            var phoneDiv = document.createElement('div');
            phoneDiv.textContent = objectInfo.attributes.phone.split(',')[0];
            descriptionDiv.appendChild(phoneDiv);
        }
        //descriptionDiv.textContent = objectInfo.attributes.address + objectInfo.attributes.phone;
    }

    objectDiv.classList.add('park-div');
    img.classList.add('park-img');
    objectName.classList.add('park-title');
    descriptionDiv.classList.add('park-text');
    leftBlockDiv.classList.add('park-text-block');
    rightBlockDiv.classList.add('park-text-block');

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
}
init();