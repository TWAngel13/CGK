
import * as api from "../api.js"
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const errorMessage = document.getElementById('error-message');
async function init()
{
    document.notify = searchButton;
    searchButton.onclick = search;
}
async function search(){
    window.location.href = `./search.html?search=\"${searchInput.value}\"`;
}

export async function notifyError(message,closeAfter = 5000){
    errorMessage.children[0].innerHTML = message;
    errorMessage.style.display = "";
    setTimeout(()=>{
        errorMessage.style.display = "none";
    },closeAfter);
}

init();