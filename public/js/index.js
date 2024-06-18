import * as api from "./api.js"
const form =  document.forms[0];
const errorText = document.getElementById("form-error");
const allNewsDiv = document.getElementById("news-div");
const loadNewsButton = document.getElementById("load-news");
async function init()
{
    const button = document.getElementById("orderButton");
    button.onclick = getRecommendations;
    loadNews(0,1);
}
async function getRecommendations(){
    let tags = [];
    const optionalTags = [];
    let i = 0;
    while (form[`required${i}`] !== undefined){
        console.log(form[`required${i}`].value)
        const parsed = JSON.parse(form[`required${i}`].value);
        if(Array.isArray(parsed)) {
            tags = [...tags,...parsed];
        } else if (parsed!="null"){
            tags.push(parsed);
        }
        i +=1;
    }
    i = 0;
    while (form[`optional${i}`] !== undefined){
        const parsed = JSON.parse(form[`optional${i}`].value);
        if(Array.isArray(parsed)) {
            optionalTags.push(parsed)
        } else if (parsed!="null") {
            optionalTags.push([parsed]);
            console.log("why to use single item in optional tags?")
        }
        i+=1;
    }
    let optionalParsed = null;
    let parsed = null;
    if (tags.length != 0) {
        parsed = JSON.stringify(tags);
    }
    if (optionalTags.length != 0 ){
        optionalParsed = JSON.stringify(optionalTags);
    }
    window.location.href = `./search.html?` +
        `${parsed?`tags=${parsed}&`:"&"}` +
        `${optionalParsed?`optionalTags=${optionalParsed}&`:"&"}`;
}
async function loadNews(current,amount){
    const allNews = await api.getNewsList(current,current+amount+1);
    if (allNews.length > amount) {
        loadNewsButton.style.display = "";
        loadNewsButton.onclick = () => {
            const _current = current + amount;
            const _amount = amount;
            loadNews(_current,_amount);
        }
    } else {
        loadNewsButton.style.display = "none";
    }
    if (allNews.length > 1){
        allNews.pop();
    }
    for (const news of allNews) {
        const newsDiv = document.createElement("div");
        newsDiv.className = "col";
        const newsSubDiv = document.createElement("div");
        newsSubDiv.className="news-div";
        if (news.images[0]){
            const imgDiv = document.createElement("img");
            imgDiv.className = "news-img";
            const imgBlob = await api.getImage(news.images[0]);
            const imgURL = URL.createObjectURL(imgBlob);
            imgDiv.src = imgURL;
            newsSubDiv.appendChild(imgDiv);
        }
        const newsTitle = document.createElement("div");
        newsTitle.className = "news-title";
        newsTitle.textContent = news.article;
        const newsText = document.createElement("div");
        newsText.className = "news-text text-single-line ";
        newsText.textContent = news.body;
        
        newsSubDiv.appendChild(newsTitle);
        newsSubDiv.appendChild(newsText);
        newsDiv.appendChild(newsSubDiv);
        allNewsDiv.appendChild(newsDiv);
        newsDiv.style.cursor = "pointer"
        newsDiv.onclick = () =>
        {
            window.location.href = './news.html?id=' + news.id;
        }
    }
}
init();