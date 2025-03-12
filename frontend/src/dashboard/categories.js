import { apiFetch } from "../utils/api.js";
import { getToken } from "../utils/auth.js";
import { logout } from "../utils/logout.js";

// referencias a elementos (DOM)

const form = document.getElementById("categoryForm");
const inputName = document.getElementById("categoryName");
const inputId = document.getElementById("categoryId");
const btnSave = document.getElementById("saveCategory");
const btnUpdate = document.getElementById("updateCategory");
const btnCancel = document.getElementById("cancelUpdate");
const list = document.getElementById("categoryList");

async function loadCategories() {
    try {
        const endpoint = "categories";
        const method = "GET";
        const token = getToken();

        const categories = await apiFetch(endpoint, method, null, token);
        list.innerHTML = ""; 

        if (categories && categories.length > 0) {
                categories.forEach((category) => {
                    // Crear un li para cada categoria
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <span>${category.name}</span>
                        <button class="edit">Editar</button>
                        <button class="delete">eliminar</button>
                    `;
                
                    // Darle funcionalidad al boton editar
                    li.querySelector(".edit").addEventListener("click", () => editCategory(category)); 
                    li.querySelector(".delete").addEventListener("click", () => deleteCategory(category)); 
                    list.appendChild(li);
                });
        } else {
            const li = document.createElement("li");
            li.innerHTML = `<span align="center">No existen categorias asociadas</span>`;
            list.appendChild(li);
        }
    } catch (error) {
        console.error("Error al cargar categorías:", error);
        alert("No se pudieron cargar las categorías")
    }
}

function editCategory(category) {
    inputId.value = category._id;
    inputName.value = category.name;
    btnSave.style.display = "none";
    btnUpdate.style.display = "inline-block";
    btnCancel.style.display = "inline-block";
}

async function deleteCategory(category) {
    try {
        if (confirm("Seguro que deseas eliminar esta categoria?")) {
            const endpoint = `categories/${category._id}`;
            const method = "DELETE";
            const token = getToken();
    
            await apiFetch(endpoint, method, null, token);
    
            alert("Categoria eliminada correctamente")

            loadCategories();
        }
    } catch (error) {
        console.error(error);
        alert(`Error al intentar eliminar la Categoria: ${error.message}`)
    }
}

async function saveCategory() {
    const name = inputName.value.trim();
    if (!name) {
        alert("Escribe un nombre para la categoría.");
        return;
    }
    try {
        const token = getToken();
        await apiFetch("categories/new", "POST", { name }, token);
        alert("Categoría guardada correctamente.");
        form.reset();
        loadCategories();
    } catch (error) {
        console.error("Error al guardar la categoría:", error.message);
        alert("No se pudo guardar la categoría.");
    }
}

async function updateCategory() {
    const id = inputId.value;
    const name = inputName.value.trim();
    if (!id || !name) {
        alert("Completa todos los campos.");
        return;
    }
    try {
        const token = getToken();
        await apiFetch(`categories/${id}`, "PUT", { name }, token);
        alert("Categoría actualizada correctamente.");
        form.reset();
        btnSave.style.display = "inline-block";
        btnUpdate.style.display = "none";
        btnCancel.style.display = "none";
        loadCategories();
    } catch (error) {
        console.error("Error al actualizar la categoría:", error.message);
        alert("No se pudo actualizar la categoría.");
    }
}

function cancelUpdate() {
    btnSave.style.display = "inline-block";
    btnUpdate.style.display = "none";
    btnCancel.style.display = "none";
    form.reset();
}

document.addEventListener("DOMContentLoaded", loadCategories);
document.getElementById("logout").addEventListener("click", logout)
btnSave.addEventListener("click", saveCategory);
btnUpdate.addEventListener("click", updateCategory);
btnCancel.addEventListener("click", cancelUpdate);