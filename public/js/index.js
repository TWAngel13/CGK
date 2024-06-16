import * as api from "./api.js"
const form =  document.forms[0];
const errorText = document.getElementById("form-error");
async function init()
{
    const button = document.getElementById("orderButton");
    button.onclick = getRecommendations;
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
init();