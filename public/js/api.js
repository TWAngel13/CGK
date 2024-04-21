//// objects
export async function getObjectsList(
    searchString = undefined,
    startPos = undefined,
    maxPlaces = undefined,
    tags = []
){
    const params = [searchString,startPos,maxPlaces,tags];
    const paramsName = ["search","start","max","tags"];
    const response = await fetch("/api/objects/list" +  _paramsToStr(params,paramsName), {
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

export async function getObjectInfo(id,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch("/api/objects/id/" + id + _paramsToStr(params,paramsName), {
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
export async function getAllTags() {
    const response = await fetch("/api/objects/tags", {
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
export async function getAllTagsByID(id){
    const response = await fetch("/api/objects/tagsID/" + id, {
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
export async function getUserInfo(id,token = undefined) {
    const response = await fetch(`/api/users/id/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json","Accept": "application/json" },
        body: JSON.stringify({
            token:token
          })
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
export async function getUserReviews(id,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch(`/api/users/id/${id}/reviews`+ _paramsToStr(params,paramsName), {
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
export async function getUserFavourites(id,token,startPosReviews=undefined,maxReviews=undefined) {
    const params = [startPosReviews,maxReviews];
    const paramsName = ["start","max"];
    const response = await fetch(`/api/users/id/${id}/favourites`+ _paramsToStr(params,paramsName), {
        method: "GET",
        headers: { "Content-Type": "application/json","Accept": "application/json" },
        body: JSON.stringify({
            token:token
          })
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
export async function getImage(id)
{
    const response = await fetch("/api/images/id/" + id, {
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

//auth
export async function registerUser(userName,userMail,password){
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userName: userName,
            userMail: userMail,
            userPassword: password
          })
    });
    if (response.ok === true)
    {
        const token = await response.json()
        return token;
    }
    else
    {
        if(response.status == 409){
            return -1;
        }
        else{
            console.log(response);
        }
    }
}
export async function login(userMail,password){
    const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userMail: userMail,
            password: password
          })
    });
    if (response.ok === true)
    {
        const token = await response.json()
        return token;
    }
    else
    {
        console.log(response);
    }
}
export async function logout(token){
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token:token
          })
    });
    if (response.ok === true)
    {
        return await response.json()
    }
    else
    {
        console.log(response);
    }
}
export async function createReview(token,rating,objectID,reviewText = undefined,images = [] || undefined){
    const response = await fetch("/api/auth/createReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token:token,
            rating: rating,
            objectID:objectID,
            text:reviewText,
            images:images,
          })
    });
    if (response.ok === true)
    {
        return await response.json()
    }
    else
    {
        console.log(response);
    }
}
export async function addToFavourites(token,objectID){
    const response = await fetch("/api/auth/addFavourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token:token,
            objectID:objectID,
          })
    });
    if (response.ok === true)
    {
        return await response.json()
    }
    else
    {
        console.log(response);
    }
}
export async function removeFromFavourites(token,objectID){
    const response = await fetch("/api/auth/removeFavourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token:token,
            objectID:objectID,
          })
    });
    if (response.ok === true)
    {
        return await response.json()
    }
    else
    {
        console.log(response);
    }
}
export async function addImageToReview(token,image,objectID,reviewID){
    const response = await fetch("/api/auth/uploadImageToReview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token:token,
            objectID:objectID,
            reviewID:reviewID,
            image:image,
          })
    });
    if (response.ok === true)
    {
        return await response.json()
    }
    else
    {
        console.log(response);
    }
}
//misc
function _paramsToStr(params,paramsName){
    let str = "?";
    for(let i = 0;i < params.length; i++){
        if(params[i]){
        str += paramsName[i] + "=" + params[i] + "&";
        }
    }
    return str
}