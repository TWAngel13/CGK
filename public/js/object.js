
import * as api from "./api.js"

async function init()
{
    
    var objectID = (new URLSearchParams(window.location.search)).get('id');
    var objectInfo = await api.getObjectInfo(objectID);

    document.getElementById('object-name-div').textContent = objectInfo.info.name;

    var imgBlob = await api.getImage(objectInfo.info.images[0]);
    var imgURL = URL.createObjectURL(imgBlob);
    document.getElementById('object-img').setAttribute('src', imgURL);

    document.getElementById('address-div').textContent = objectInfo.info.attributes.address;
    document.getElementById('phone-div').textContent = objectInfo.info.attributes.phone;

    for(var i = 0; i < objectInfo.reviews.length; i++)
    {
        var reviewDiv = document.createElement('div');
        var reviewName = document.createElement('div');
        var reviewRating = document.createElement('div');
        var reviewText = document.createElement('div');

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
        reviewText.textContent = (objectInfo.reviews[i].text.length > 64) 
            ? objectInfo.reviews[i].text.slice(0, 64 - 1) 
            + '...' : objectInfo.reviews[i].text;

        reviewDiv.classList.add('review-card');

        reviewDiv.appendChild(reviewName);
        reviewDiv.appendChild(reviewRating);
        reviewDiv.appendChild(reviewText);

        document.getElementById('review-container-div').appendChild(reviewDiv);
        console.log(await api.getObjectsList("драмы"));
    }
}

init();