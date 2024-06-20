import * as api from "./api.js"
const token = localStorage.getItem("auth_token");
const username = document.getElementById("username");
const favourites = document.getElementById("favourites");
const reviews = document.getElementById("reviews");
const logoutButton = document.getElementById("logout");
const deleteAccountButton = document.getElementById("delete-account");
let userInfo;
async function init()
{
    if (!token) {
        window.location.href = "login.html";
    }
    userInfo = await api.getUserInfoAuth(token);
    if(!userInfo){
        logout();
        return;
    }
    const favourites_parsed = await JSON.stringify(userInfo.favourites);
    const reviews_parsed = await JSON.stringify(userInfo.review);
    localStorage.setItem("user_favourites",favourites_parsed);
    localStorage.setItem("user_reviews",reviews_parsed)
    localStorage.setItem("user_name",userInfo.name);
    localStorage.setItem("user_id",userInfo.id);
    logoutButton.onclick = logout;
    username.textContent = userInfo.name;
    if(userInfo.favourites[0] != null){
        loadMoreFavourites(0,3);
    }
    if(userInfo.review[0] != null){
        loadMoreReviews(0,3);
    }
    deleteAccountButton.onclick = () => {deleteAccount()}
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
    var reviewTextSub = document.createElement("span")
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
    reviewTextSub.textContent = review.text
    reviewTextSub.className = "text-single-line-overflow"
    reviewText.className = "text-single-line-expandable"
    reviewText.appendChild(reviewTextSub)
    reviewDiv.classList.add('review-card');
    reviewDiv.classList.add('review-card-short');
    reviewName.className = "text-single-line"
    reviewNameDiv.className = "text-single-line"
    reviewName.textContent = object.name
    reviewName.href = url;
    reviewNameDiv.appendChild(reviewName);
    reviewNameDiv.appendChild(reviewRating);
    reviewDiv.appendChild(reviewNameDiv)
    reviewDiv.appendChild(reviewText);
    return reviewDiv;
}
async function deleteAccount(confirm = false){
    if (confirm){
        await api.deleteUser(token);
        localStorage.clear();
        window.location.href = "/";
    } else {
        deleteAccountButton.textContent = "Вы уверены?"
        deleteAccountButton.onclick = () => {deleteAccount(true)}
    }
}
async function logout(){
    await api.logout(token);
    localStorage.removeItem("auth_token");
    window.location.href = "login.html";
}
function showMoreButton(func){
    const button = document.createElement("button");
    button.className = "btn btn-primary w-100 park-load-more-button";
    button.onclick = func;
    button.textContent = "Показать ещё " 
    return button;
}
async function loadMoreFavourites(current,amount){
    if (userInfo.favourites.length > current) {
        if(favourites.lastChild != null) {
            favourites.removeChild(favourites.lastChild);
        }
        for (let i = current; i < amount+current; i++){
            if (userInfo.favourites[i]==undefined){
                return;
            }
            const object = (await api.getObjectInfo(userInfo.favourites[i])).info;
            const div = createFavourite(object);
            favourites.appendChild(div)
        }
        if (current+amount < userInfo.favourites.length){
            favourites.appendChild(showMoreButton(() => {
                const _current = current+amount;
                const _amount = amount;
                loadMoreFavourites(_current,_amount);
            }))
        }
    }
}
async function loadMoreReviews(current,amount){
    if (userInfo.review.length > current) {
        if(reviews.lastChild != null) {
            reviews.removeChild(reviews.lastChild);
        }
        for (let i = current; i<amount+current; i++){
            if (userInfo.review[i]==undefined){
                return;
            }
            const review = userInfo.review[i];
            const object = (await api.getObjectInfo(review.object)).info;  
            const reviewDiv = createReview(object,review);
            reviews.appendChild(reviewDiv)
        }
        if (current+amount < userInfo.review.length){
            reviews.appendChild(showMoreButton(() => {
                const _current = current+amount;
                const _amount = amount;
                loadMoreReviews(_current,_amount);
            }))
        }
    }
}
init();