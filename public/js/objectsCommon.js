import * as api from "./api.js"


var position = 0;

export async function getObjectsOfCategory(category, number = 1)
{
    var result = (await api.getObjectsList(undefined, position, number, undefined, category)).objects
    position += number;
    return result;
}

export async function searchObjects(searchString, number = 1)
{
    var result = (await api.getObjectsList(searchString, position, number, undefined, undefined)).objects
    position += number;
    return result;
}