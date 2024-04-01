//// places
export async function getEntertainments(
    searchString = undefined,
    startPos = undefined,
    maxPlaces = undefined,
    tags = []
)
{
    const params = [searchString,startPos,maxPlaces,tags];
    const paramsName = ["search","start","max","tags"];
    const response = await fetch("/api/objects/entertainment/list" +  _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getRestaurants(
    searchString = undefined,
    startPos = undefined,
    maxPlaces = undefined,
    tags = []
)
{
    const params = [searchString,startPos,maxPlaces,tags];
    const paramsName = ["search","start","max","tags"];
    const response = await fetch("/api/objects/restaurant/list" +  _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getParks(
    searchString = undefined,
    startPos = undefined,
    maxPlaces = undefined,
    tags = []
)
{
    const params = [searchString,startPos,maxPlaces,tags];
    const paramsName = ["search","start","max","tags"];
    const response = await fetch("/api/objects/park/list" +  _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}



export async function getRestaurantData(id,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch("/api/objects/restaurant/id/" + id + _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getEntertainmentData(id,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch("/api/objects/entertainment/id/" + id + _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getParkData(id,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch("/api/objects/park/id/" + id + _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getParkTags() {
    const response = await fetch("/api/objects/park/tags", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getRestaurantTags() {
    const response = await fetch("/api/objects/restaurant/tags", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getEntertainmentTags() {
    const response = await fetch("/api/objects/entertainment/tags", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
//// users
export async function getUserRestaurantReviews(id,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch(`/api/users/id/${id}/reviews/restaurant`+ _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getUserEntertainmentReviews(id,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch(`/api/users/id/${id}/reviews/entertainment`+ _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getUserParkReviews(id,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch(`/api/users/id/${id}/reviews/park`+ _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
export async function getUsers(startPosUsers=undefined,maxUsers=undefined) {
    const params = [startPosUsers,maxUsers];
    const paramsName = ["start","max"];
    const response = await fetch("/api/users/list"  + _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true)
    {
        return await response.json();
    }
    else
    {
        console.log(response);
    }
}
/// images
export async function getImageForRestaurant(id)
{
    const response = await fetch("/api/images/places/restaurant/" + id, {
        method: "GET",
        headers: { "Accept": "image/png" }
    });
    if (response.ok === true)
    {
        return await response.blob();
    }
    else
    {
        console.log(response);
    }
}
export async function getImageForEntertainment(id)
{
    const response = await fetch("/api/images/places/entertainment/" + id, {
        method: "GET",
        headers: { "Accept": "image/png" }
    });
    if (response.ok === true)
    {
        return await response.blob();
    }
    else
    {
        console.log(response);
    }
}
export async function getImageForPark(id)
{
    const response = await fetch("/api/images/places/park/" + id, {
        method: "GET",
        headers: { "Accept": "image/png" }
    });
    if (response.ok === true)
    {
        return await response.blob();
    }
    else
    {
        console.log(response);
    }
}
export async function getImageForRestaurantReview(id)
{
    const response = await fetch("/api/images/reviews/restaurant/" + id, {
        method: "GET",
        headers: { "Accept": "image/png" }
    });
    if (response.ok === true)
    {
        return await response.blob();
    }
    else
    {
        console.log(response);
    }
}
export async function getImageForEntertainmentReview(id)
{
    const response = await fetch("/api/images/reviews/entertainment/" + id, {
        method: "GET",
        headers: { "Accept": "image/png" }
    });
    if (response.ok === true)
    {
        return await response.blob();
    }
    else
    {
        console.log(response);
    }
}
export async function getImageForParkReview(id)
{
    const response = await fetch("/api/images/reviews/park/" + id, {
        method: "GET",
        headers: { "Accept": "image/png" }
    });
    if (response.ok === true)
    {
        return await response.blob();
    }
    else
    {
        console.log(response);
    }
}
function _paramsToStr(params,paramsName){
    let str = "?";
    for(let i = 0;i < params.length; i++){
        if(params[i]){
        str += paramsName[i] + "=" + params[i] + "&";
        }
    }
    return str
}