import * as api from "./api.js"
import * as objectsCommon from "./objectsCommon.js"

var objectsDiv = document.getElementById('objects-list-div');
async function loadMore()
{
    var loadedObjects = (await objectsCommon.getObjectsOfCategory("entertainment", 3));
    if(loadedObjects)
    {
        for(const object of loadedObjects)
        {
            var objectInfo = (await api.getObjectInfo(object.id)).info;
            objectsCommon.showObject(object, objectInfo,"entertainment",objectsDiv);
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


document.getElementById("load-more-button").addEventListener('click', () => 
{
    loadMore();
})
loadMore();