import { apiFetch } from "../utils/api.js";
import { getToken,verifyLogin,getInfoToken } from "../utils/auth.js";
import { logout } from "../utils/logout.js";

// referencias a elementos (DOM)

const form = document.getElementById("categoryForm");
const inputName = document.getElementById("categoryName");
const inputId = document.getElementById("categoryId");
const btnSave = document.getElementById("saveCategory");
const btnUpdate = document.getElementById("updateCategory");
const btnCancel = document.getElementById("cancelUpdate");
const list = document.getElementById("categoryList");
const userName = document.getElementById("userName");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("logout");

const token = getToken();

const API_ENDPOINTS = {
    categories: "categories",
    newCategory: "categories/new",
    searchCategory: (id)=>`categories/${id}`,
    users: (id) => `users/${id}`
};

const API_METHODS = {
    post:"POST",
    get: "GET",
    put: "PUT",
    delete: "DELETE",
};

async function getUser(id) {
    try {
        const users = await apiFetch(API_ENDPOINTS.users(id), API_METHODS.get, null, token);
        
        return users;
    } catch (error) {
        console.log(error);
        alert(`Error encontrado: ${error}`);
    }
}
async function getCategories() {
    try {
        const categories = await apiFetch(API_ENDPOINTS.categories, API_METHODS.get, null, token);

        loadCategories(categories)

    } catch (error) {
        console.error("Error al cargar categorías:", error);
        alert("No se pudieron cargar las categorías")
    }
}

function loadCategories(categoryList) {
    list.innerHTML = ""; 

    if (categoryList && categoryList.length > 0) {
        categoryList.forEach((category) => {
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
    
            await apiFetch(API_ENDPOINTS.searchCategory(category._id), API_METHODS.delete, null, token);
    
            alert("Categoria eliminada correctamente")

            getCategories();
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
        await apiFetch(API_ENDPOINTS.newCategory, API_METHODS.post, { name }, token);
        alert("Categoría guardada correctamente.");
        form.reset();
        getCategories();
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
        await apiFetch(API_ENDPOINTS.searchCategory(id), API_METHODS.put, { name }, token);
        alert("Categoría actualizada correctamente.");

        cancelUpdate()
        getCategories();

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

async function searchCategory(categories, searchText) {
    try {
        const categoriesFiltered = categories.filter(category => category.name.includes(searchText))

        loadCategories(categoriesFiltered);
        
    } catch (error) {
        console.error(error);
        alert(`Error al buscar la categoria: ${error.message}`)
    }
}

document.addEventListener("DOMContentLoaded",async function () {

    verifyLogin();
    const tokenInfo = getInfoToken(token);
    
    const userData = await getUser(tokenInfo.id);

    userName.textContent = `Usuario: ${userData.name}`;
    searchInput.placeholder="buscar categoria por nombre";

    getCategories();
});

document.getElementById("searchInput").addEventListener("input", async function () {
    
    const categories = await apiFetch(API_ENDPOINTS.categories, API_METHODS.get, null, token);

    let searchValue = this.value

    if (searchValue !== "") {
        searchCategory(categories, searchValue)
    } else {
        getCategories();
    }
})

logoutBtn.addEventListener("click", logout)
btnSave.addEventListener("click", saveCategory);
btnUpdate.addEventListener("click", updateCategory);
btnCancel.addEventListener("click", cancelUpdate);