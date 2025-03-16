// inicializar las variables de entorno
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ejecutar función express en variable app
const app = express();

// global middleware
app.use(cors());
app.use(express.json());

// conexion mongoose DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("conexión establecida"))
    .catch((error)=> console.error(`Ocurrio un error: ${error}`));

// Rutas de peticiones
app.get("/",(req, res)=>{
    res.send("Servidor funcionando correctamente");    
});

// rutas de autenticación
app.use("/auth", require("./routes/authRoutes"));
app.use("/categories", require("./routes/categoryRoutes"))
app.use("/expenses", require("./routes/expenseRoutes"))
app.use("/users", require("./routes/userRoutes"))

// inicialización del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT,() =>
    console.log(`Servidor iniciado en http://localhost:${PORT}/`)
)