import * as api from "./api.js"
import * as objectsCommon from "./objectsCommon.js"

var objectsDiv = document.getElementById('objects-list-div');

async function loadMore()
{
    var loadedObjects = (await objectsCommon.getObjectsOfCategory("restaurant", 3));
    if (!(await objectsCommon.nextObjectOfCategoryExists("restaurant"))){
        document.getElementById("load-more-button").remove()
    }
    if(loadedObjects)
    {
        for(const object of loadedObjects)
        {
            var objectInfo = (await api.getObjectInfo(object.id)).info;
            objectsCommon.showObject(object, objectInfo,"restaurant",objectsDiv);
        }
    }
    else
    {
        document.getElementById("load-more-button").remove()
        console.log("Out of objects");
    }
}



document.getElementById("load-more-button").addEventListener('click', () => 
{
    loadMore();
})
loadMore();