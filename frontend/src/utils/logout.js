import { clearToken } from "./auth.js";

export function logout() {
    clearToken();
    window.location.href="login.html";
}