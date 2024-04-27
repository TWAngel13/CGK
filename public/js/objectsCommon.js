import * as api from "./api.js"


var position = 0;

export async function getObjectsOfCategory(category, number = 1)
{
    //console.log("startPos: " + position + " maxPlaces: " + number + "objectCategory")
    //console.log((await api.getObjectsList(undefined, position, number, undefined, category)))
    var result = (await api.getObjectsList(undefined, position, number, undefined, category)).objects
    position += number;
    return result;
}