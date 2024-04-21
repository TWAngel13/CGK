import * as api from "./api.js"

async function init()
{
    var objectsDiv = document.getElementById('objects-list-div');
    for(const p of (await api.getEntertainments()).objects.reverse())
    {
        var objectDiv = document.createElement('div');
        var leftBlockDiv = document.createElement('div');
        var rightBlockDiv = document.createElement('div');
        var img = document.createElement('img');
        var objectName = document.createElement('div');
        var objectDescription = document.createElement('div');
        var favoriteIcon = document.createElement('img');

        if (p.images[0] != null)
        {
            console.log(p.images[0])
            var imgBlob = await api.getImageForEntertainment(p.images[0]);
            var imgURL = URL.createObjectURL(imgBlob);
            img.setAttribute('src', imgURL)
        }

        objectName.textContent = p.name;
        if(p.description)
        {
            objectDescription.textContent = (p.description.length > 32) ? p.description.slice(0, 32-1) + '...' : p.description;
        }
        favoriteIcon.src = "images/heart.svg";

        objectDiv.classList.add('entertainment-div');
        img.classList.add('entertainment-img');
        objectName.classList.add('entertainment-title');
        objectDescription.classList.add('entertainment-text');
        leftBlockDiv.classList.add('entertainment-text-block');
        rightBlockDiv.classList.add('entertainment-text-block');
        favoriteIcon.classList.add('favorite-icon');
        /*
        objectDiv.onclick = () =>
        {
            window.location.href = './object.html?id=' + p.id;
        }
        */

        favoriteIcon.onclick = () =>
        {
            document.querySelectorAll('div').forEach((e) => {e.remove();})
        }

        objectDiv.appendChild(leftBlockDiv);
        objectDiv.appendChild(rightBlockDiv);
        leftBlockDiv.appendChild(img);
        leftBlockDiv.appendChild(favoriteIcon);

        rightBlockDiv.appendChild(objectName);
        rightBlockDiv.appendChild(objectDescription);
        objectsDiv.appendChild(objectDiv);
    }
}
init()