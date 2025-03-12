// paquetes
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

// modelos
const User = require("../models/User");

// middleware
const auth = require("../middleware/auth");

// RUTAS
const router = express.Router();

// ruta para crear el usuario
router.post("/register", async (req, res) => {
    try {
        // se sacan los datos de la peticion
        const {name, email, password} = req.body;

        // validar si el correo es correcto
        if (!validator.isEmail(email)) {
            return res.status(400).json({error: "Email no valido"})
        }

        // validar que la contraseña tenga minimo 6 caracteres
        if (!validator.isLength(password,{min:6})) {
            return res.status(400).json({error: "La contraseña debe tener minimo 6 caracteres"})
        }

        const existingUser = await User.findOne({ email });

        // validar si el correo ya existe
        if (existingUser) {
            return res.status(400).json({error: "ya existe un usuario con este correo"})
        }

        // encriptación de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // creación del usuario
        const user = new User({ name, email, password: hashedPassword})
        await user.save();

        // retorno de la respuesta
        res.status(201).json({message: "usuario registrado con exito"})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

// ruta para Login
router.post("/login", async (req,res) =>{
    try {
        // capturo los campos de la petición
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // validar si el usuario existe
        if (!user) {
            return res.status(400).json({error: "usuario no encontrado"})
        }

        //comparar la contraseña del usuario
        const isMatch = await bcrypt.compare(password, user.password)

        //validar si la contraseña es correcta
        if (!isMatch) {
            return res.status(400).json({error: "La credenciales incorrecta"})
        }

        // se almacena el id, la secret_key y el tiempo de expiración del token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "12h"});

        return res.status(200).json({token});
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
})

// Ruta para verificar el token
router.get("/verify", auth, (req, res) => {

    res.status(200).json({ message: "Token válido", user: req.user });

});


module.exports = router;