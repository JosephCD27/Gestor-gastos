import { apiFetch } from "../utils/api.js";
import { getToken, verifyUserLogged } from "../utils/auth.js";
import { logout } from "../utils/logout.js";

// referencias del DOM
const list = document.getElementById("expenseList");
const form = document.getElementById("expenseForm")
const expenseId = document.getElementById("expenseId");
const tituloInput = document.getElementById("expenseTitle");
const montoInput = document.getElementById("expenseAmount");
const categoriaSelect = document.getElementById("expenseCategory");
const fechaInput = document.getElementById("expenseDate");
const btnSave = document.getElementById("saveExpense");
const btnUpdate = document.getElementById("updateExpense");
const btnCancel = document.getElementById("cancelUpdate");

async function loadCategories() {
    try {
        const endpoint = "categories";
        const method = "GET";
        const token = getToken();

        const categoryList = await apiFetch(endpoint, method, null, token);

        if (categoryList && categoryList.length > 0) {
            categoryList.forEach(category => {
                const option = document.createElement("option");
                option.value = category._id; 
                option.textContent = category.name; 
                categoriaSelect.appendChild(option);
            });
        } else {
            // Si no hay categorías, se crea una opción por defecto en el select
            const optionDefault = document.createElement("option");
            optionDefault.value = "default";
            optionDefault.disabled = true;
            optionDefault.textContent = "No hay categorías disponibles";
            categoriaSelect.appendChild(optionDefault);
        }
    } catch (error) {
        console.error("Error al cargar las categorías:", error);
    }
}

async function getExpenses() {

    try {
        const endpoint = "expenses/";
        const method = "GET";
        const token = getToken();

        const expenses = await apiFetch(endpoint, method, null, token);

        loadExpenses(expenses)

    } catch (error) {
        console.error("Error al cargar los gastos:", error);
        alert("No se pudieron cargar los gastos")
    }
}

async function loadExpenses(expenseList) {
        list.innerHTML = ""; 
        if (expenseList && expenseList.length > 0) {
            expenseList.forEach(expense => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span>${expense.title}</span>
                    <span>$ ${expense.amount}</span>
                    <span>${expense.date}</span>
    
                    <button class="edit">Editar</button>
                    <button class="delete">eliminar</button>
                `;
    
                li.querySelector(".edit").addEventListener("click", () => editExpense(expense));
                li.querySelector(".delete").addEventListener("click", () => deleteExpense(expense));
    
                list.appendChild(li);
            });

        }else{
            const li = document.createElement("li");
            li.innerHTML = `<span align="center">no hay gastos asociados</span>`;

            list.appendChild(li);
        }
}

async function saveExpense() {
    try {
        const title = tituloInput.value.trim();
        const amount = parseInt(montoInput.value.trim());
        const category = categoriaSelect.value.trim();
        const date = fechaInput.value.trim();

        if (!title || !amount || !category) {
            alert("los campos de titulo, monto y categoria deben ser obligatorios.");
            return;
        }

        const endpoint = "expenses/new";
        const method = "POST";
        const body = { title, amount, category, date}
        const token = getToken();

        await apiFetch(endpoint, method, body, token);
        alert("Gasto guardado correctamente.")
        form.reset();
        getExpenses();
    } catch (error) {
        console.log(error);
        alert(`ocurrio un error inesperado ${error.message}`)
    }
}

function editExpense(expense){
    expenseId.value = expense._id;
    tituloInput.value = expense.title;
    montoInput.value = expense.amount;
    categoriaSelect.value = expense.category;
    fechaInput.value = expense.date.split("T")[0];

    btnSave.style.display = "none";
    btnUpdate.style.display = "inline-block";
    btnCancel.style.display = "inline-block";
}

async function deleteExpense(expense){
    const idExpense = expense._id;

    try {
        if (confirm("Estas seguro que deseas eliminar este gasto?")) {
            const endpoint = `expenses/${idExpense}`;
            const method = "DELETE";
            const token = getToken();
            await apiFetch(endpoint,method, null, token);

            alert("Gasto eliminado correctamente");
            getExpenses();
        }
    } catch (error) {
        console.error(error);
        alert(`Sucedió un error inesperado`);
    }
}

async function updateExpense() {
    const id = expenseId.value.trim();
    const title = tituloInput.value.trim();
    const amount = parseInt(montoInput.value.trim());
    const category = categoriaSelect.value.trim();
    const date = fechaInput.value.trim();

    if (!id || !title || !amount || !category || !date) {
        alert("Completa todos los campos.");
        return;
    }
    try {
        const endpoint = `expenses/${id}`;
        const method = "PUT";
        const body = { title, amount, category, date};
        const token = getToken();


        await apiFetch(endpoint, method, body, token);
        alert("Categoría actualizada correctamente.");

        form.reset();

        btnSave.style.display = "inline-block";
        btnUpdate.style.display = "none";
        btnCancel.style.display = "none";

        getExpenses();
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

async function searchExpense(expenseList, textSearch) {
    try {
        const expenseFiltered = expenseList.filter(expense => expense.title.includes(textSearch))

        loadExpenses(expenseFiltered)
    } catch (error) {
        console.error(error);
        alert(`error al buscar el gasto: ${error.message}`)
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    verifyUserLogged();

    const buscar = document.getElementById("searchInput");
    buscar.placeholder="buscar gasto por titulo";

    getExpenses();
    loadCategories();
});

document.getElementById("searchInput").addEventListener("input", async function() {
    const endpoint = "expenses/";
    const method = "GET";
    const token = getToken();
    const expenses = await apiFetch(endpoint, method, null, token);

    let searchValue = this.value;

    if (searchValue !== "") {
        setTimeout(()=>{
            searchExpense(expenses, searchValue);
        },300)
    } else {
        loadExpenses(expenses);
    }
})

document.getElementById("logout").addEventListener("click", logout);
document.getElementById("saveExpense").addEventListener("click", saveExpense);
document.getElementById("updateExpense").addEventListener("click", updateExpense);
document.getElementById("cancelUpdate").addEventListener("click", cancelUpdate);
