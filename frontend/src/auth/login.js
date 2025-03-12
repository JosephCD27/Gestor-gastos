import { apiFetch } from "../utils/api.js";
import { setToken } from "../utils/auth.js";

async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    const endpoint = "auth/login";
    const method = "POST";
    const body =  {email, password};
    try {
        const response = await apiFetch(endpoint, method, body, null);

        setToken(response.token);

        alert("iniciando sesión")
        window.location.href="categories.html";
    } catch (error) {
        alert(`error al iniciar sesión ${error.message}`)
        console.error(`Error en el login: ${error}`);
    }
}

document.getElementById("loginForm").addEventListener("submit", handleLogin)
