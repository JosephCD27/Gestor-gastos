import { apiFetch } from "../utils/api.js";

async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    const endpoint = "auth/register";
    const method = "POST";
    const body =  { name, email, password};
    try {
        const response = await apiFetch(endpoint,method ,body);

        alert("Registro exitoso, redirigiendo al login")
        window.location.href = "login.html";
    } catch (error) {
        alert(`Error en el registro: ${error.message}`)
        console.error(`Error en el registro: ${error.message}`);
        
    }
}

document.getElementById("registerForm").addEventListener("submit", handleRegister);