import * as api from "./api.js"
const token = localStorage.getItem("auth_token");
const username = document.getElementById("username");
const favourites = document.getElementById("favourites");
const reviews = document.getElementById("reviews");
const logoutButton = document.getElementById("logout");
async function init()
{
    if (!token) {
        window.location.href = "login.html";
    }
    const userInfo = await api.getUserInfoAuth(token);
    if(!userInfo){
        logout();
    }
    logoutButton.onclick = logout;
    username.textContent = userInfo.name;
    if(userInfo.favourites[0] != null){
        for (const element in userInfo.favourites){
            const object = (await api.getObjectInfo(userInfo.favourites[element].objectid)).info;
            const div = createFavourite(object);
            favourites.appendChild(div)
        }
    }
    if(userInfo.review[0] != null){
        for (const element in userInfo.review){
            const review = userInfo.review[element];
            const object = (await api.getObjectInfo(review.object)).info;  
            const reviewDiv = createReview(object,review);
            reviews.appendChild(reviewDiv)
        }
    }
}
function createFavourite(object) {
    const url = `${window.location.origin}/object.html?id=${object.id}`;
    var div = document.createElement("a");
    div.classList.add("my-1")
    div.textContent = object.name;
    div.href = url;
    return div;

}
function createReview(object,review) {
    const url = `${window.location.origin}/object.html?id=${object.id}`;
    var reviewDiv = document.createElement('div');
    var reviewNameDiv = document.createElement('div');
    var reviewName = document.createElement('a');
    var reviewRating = document.createElement('div');
    var reviewText = document.createElement('div');
    for(var j = 0; j < 5; j++)
        {
            var star = document.createElement("span");
            star.classList.add('fa');
            star.classList.add('fa-star');
            star.classList.add('review-star');
            if (j < review.rating)
            {
                star.classList.add('review-star-checked');
            }
            reviewRating.appendChild(star);
            
        }
    reviewText.className = "text-single-line"
    reviewText.textContent = (review.text.length > 64) 
        ? review.text.slice(0, 64 - 1) 
        + '...' : review.text;
    
    reviewDiv.classList.add('review-card');
    reviewDiv.classList.add('review-card-short');
    reviewName.textContent = object.name
    reviewName.href = url;
    reviewNameDiv.appendChild(reviewName);
    reviewNameDiv.appendChild(reviewRating);
    reviewDiv.appendChild(reviewNameDiv)
    reviewDiv.appendChild(reviewText);
    return reviewDiv;
}
function logout(){
    localStorage.removeItem("auth_token");
    window.location.href = "login.html";
}
init();