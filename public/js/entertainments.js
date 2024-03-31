async function getEntertainments()
{
    const response = await fetch("/api/objects/restaurant/list", {
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

async function getImageForRestaurant(id)
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

async function init()
{
    var objectsDiv = document.getElementById('objects-list-div');
    for(const p of (await getEntertainments()).objects.reverse())
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
            var imgBlob = await getImageForRestaurant(p.images[0]);
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