
import * as api from "../api.js"
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
async function init()
{
    searchButton.onclick = search;
}
async function search(){
    window.location.href = `./search.html?search=\"${searchInput.value}\"`;
}
init();