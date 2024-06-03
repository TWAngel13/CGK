import * as api from "./api.js"
const form =  document.forms[0];
const errorText = document.getElementById("form-error");
async function init()
{
    const button = document.getElementById("orderButton");
    button.onclick = getRecommendations;
}
async function getRecommendations(){
    const pet = form.pet.value;
    const company = form.company.value;
    const cityCentre = form.cityCentre.value;
    if (pet=='' || company == '' || cityCentre == ''){
        errorText.style.display = '';
        return;
    } 
    const _tags = [pet,company,cityCentre];
    const tags = _tags.filter((item) => {
        return item !== "null";
    });
    const parsed = JSON.stringify(tags);
    window.location.href = `./search.html?tags=${parsed}`;
}
init();