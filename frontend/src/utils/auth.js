import { logout } from "./logout.js";

const TOKEN_KEY = "token";
const LOGIN_URL = "login.html";

// Obtener el token del localStorage
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Guardar el token en el localStorage
export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

// Eliminar el token del localStorage y sessionStorage
export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

// Verificar si el usuario está logueado y si el token es válido/no expirado
export function verifyLogin() {
    const token = getToken();

    // Si no hay token, redirige
    if (!token) {
        alert("No has iniciado sesión.");
        logout();
        window.location.href = LOGIN_URL;
        return;
    }

    // Decodificar token
    const payload = getInfoToken(token);

    // Verificar que el token se haya decodificado correctamente y que no esté expirado
    const now = Math.floor(Date.now() / 1000);
    if (!payload || payload.exp < now) {
        alert("Tu sesión ha expirado o el token es inválido. Por favor, vuelve a iniciar sesión.");
        logout();
        window.location.href = LOGIN_URL;
    }
}

// decodificar la información del token
export function getInfoToken(token) {
    try {
        const payloadBase64 = token.split(".")[1]; // Captura el payload codificado
        const payloadJson = atob(payloadBase64); // Decodifica de Base64 a Json
        const payload = JSON.parse(payloadJson); // Convierte el JSON a un objeto de js
        return payload;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}
