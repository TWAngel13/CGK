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
    const _optionalTags = (new URLSearchParams(window.location.search)).get('optionalTags');
    const optionalTags = await JSON.parse(_optionalTags);
    if (search){
        searchInput.value = search;
    }
    const loadButton = document.getElementById("load-more-button");
    loadButton.onclick = () => {loadMore(search,tags,optionalTags)};
    loadMore(search,tags,optionalTags);

}
async function loadMore(search,tags,optionalTags)
{
    var loadedObjects = (await objectsCommon.searchObjects(search,2,tags,optionalTags));
    if (!(await objectsCommon.nextObjectOfSearchExists(search,2,tags,optionalTags))){
        document.getElementById("load-more-button").remove()
    }
    if(loadedObjects)
    {
        for(const object of loadedObjects)
        {
            var objectInfo = (await api.getObjectInfo(object.id)).info;
            objectsCommon.showObject(object, objectInfo,objectInfo.categoryname[0],objectsDiv);
        }
    }
    else
    {
        document.getElementById("load-more-button").remove()
        console.log("Out of objects");
    }
}

init();