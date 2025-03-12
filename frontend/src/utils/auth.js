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
    localStorage.removeItem("token");
}