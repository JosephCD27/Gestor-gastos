import { logout } from "./logout.js";

// sacar el token del localstorage
export function getToken() {
    return localStorage.getItem("token");
}

// guardar el token del localstorage
export function setToken(token) {
    localStorage.setItem("token", token);
}

// eliminar el token del localstorage
export function clearToken() {
    localStorage.removeItem("token"); // o el nombre que usas
    sessionStorage.removeItem("token");
}

export function verifyUserLogged() {
    const token = getToken();

  // 1. Si no hay token, redirige
    if (!token) {
        alert("No has iniciado sesión.");
        logout(); 
        window.location.href = "login.html"; 
    }

  // 2. Verificar si el token expiró 
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
        alert("Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.");
        logout();
        window.location.href = "login.html";
        return;
    }

}