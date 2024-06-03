
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
    form.name.addEventListener('input',( () => {errorText.style.display = "none"}));
    button.onclick = register;
}
async function register()
{
    const email = form.email.value;
    const password = form.password.value;
    const name = form.name.value;
    console.log(errorText)
    if (name=="" || password=="" || email==""){
        setErrorText("Не все поля заполнены");
        return;
    }
    if (!validateEmail(email)) {
        setErrorText("Почта введена не правильно");
        return;
    }
    const token = await api.registerUser(name,email,password);
    console.log(token)
    if (token){
        if (token == -1){
            setErrorText("Пользователь уже существует");
        }
        else {
            localStorage.setItem("auth_token",token);
            window.location.href = "account.html";
        }
    } else {
        errorText.style.display = "";
    }
}
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}
function setErrorText(text){
    errorText.children[0].innerHTML = text;
    errorText.style.display = "";
}
init();