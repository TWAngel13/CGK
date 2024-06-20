import * as api from "./api.js"
import * as objectsCommon from "./objectsCommon.js"

var objectsDiv = document.getElementById('objects-list-div');
async function loadMore()
{
    var loadedObjects = (await objectsCommon.getObjectsOfCategory("park", 2));
    if(loadedObjects)
    {
        for(const object of loadedObjects)
        {
            var objectInfo = (await api.getObjectInfo(object.id)).info;
            objectsCommon.showObject(object, objectInfo,"park",objectsDiv);
        }
    }
    else
    {
        console.log("Out of objects");
    }
}


document.getElementById("load-more-button").addEventListener('click', () => 
{
    loadMore();
})
loadMore();