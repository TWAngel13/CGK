import * as api from "./api.js"

const objectCategories = {
    "restaurant": 1,
    "park": 2,
    "entertainment": 3
}

var position = 0;

export async function getObjectsOfCategory(category, number = 2)
{
    var result = (await api.getObjectsList(undefined, position, number)).objects
    if(result)
    {
        result = result.filter((object) => object.category == objectCategories[category]);
    }
    position += number;
    return result;
}