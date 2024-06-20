
import * as api from "./api.js"
import { addToFavouritesButton, createWorkingHoursDiv } from "./objectsCommon.js";
const createReviewButton = document.getElementById("create-review");
const objectID = (new URLSearchParams(window.location.search)).get('id');
async function init()
{
    createReviewButton.onclick = createReview;
    var objectInfo = await api.getObjectInfo(objectID);
    if (objectInfo === undefined){
        window.location.href = '/';
    }
    document.getElementById('object-name-div').textContent = objectInfo.info.name;

    var imgBlob = await api.getImage(objectInfo.info.images[0]);
    var imgURL = URL.createObjectURL(imgBlob);
    document.getElementById('object-img').setAttribute('src', imgURL);
    document.getElementById('object-img').style.opacity = 100;
    document.getElementById('address-div').textContent = objectInfo.info.attributes.address;
    document.getElementById('phone-div').textContent = objectInfo.info.attributes.phone;

    const favButton = await addToFavouritesButton(Number(objectID));
    favButton.style.position = "static";
    document.getElementById('fav-button').appendChild(favButton);
    const workingHoursSubDiv = await createWorkingHoursDiv(objectInfo,false);
    const workingHoursDiv = document.getElementById('working-hours-div')
    if (workingHoursSubDiv){
        const workingHoursImg = document.getElementById('working-hours-img');
        workingHoursImg.style.display = "";
        workingHoursDiv.childNodes[1].style.display = ""
        workingHoursDiv.appendChild(workingHoursSubDiv);
        workingHoursDiv.onclick = () => {
            workingHoursSubDiv.style.display = ""
        }
        workingHoursDiv.onmouseleave = () => {
            workingHoursSubDiv.style.display = "none"
        }
    } else {
        workingHoursDiv.childNodes[1].style.display = "none"
    }
    for(var i = 0; i < objectInfo.reviews.length; i++)
    {
        var reviewDiv = document.createElement('div');
        var reviewName = document.createElement('div');
        var reviewRating = document.createElement('div');
        var reviewText = document.createElement('div');
        var reviewTextSub = document.createElement('span');
        //reviewName.textContent = objectInfo.reviews[i].userid;
        reviewName.textContent = (await api.getUsers()).users.filter((user) => user.id == objectInfo.reviews[i].userid)[0].name;
        for(var j = 0; j < 5; j++)
        {
            
            var star = document.createElement("span");
            star.classList.add('fa');
            star.classList.add('fa-star');
            star.classList.add('review-star');
            if (j < objectInfo.reviews[i].rating)
            {
                star.classList.add('review-star-checked');
            }
            reviewRating.appendChild(star);
            
        }

        //reviewRating.textContent = objectInfo.reviews[i].rating;
        if( objectInfo.reviews[i].text) {
            reviewTextSub.textContent = objectInfo.reviews[i].text
            reviewTextSub.className = "text-single-line-overflow"
            reviewText.className = "text-single-line-expandable"
            reviewText.appendChild(reviewTextSub)
        }
        

        reviewDiv.classList.add('review-card');

        reviewDiv.appendChild(reviewName);
        reviewDiv.appendChild(reviewRating);
        reviewDiv.appendChild(reviewText);

        document.getElementById('review-container-div').appendChild(reviewDiv);
    }
    document.getElementById("create-route").onclick = () => {
        window.location.href=`./map.html?lat=${objectInfo.info.x}&long=${objectInfo.info.y}`;
    }
    document.getElementById("outer-loader").remove()
    document.getElementById("main-div").style.display = ""
}
async function createReview() {
    const token = localStorage.getItem("auth_token");
    if (token && api.getUserInfoAuth(token)){
        window.location.href = './createReview.html?id=' + objectID;
    } else {
        createReviewButton.textContent = "СПЕРВА ВОЙДИТЕ В АККАУНТ"
        createReviewButton.className = "object-button-red"
    }
}
init();