
import * as api from "./api.js"
const token = localStorage.getItem("auth_token");
const errorText = document.getElementById("form-error");
const form =  document.forms[0]
async function init()
{
    if (token) {
        window.location.href = "account.html";
    }
    const button = document.getElementById("form-button");
    form.reset()
    form.email.addEventListener('input',( () => {errorText.style.display = "none"}));
    form.password.addEventListener('input',( () => {errorText.style.display = "none"}));
    button.onclick = login;
}
async function login()
{
    const email = form.email.value;
    const password = form.password.value;
    const token = await api.loginUser(email,password)
    if (token){
        localStorage.setItem("auth_token",token);
        window.location.href = "account.html";
    } else {
        errorText.style.display = "";
    }
}
init();