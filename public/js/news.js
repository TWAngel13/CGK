
import * as api from "./api.js"
import { addToFavouritesButton, createWorkingHoursDiv } from "./objectsCommon.js";
async function init()
{
    
    const newsID = (new URLSearchParams(window.location.search)).get('id');
    const _news = await api.getNews(newsID);
    if (_news === undefined){
        window.location.href = '/';
        return;
    }
    const news = _news.info;
    document.getElementById("news-date-img").style.display = "";
    const newsDate = document.getElementById("news-date");
    newsDate.childNodes[1].style.display = ""
    newsDate.childNodes[1].textContent = new Date(news.date).toLocaleString();
    document.getElementById('news-article').textContent = news.article;
    const imgDiv = document.getElementById('news-img');
    if (news.images[0]){
        const imgBlob = await api.getImage(news.images[0]);
        const imgURL = URL.createObjectURL(imgBlob);
        imgDiv.src = imgURL;
        imgDiv.style.display = "";
    } 
    
    document.getElementById('news-body').innerText = news.body;
    document.getElementById("outer-loader").remove()
    document.getElementById("main-div").style.display = ""
}

init();